import "server-only";

/**
 * Acceso a variables de entorno del servidor, con validación.
 *
 * CAMBIO RESPECTO AL ORIGINAL — el código de Vercel hacía:
 *
 *     const JWT_SECRET = process.env.JWT_SECRET || "urbont-dev-secret-change-in-prod";
 *
 * Ese fallback es un agujero de seguridad: el secreto está en el repositorio,
 * así que si la variable falta en el entorno, cualquiera puede firmar un token
 * válido y suplantar a cualquier usuario. Aquí falla ruidosamente en su lugar.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. ` +
        `Defínela en .env.local (desarrollo) o en las variables de entorno de Amplify (producción).`,
    );
  }
  return value;
}

/** Secreto de firma de JWT y tokens OTP. Sin valor por defecto, a propósito. */
export const jwtSecret = () => required("JWT_SECRET");

export const hasJwtSecret = () => !!process.env.JWT_SECRET?.trim();

export const supabaseUrl = () => required("SUPABASE_URL");
export const supabaseServiceRoleKey = () => required("SUPABASE_SERVICE_ROLE_KEY");

export const hasSupabase = () =>
  !!process.env.SUPABASE_URL?.trim() && !!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

function isPlaceholderTwilio(sid: string, authToken: string): boolean {
  if (/x{4,}/i.test(sid)) return true;
  if (authToken === "your_auth_token") return true;
  if (!/^AC[0-9a-fA-F]{32}$/.test(sid)) return true;
  return false;
}

/** Twilio es opcional: sin él no se pueden enviar SMS, pero el resto funciona. */
export function twilioConfig(): { sid: string; authToken: string; from: string } | null {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_PHONE_NUMBER?.trim();
  if (!sid || !authToken || !from) return null;
  if (isPlaceholderTwilio(sid, authToken)) return null;
  return { sid, authToken, from };
}

/**
 * Entorno lógico de la aplicación, independiente de NODE_ENV de Next.js.
 * Por defecto: production (comportamiento estricto, SMS real, sin devCode).
 * En local: APP_ENV=development en .env.local para OTP de prueba sin Twilio.
 */
export type AppEnv = "production" | "development";

const APP_ENV_VALUES: AppEnv[] = ["production", "development"];

export function appEnv(): AppEnv {
  const raw = process.env.APP_ENV?.trim().toLowerCase();
  if (!raw) return "production";
  if (APP_ENV_VALUES.includes(raw as AppEnv)) return raw as AppEnv;
  console.warn(`[env] APP_ENV inválido "${raw}", usando production`);
  return "production";
}

export const isDevelopment = () => appEnv() === "development";
export const isProduction = () => appEnv() === "production";

/** Razón por la que el OTP no puede enviarse en producción; null si la config básica está lista. */
export function getOtpSendBlocker(): string | null {
  if (!hasJwtSecret()) return "JWT_SECRET";
  if (isProduction() && !twilioConfig()) return "TWILIO";
  return null;
}
