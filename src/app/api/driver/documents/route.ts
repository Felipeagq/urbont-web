import { NextRequest } from "next/server";
import { withAuth, errorResponse } from "@/lib/server/auth";
import { getSupabase } from "@/lib/server/supabase";
import { supabaseUrl } from "@/lib/server/env";

export const dynamic = "force-dynamic";

/**
 * Documentos del conductor. Portado de api/driver/documents.ts.
 *
 * GET  — estado actual de los documentos.
 * POST — genera una URL firmada para subir un documento a Supabase Storage.
 */

type DocField =
  | "license_doc_url"
  | "profile_photo_url"
  | "bg_check_url"
  | "vehicle_registration_url"
  | "personal_insurance_url"
  | "commercial_insurance_url"
  | "vehicle_inspection_url"
  | "tnc_permit_url"
  | "defensive_driving_url"
  | "w9_url"
  | "drug_test_url"
  // Alias heredado: se mantiene por compatibilidad con clientes antiguos.
  | "insurance_doc_url";

const VALID_FIELDS: DocField[] = [
  "license_doc_url",
  "profile_photo_url",
  "bg_check_url",
  "vehicle_registration_url",
  "personal_insurance_url",
  "commercial_insurance_url",
  "vehicle_inspection_url",
  "tnc_permit_url",
  "defensive_driving_url",
  "w9_url",
  "drug_test_url",
  "insurance_doc_url",
];

// Columnas que existen hoy en Supabase.
const EXISTING_COLUMNS =
  "id, status, rejection_reason, license_doc_url, vehicle_registration_url, insurance_doc_url, updated_at";
// Columnas de la migración a 11 documentos: sólo disponibles tras ejecutarla.
const NEW_COLUMNS =
  "profile_photo_url, bg_check_url, personal_insurance_url, commercial_insurance_url, vehicle_inspection_url, tnc_permit_url, defensive_driving_url, w9_url, drug_test_url";

const BUCKET = "driver-documents";

export const GET = withAuth(async (_req: NextRequest, session) => {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("driver_documents")
    .select(`${EXISTING_COLUMNS}, ${NEW_COLUMNS}`)
    .eq("driver_id", session.user_id)
    .maybeSingle();

  // Si las columnas nuevas aún no existen (pre-migración), se reintenta con las
  // antiguas. Este repliegue venía del original y se conserva.
  if (error?.message?.includes("column") || error?.message?.includes("does not exist")) {
    const { data: fallback, error: fbErr } = await supabase
      .from("driver_documents")
      .select(EXISTING_COLUMNS)
      .eq("driver_id", session.user_id)
      .maybeSingle();
    if (fbErr) throw fbErr;
    return Response.json({ documents: fallback ?? null });
  }

  if (error) throw error;
  return Response.json({ documents: data ?? null });
});

export const POST = withAuth(async (req: NextRequest, session) => {
  const supabase = getSupabase();

  const { field, filename, content_type } = (await req.json()) as {
    field?: DocField;
    filename?: string;
    content_type?: string;
  };

  if (!field || !VALID_FIELDS.includes(field)) {
    return errorResponse(`field must be one of: ${VALID_FIELDS.join(", ")}`, 400);
  }
  if (!filename || !content_type) {
    return errorResponse("filename and content_type are required.", 400);
  }

  const ext = filename.split(".").pop() ?? "jpg";
  const storagePath = `${session.user_id}/${field}/${Date.now()}.${ext}`;

  // URL firmada de subida (válida 5 minutos).
  const { data: signedData, error: signedErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(storagePath);
  if (signedErr) throw signedErr;

  // Se preregistra la ruta para saber que el archivo está en camino.
  await supabase.from("driver_documents").upsert(
    {
      driver_id: session.user_id,
      [field]: storagePath,
      status: "pending_documents",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "driver_id" },
  );

  return Response.json({
    upload_url: signedData.signedUrl,
    token: signedData.token,
    path: storagePath,
    public_url: `${supabaseUrl()}/storage/v1/object/public/${BUCKET}/${storagePath}`,
  });
});
