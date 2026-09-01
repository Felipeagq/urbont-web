import "server-only";
import { randomBytes } from "crypto";
import { signJwt, verifyJwt, hmacHex } from "./jwt";
import { twilioConfig } from "./env";

/**
 * OTP por SMS. Portado de api/_lib/otp.ts y api/otp/send.ts.
 *
 * El diseño original se conserva: el código nunca se guarda en base de datos.
 * Se devuelve un token firmado que contiene el HMAC del par teléfono:código, y
 * al verificar se recalcula. Es stateless y no requiere almacenamiento.
 */

/** Código numérico de 6 dígitos con entropía criptográfica. */
export function generateCode(): string {
  const n = randomBytes(4).readUInt32BE(0) % 900000;
  return String(100000 + n);
}

/** Token que acredita "se envió este código a este teléfono". Vive 10 minutos. */
export function signOtpToken(phone: string, code: string): string {
  return signJwt({ phone, codeHash: hmacHex(`${phone}:${code}`), type: "otp" }, 600);
}

export function verifyOtpToken(token: string, phone: string, code: string): boolean {
  const payload = verifyJwt(token);
  if (!payload) return false;
  if (payload["type"] !== "otp") return false;
  if (payload["phone"] !== phone) return false;
  return payload["codeHash"] === hmacHex(`${phone}:${code}`);
}

export { isValidPhone, normalizePhone } from "@/lib/phone";

export function isTwilioConfigured(): boolean {
  return twilioConfig() !== null;
}

export async function sendSmsTwilio(to: string, body: string): Promise<void> {
  const config = twilioConfig();
  if (!config) throw new Error("Twilio credentials not configured.");

  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.sid}/Messages.json`;
  const creds = Buffer.from(`${config.sid}:${config.authToken}`).toString("base64");

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: config.from, Body: body }).toString(),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    const cause = (err as Error & { cause?: { code?: string; message?: string } }).cause;
    const detail = cause?.code ?? cause?.message;
    throw new Error(detail ? `fetch failed (${detail})` : "fetch failed");
  }

  const data = (await res.json()) as { error_code?: number; message?: string };
  if (!res.ok) throw new Error(`Twilio ${data.error_code ?? res.status}: ${data.message}`);
}
