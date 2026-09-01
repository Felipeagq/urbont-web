#!/usr/bin/env node
/**
 * Prueba end-to-end del flujo OTP contra un servidor en marcha.
 * Uso: npm run test:otp
 *      TEST_PHONE=+17864165121 BASE_URL=http://localhost:3000 npm run test:otp
 */

const base = process.env.BASE_URL ?? "http://localhost:3000";
const phone = process.env.TEST_PHONE ?? "+17864165121";

async function main() {
  console.log(`\n🔍 OTP test → ${base}  tel: ${phone}\n`);

  const pingRes = await fetch(`${base}/api/ping`);
  const ping = await pingRes.json();
  console.log("1. /api/ping", pingRes.status, ping);

  if (!ping.env?.hasJwt) {
    console.error("\n❌ Falta JWT_SECRET en el servidor");
    process.exit(1);
  }

  const sendRes = await fetch(`${base}/api/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const send = await sendRes.json();
  console.log("2. /api/otp/send", sendRes.status, {
    success: send.success,
    devCode: send.devCode ?? "(SMS — revisa el teléfono)",
    error: send.error,
  });

  if (!sendRes.ok) {
    console.error("\n❌ Envío falló:", send.error);
    if (ping.env?.appEnv === "production" && !ping.env?.hasTwilio) {
      console.error("   → Configura Twilio o usa APP_ENV=development en .env.local");
    }
    process.exit(1);
  }

  const code = send.devCode ?? process.env.TEST_OTP_CODE;
  if (!code) {
    console.log("\n⚠️  Twilio envió SMS (sin devCode). Revisa el teléfono o define TEST_OTP_CODE.");
    process.exit(0);
  }

  const verifyRes = await fetch(`${base}/api/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code, otpToken: send.otpToken }),
  });
  const verify = await verifyRes.json();
  console.log("3. /api/otp/verify", verifyRes.status, {
    user_id: verify.session?.user_id,
    role: verify.session?.role,
    error: verify.error,
  });

  if (!verifyRes.ok) {
    console.error("\n❌ Verificación falló:", verify.error);
    process.exit(1);
  }

  console.log("\n✅ OTP completo: send + verify OK\n");
}

main().catch((err) => {
  console.error("\n❌", err.message);
  if (err.cause?.code === "ECONNREFUSED") {
    console.error("   → ¿Está corriendo npm run dev?");
  }
  process.exit(1);
});
