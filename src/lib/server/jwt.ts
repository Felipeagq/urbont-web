import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { jwtSecret } from "./env";

/**
 * JWT HS256 propio, portado de api/_lib/jwt.ts.
 *
 * En el original esta lógica estaba además copiada dentro de casi todos los
 * handlers (auth/me, users/profile, driver/*, passenger/rides), cada uno con su
 * variante. Aquí existe una sola vez.
 */

export interface SessionPayload {
  user_id: string;
  phone: string;
  role: string;
}

const b64u = (s: string) => Buffer.from(s).toString("base64url");
const fromB64u = (s: string) => Buffer.from(s, "base64url").toString("utf8");
const hmacB64u = (data: string) => createHmac("sha256", jwtSecret()).update(data).digest("base64url");

export const hmacHex = (data: string) => createHmac("sha256", jwtSecret()).update(data).digest("hex");

/** Comparación en tiempo constante — evita filtrar la firma por temporización. */
export function safeEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "base64url");
    const bb = Buffer.from(b, "base64url");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export function signJwt(payload: Record<string, unknown>, expiresInSeconds: number): string {
  const header = b64u(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const body = b64u(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds }));
  return `${header}.${body}.${hmacB64u(`${header}.${body}`)}`;
}

/** Devuelve el payload si la firma es válida y no ha expirado; si no, null. */
export function verifyJwt(token: string): Record<string, unknown> | null {
  try {
    const [header, body, sig] = token.split(".");
    if (!header || !body || !sig) return null;
    if (!safeEqual(sig, hmacB64u(`${header}.${body}`))) return null;

    const payload = JSON.parse(fromB64u(body)) as Record<string, unknown>;
    const exp = payload["exp"] as number | undefined;
    if (exp !== undefined && exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Token de sesión de 30 días, igual que en el original. */
export function signSessionToken(payload: SessionPayload): string {
  return signJwt({ ...payload }, 60 * 60 * 24 * 30);
}

export function verifySessionToken(token: string): SessionPayload | null {
  const payload = verifyJwt(token);
  if (!payload) return null;
  return payload as unknown as SessionPayload;
}

/** Extrae el token de una cabecera `Authorization: Bearer <token>`. */
export function extractBearer(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
