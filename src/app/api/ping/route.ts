import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Diagnóstico: confirma que el runtime de servidor responde y qué variables ve. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    env: {
      hasJwt: !!process.env.JWT_SECRET,
      hasSupabase: !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasTwilio: !!process.env.TWILIO_ACCOUNT_SID,
    },
  });
}
