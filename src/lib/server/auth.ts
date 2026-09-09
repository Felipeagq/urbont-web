import "server-only";
import { NextRequest } from "next/server";
import { extractBearer, verifySessionToken, verifyUploadToken, type SessionPayload } from "./jwt";

/**
 * Autenticación para route handlers.
 *
 * Sustituye al bloque `verifyToken` + comprobación de Bearer que estaba
 * duplicado, con pequeñas variaciones, en 6 de los 9 handlers originales.
 */
export function authenticate(req: NextRequest): SessionPayload | null {
  const token = extractBearer(req.headers.get("authorization"));
  if (!token) return null;
  return verifySessionToken(token);
}

/** Respuesta JSON de error, con el mismo formato `{ error }` que usaba el original. */
export function errorResponse(message: string, status: number, extra?: Record<string, unknown>): Response {
  return Response.json({ error: message, ...extra }, { status });
}

/**
 * Envuelve un handler exigiendo sesión válida.
 *
 * Ojo: ya no hay capa de CORS. En Vercel el frontend y las funciones podían
 * estar en orígenes distintos; aquí el API vive en el mismo origen que las
 * páginas, así que el navegador no dispara preflight y no hay nada que permitir.
 */
export function withAuth(
  handler: (req: NextRequest, session: SessionPayload) => Promise<Response>,
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    const session = authenticate(req);
    if (!session) return errorResponse("Authentication required.", 401);

    try {
      return await handler(req, session);
    } catch (err) {
      console.error(`[${req.nextUrl.pathname}]`, (err as Error).message);
      return errorResponse("Internal server error.", 500);
    }
  };
}

/**
 * Como withAuth, pero acepta además el token de subida que /api/applications/driver
 * entrega al solicitante recién creado, que aún no tiene sesión.
 *
 * Sólo lo usa /api/driver/documents: el token de subida no abre ningún otro
 * handler, porque verifySessionToken rechaza los tokens con `type`.
 */
export function withUploadAccess(
  handler: (req: NextRequest, userId: string) => Promise<Response>,
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    const token = extractBearer(req.headers.get("authorization"));
    const userId = token
      ? (verifySessionToken(token)?.user_id ?? verifyUploadToken(token)?.user_id ?? null)
      : null;
    if (!userId) return errorResponse("Authentication required.", 401);

    try {
      return await handler(req, userId);
    } catch (err) {
      console.error(`[${req.nextUrl.pathname}]`, (err as Error).message);
      return errorResponse("Internal server error.", 500);
    }
  };
}
