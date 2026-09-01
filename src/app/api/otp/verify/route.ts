import { NextRequest, NextResponse } from "next/server";
import { verifyOtpToken, normalizePhone } from "@/lib/server/otp";
import { findProfileByPhone, createPhoneUser } from "@/lib/server/supabase";
import { signSessionToken } from "@/lib/server/jwt";
import { getOtpVerifyBlocker } from "@/lib/server/env";
import { errorResponse } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

/**
 * Verifica el código OTP y abre sesión. Portado de api/otp/verify.ts.
 *
 * Tres pasos, igual que el original:
 *   1. Validar la firma del token OTP (stateless, sin base de datos).
 *   2. Buscar o crear el usuario en Supabase.
 *   3. Emitir un JWT de sesión de 30 días.
 */
export async function POST(req: NextRequest) {
  try {
    const { phone, code, otpToken, firstName, email } = (await req.json()) as {
      phone?: string;
      code?: string;
      otpToken?: string;
      firstName?: string;
      email?: string;
    };

    if (!phone || !code || !otpToken) {
      return errorResponse("Missing phone, code, or otpToken.", 400);
    }

    const phoneNorm = normalizePhone(phone);
    if (!phoneNorm) {
      return errorResponse("Invalid phone.", 400);
    }

    if (!verifyOtpToken(otpToken, phoneNorm, code.trim())) {
      return errorResponse("Invalid or expired code. Please request a new one.", 401);
    }

    const configBlocker = getOtpVerifyBlocker();
    if (configBlocker) {
      console.error(`[otp/verify] Missing config: ${configBlocker}`);
      return errorResponse("Server not fully configured. Contact support@urbont.com", 503, {
        missing: configBlocker,
      });
    }

    let profile = await findProfileByPhone(phoneNorm);
    if (!profile) {
      profile = await createPhoneUser(phoneNorm, {
        first_name: firstName?.trim(),
        email: email?.trim(),
      });
    }

    const sessionToken = signSessionToken({
      user_id: profile.id,
      phone: profile.phone ?? phoneNorm,
      role: profile.role,
    });

    return NextResponse.json({
      session: {
        access_token: sessionToken,
        user_id: profile.id,
        phone: profile.phone,
        role: profile.role,
      },
      profile: {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        status_val: profile.status_val,
      },
    });
  } catch (err) {
    console.error("[otp/verify]", (err as Error).message);
    return errorResponse("Internal server error. Please try again.", 500);
  }
}
