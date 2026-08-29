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

export const supabaseUrl = () => required("SUPABASE_URL");
export const supabaseServiceRoleKey = () => required("SUPABASE_SERVICE_ROLE_KEY");

/** Twilio es opcional: sin él no se pueden enviar SMS, pero el resto funciona. */
export function twilioConfig(): { sid: string; authToken: string; from: string } | null {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !authToken || !from) return null;
  return { sid, authToken, from };
}

/**
 * Sólo cuando esto es cierto se permite devolver el código OTP en la respuesta.
 * En el original no había ninguna comprobación: si faltaba cualquier variable de
 * Twilio en producción, el código viajaba en el JSON y el login quedaba abierto.
 */
export const isDevelopment = () => process.env.NODE_ENV !== "production";
