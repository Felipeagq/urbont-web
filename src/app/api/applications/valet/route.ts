import { NextRequest, NextResponse } from "next/server";
import { getSupabase, findProfileByPhone, findProfileByEmail, createPhoneUser } from "@/lib/server/supabase";
import { errorResponse } from "@/lib/server/auth";
import { signUploadToken } from "@/lib/server/jwt";
import { isValidPhone, normalizePhone } from "@/lib/phone";

export const dynamic = "force-dynamic";

/**
 * Solicitud de alta como Valet Front Desk. Endpoint público: lo llama el paso 4
 * del formulario de /valet, donde el solicitante todavía no tiene cuenta.
 *
 * El endpoint faltaba por completo: el formulario llevaba haciendo POST contra
 * un 404 y, como no comprobaba la respuesta, enseñaba "solicitud enviada"
 * igualmente. Todas las solicitudes de valet se perdían, y los dos documentos
 * que la pantalla decía subir no se subían a ningún sitio.
 *
 * Es el gemelo de `applications/driver`, con dos diferencias: escribe en
 * `valet_applications` y crea el perfil con rol `valet`, que es lo que hace que
 * el backend le pida sólo identidad y no le exija vehículo
 * (ver `services/docCatalog.ts`, VALET_DOC_KEYS).
 *
 * Los archivos no viajan aquí. Se devuelve un `upload_token` de una hora con el
 * que el formulario sube cada documento a /api/driver/documents, igual que el
 * alta de conductor.
 *
 * LÍMITE CONOCIDO: el teléfono no se verifica, así que cualquiera puede enviar
 * una solicitud con datos ajenos y adjuntar documentos a ese perfil. El daño
 * queda acotado: el token sólo sirve para subir archivos, que el admin revisa
 * antes de aprobar, y no abre la sesión de la cuenta ni permite leer sus datos.
 */

/** Campos obligatorios, en el orden en que los pide el formulario. */
const REQUIRED_FIELDS = [
  "city",
  "firstName",
  "lastName",
  "email",
  "phone",
  "birthDate",
  "idNumber",
  "experienceLevel",
  "venueType",
  "schedule",
  "languages",
] as const;

type Payload = Record<(typeof REQUIRED_FIELDS)[number], string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Payload>;

    const missing = REQUIRED_FIELDS.filter((f) => !body[f]?.trim());
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(", ")}`, 400);
    }
    const data = body as Payload;

    const email = data.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return errorResponse("Invalid email address.", 400);
    }

    const phone = normalizePhone(data.phone);
    if (!isValidPhone(phone)) {
      return errorResponse("Invalid phone. Use international format (+13055551234).", 400);
    }

    // Upsert por email, igual que en el alta de conductor: volver a postularse
    // tras un rechazo debe pisar la solicitud anterior, no reventar con un 500
    // por clave duplicada.
    const { data: inserted, error } = await getSupabase()
      .from("valet_applications")
      .upsert({
        city: data.city.trim(),
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email,
        phone,
        birth_date: data.birthDate.trim(),
        id_number: data.idNumber.trim(),
        experience_level: data.experienceLevel.trim(),
        venue_type: data.venueType.trim(),
        schedule: data.schedule.trim(),
        languages: data.languages.trim(),
        status: "pending",
        updated_at: new Date().toISOString(),
      }, { onConflict: "email" })
      .select("id")
      .single();
    if (error) throw error;

    const applicationId = (inserted as { id: number }).id;

    // Identidad para colgar los documentos. Se busca por teléfono Y por email:
    // quien ya entró con Google tiene perfil con email pero sin teléfono.
    const existing = (await findProfileByPhone(phone)) ?? (await findProfileByEmail(email));

    let uploadToken: string;
    try {
      const profileId =
        existing?.id ??
        (
          await createPhoneUser(phone, {
            first_name: data.firstName.trim(),
            last_name: data.lastName.trim(),
            email,
            role: "valet",
            // Entra en revisión: el panel lo aprueba antes de que pueda despachar.
            account_status: "pending",
          })
        ).id;

      uploadToken = signUploadToken(profileId);
    } catch (err) {
      // La solicitud ya quedó guardada: no se pierde aunque falle la creación
      // del perfil (p. ej. email ya usado por otra cuenta).
      console.error("[applications/valet] profile creation failed:", (err as Error).message);
      return NextResponse.json({
        success: true,
        application_id: applicationId,
        status: "pending",
        requires_login: true,
        message: "Application received. Log in to upload your documents.",
      });
    }

    return NextResponse.json({
      success: true,
      application_id: applicationId,
      status: "pending",
      upload_token: uploadToken,
    });
  } catch (err) {
    console.error("[applications/valet]", (err as Error).message);
    return errorResponse("Internal server error.", 500);
  }
}
