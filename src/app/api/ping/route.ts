import { NextResponse } from "next/server";
import { getOtpSendBlocker, hasJwtSecret, hasSupabase, twilioConfig, appEnv } from "@/lib/server/env";

export const dynamic = "force-dynamic";

/** Diagnóstico: confirma que el runtime de servidor responde y qué variables ve. */
export async function GET() {
  const otpBlocker = getOtpSendBlocker();

  return NextResponse.json({
    ok: otpBlocker === null,
    env: {
      appEnv: appEnv(),
      nodeEnv: process.env.NODE_ENV ?? "unknown",
      hasJwt: hasJwtSecret(),
      hasSupabase: hasSupabase(),
      hasTwilio: twilioConfig() !== null,
      otpReady: otpBlocker === null,
      otpBlocker,
    },
  });
}
