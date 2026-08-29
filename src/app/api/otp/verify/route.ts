import { NextRequest, NextResponse } from "next/server";
import { verifyOtpToken } from "@/lib/server/otp";
import { findProfileByPhone, createPhoneUser } from "@/lib/server/supabase";
import { signSessionToken } from "@/lib/server/jwt";
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

    if (!verifyOtpToken(otpToken, phone.trim(), code.trim())) {
      return errorResponse("Invalid or expired code. Please request a new one.", 401);
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return errorResponse("Server not fully configured. Contact support@urbont.com", 503);
    }

    let profile = await findProfileByPhone(phone.trim());
    if (!profile) {
      profile = await createPhoneUser(phone.trim(), {
        first_name: firstName?.trim(),
        email: email?.trim(),
      });
    }

    const sessionToken = signSessionToken({
      user_id: profile.id,
      phone: profile.phone ?? phone.trim(),
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
