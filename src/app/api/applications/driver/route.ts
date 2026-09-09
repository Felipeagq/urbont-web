import { NextRequest, NextResponse } from "next/server";
import { getSupabase, findProfileByPhone, findProfileByEmail, createPhoneUser } from "@/lib/server/supabase";
import { errorResponse } from "@/lib/server/auth";
import { signUploadToken } from "@/lib/server/jwt";
import { isValidPhone, normalizePhone } from "@/lib/phone";

export const dynamic = "force-dynamic";

/**
 * Solicitud de alta como conductor. Endpoint público: lo llama el paso 4 del
 * formulario de /conductor, donde el solicitante todavía no tiene cuenta.
 *
 * Escribe en `driver_applications`, tabla que ya existía en Supabase y cuyas
 * columnas calzan una a una con los campos del formulario. El endpoint faltaba
 * por completo: el formulario llevaba tiempo haciendo POST contra un 404, así
 * que todas las solicitudes se perdían.
 *
 * Los archivos no viajan en esta petición. Como `driver_documents` se indexa por
 * el uuid del conductor, aquí se resuelve su identidad —reusando el perfil si ya
 * existe, creándolo si no— y se devuelve un `upload_token` de una hora con el que
 * el formulario sube cada documento a /api/driver/documents.
 *
 * LÍMITE CONOCIDO: el teléfono no se verifica, así que cualquiera puede enviar
 * una solicitud con datos ajenos y adjuntar documentos a ese perfil. El daño
 * queda acotado a eso: el token sólo sirve para subir archivos, que el admin
 * revisa antes de aprobar, y no abre la sesión de la cuenta ni permite leer sus
 * datos. Cerrarlo del todo exige verificar por SMS con el flujo OTP de /login.
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
  "vehicleMake",
  "vehicleModel",
  "vehicleYear",
  "vehicleColor",
  "licensePlate",
  "vehicleType",
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

    // `driver_applications` tiene un índice único en email: con `insert`, volver
    // a postularse —tras un rechazo, o simplemente reenviando— devolvía un 500
    // por clave duplicada. Con upsert, la nueva solicitud pisa la anterior y
    // vuelve a quedar pendiente de revisión.
    const { data: inserted, error } = await getSupabase()
      .from("driver_applications")
      .upsert({
        city: data.city.trim(),
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email,
        phone,
        birth_date: data.birthDate.trim(),
        id_number: data.idNumber.trim(),
        vehicle_make: data.vehicleMake.trim(),
        vehicle_model: data.vehicleModel.trim(),
        vehicle_year: data.vehicleYear.trim(),
        vehicle_color: data.vehicleColor.trim(),
        license_plate: data.licensePlate.trim().toUpperCase(),
        vehicle_type: data.vehicleType.trim(),
        status: "pending",
        updated_at: new Date().toISOString(),
      }, { onConflict: "email" })
      .select("id")
      .single();
    if (error) throw error;

    const applicationId = (inserted as { id: number }).id;

    // Identidad para colgar los documentos. Se busca por teléfono Y por email:
    // quien ya entró con Google tiene perfil con email pero sin teléfono, y
    // buscar sólo por teléfono hacía que el alta explotara con "email already
    // registered" y el solicitante se quedara sin poder subir nada.
    //
    // Reutilizar un perfil existente es aceptable porque el token que se emite
    // sólo sirve para adjuntar documentos: no abre la sesión de esa cuenta ni
    // deja leer sus datos (ver withUploadAccess). Un pasajero que se postula a
    // conductor conserva así su misma cuenta.
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
            role: "chauffeur",
          })
        ).id;
      uploadToken = signUploadToken(profileId);
    } catch (err) {
      // La solicitud ya quedó guardada: no se pierde aunque falle la creación
      // del perfil (p. ej. email ya usado por otra cuenta).
      console.error("[applications/driver] profile creation failed:", (err as Error).message);
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
    console.error("[applications/driver]", (err as Error).message);
    return errorResponse("Internal server error.", 500);
  }
}
