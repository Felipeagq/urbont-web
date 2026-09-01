import { NextResponse } from "next/server";
import { getOtpSendBlocker, getOtpVerifyBlocker, hasJwtSecret, hasSupabase, twilioConfig, appEnv } from "@/lib/server/env";

export const dynamic = "force-dynamic";

/** Diagnóstico: confirma que el runtime de servidor responde y qué variables ve. */
export async function GET() {
  const otpBlocker = getOtpSendBlocker();
  const verifyBlocker = getOtpVerifyBlocker();

  return NextResponse.json({
    ok: otpBlocker === null && verifyBlocker === null,
    env: {
      appEnv: appEnv(),
      nodeEnv: process.env.NODE_ENV ?? "unknown",
      hasJwt: hasJwtSecret(),
      hasSupabase: hasSupabase(),
      hasTwilio: twilioConfig() !== null,
      otpReady: otpBlocker === null,
      otpBlocker,
      verifyReady: verifyBlocker === null,
      verifyBlocker,
    },
  });
}
