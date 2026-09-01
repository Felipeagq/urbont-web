import { NextRequest, NextResponse } from "next/server";
import { generateCode, signOtpToken, isValidPhone, normalizePhone, isTwilioConfigured, sendSmsTwilio } from "@/lib/server/otp";
import { isDevelopment, getOtpSendBlocker } from "@/lib/server/env";
import { errorResponse } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

/**
 * Envía un código OTP por SMS. Portado de api/otp/send.ts.
 *
 * CAMBIO DE SEGURIDAD respecto al original: cuando Twilio no está configurado,
 * el original devolvía el código en la respuesta (`devCode`) sin comprobar el
 * entorno. Aquí el `devCode` sólo sale con `APP_ENV=development`; con el valor
 * por defecto (`production`) sin Twilio se responde 503.
 */
export async function POST(req: NextRequest) {
  try {
    const { phone } = (await req.json()) as { phone?: string };

    const phoneNorm = phone ? normalizePhone(phone) : "";
    if (!phoneNorm || !isValidPhone(phoneNorm)) {
      return errorResponse("Invalid phone. Use international format (+13055551234).", 400);
    }

    const configBlocker = getOtpSendBlocker();
    if (configBlocker) {
      console.error(`[otp/send] Missing production config: ${configBlocker}`);
      const message = configBlocker === "TWILIO"
        ? "SMS service is not configured. Contact support@urbont.com"
        : "Server not fully configured. Contact support@urbont.com";
      return errorResponse(message, 503, { missing: configBlocker });
    }

    const code = generateCode();
    const otpToken = signOtpToken(phoneNorm, code);

    if (isTwilioConfigured()) {
      try {
        await sendSmsTwilio(phoneNorm, `Your URBONT verification code is: ${code}. Valid for 10 minutes.`);
        return NextResponse.json({ success: true, otpToken });
      } catch (err) {
        if (isDevelopment()) {
          console.warn("[otp/send] Twilio failed in development, returning devCode:", (err as Error).message);
          return NextResponse.json({ success: true, otpToken, devCode: code });
        }
        return errorResponse(`SMS error: ${(err as Error).message}`, 503);
      }
    }

    if (!isDevelopment()) {
      return errorResponse("SMS service is not configured. Contact support@urbont.com", 503);
    }

    // Sólo en desarrollo: permite probar el flujo sin credenciales de Twilio.
    return NextResponse.json({ success: true, otpToken, devCode: code });
  } catch (err) {
    console.error("[otp/send]", (err as Error).message);
    return errorResponse("Internal server error.", 500);
  }
}
