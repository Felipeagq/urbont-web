import { NextRequest } from "next/server";
import { withUploadAccess, errorResponse } from "@/lib/server/auth";
import { getSupabase } from "@/lib/server/supabase";
import { supabaseUrl } from "@/lib/server/env";
import { DOCS_BUCKET, DOC_KEY_LIST, isDocKey } from "@/lib/driver-documents";

export const dynamic = "force-dynamic";

/**
 * Documentos del conductor.
 *
 * GET  — documentos ya subidos, indexados por doc_key.
 * POST — URL firmada para subir un documento y registro de la fila.
 *
 * MODELO — `driver_documents` guarda UNA FILA POR DOCUMENTO, identificada por
 * `doc_key`. La versión anterior de este archivo asumía una columna por
 * documento (`license_doc_url`, `profile_photo_url`, …): ninguna de esas
 * columnas existe en Supabase, así que ambos handlers fallaban contra la base
 * real. El esquema de filas es el que ya escriben la app móvil y el backend de
 * app.urbont.com, y es el que se respeta aquí.
 *
 * Columnas vivas de la tabla, comprobadas contra producción:
 *   - `storage_url` e `image_url` llevan la URL pública (las dos, poblada al
 *     100%: distintos clientes leen una u otra).
 *   - `url` está nula en todas las filas — columna muerta, no se escribe.
 *   - `status` es el estado real; `doc_status` quedó desincronizado y tampoco
 *     se toca.
 *   - `document_type` duplica `doc_key`; se escriben ambas por compatibilidad.
 */

/** Columnas que se devuelven al cliente. */
const ROW_COLUMNS =
  "id, doc_key, storage_url, image_url, file_name, status, rejection_reason, uploaded_at, updated_at";

interface DocRow {
  id: string;
  doc_key: string;
  [key: string]: unknown;
}

export const GET = withUploadAccess(async (_req: NextRequest, userId) => {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("driver_documents")
    .select(ROW_COLUMNS)
    .eq("driver_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;

  const rows = (data ?? []) as unknown as DocRow[];

  // Indexado por doc_key para que el cliente no tenga que recorrer el array.
  // Al venir ordenado por updated_at desc, si hubiera filas repetidas para una
  // misma clave gana la más reciente.
  const documents: Record<string, DocRow> = {};
  for (const row of rows) {
    if (row.doc_key && !(row.doc_key in documents)) documents[row.doc_key] = row;
  }

  return Response.json({ documents, count: rows.length });
});

export const POST = withUploadAccess(async (req: NextRequest, userId) => {
  const supabase = getSupabase();

  const body = (await req.json()) as {
    doc_key?: string;
    filename?: string;
    content_type?: string;
  };
  const { doc_key, filename, content_type } = body;

  if (!isDocKey(doc_key)) {
    return errorResponse(`doc_key must be one of: ${DOC_KEY_LIST.join(", ")}`, 400);
  }
  if (!filename || !content_type) {
    return errorResponse("filename and content_type are required.", 400);
  }

  // Misma convención que las filas ya existentes: <driver_id>/<doc_key>.<ext>,
  // de modo que volver a subir un documento reemplaza el anterior en Storage.
  const ext = (filename.split(".").pop() ?? "jpg").toLowerCase();
  const storagePath = `${userId}/${doc_key}.${ext}`;
  const publicUrl = `${supabaseUrl()}/storage/v1/object/public/${DOCS_BUCKET}/${storagePath}`;

  const { data: signedData, error: signedErr } = await supabase.storage
    .from(DOCS_BUCKET)
    .createSignedUploadUrl(storagePath, { upsert: true });
  if (signedErr) throw signedErr;

  // La tabla no tiene índice único en (driver_id, doc_key), así que no se puede
  // usar upsert con onConflict: se busca la fila y se actualiza, o se inserta.
  const now = new Date().toISOString();
  const { data: existing, error: findErr } = await supabase
    .from("driver_documents")
    .select("id")
    .eq("driver_id", userId)
    .eq("doc_key", doc_key)
    .maybeSingle();
  if (findErr) throw findErr;

  const fields = {
    storage_url: publicUrl,
    image_url: publicUrl,
    file_name: filename,
    status: "pending",
    rejection_reason: null,
    updated_at: now,
  };

  if (existing) {
    const { error } = await supabase
      .from("driver_documents")
      .update(fields)
      .eq("id", (existing as { id: string }).id);
    if (error) throw error;
  } else {
    // `driver_name` es obligatorio en la práctica: el panel de administración lo
    // usa sin comprobar nulos (`d.driverName.toLowerCase()`), así que una fila
    // sin nombre rompe su listado de documentos entero.
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", userId)
      .maybeSingle();
    const p = profile as { first_name?: string | null; last_name?: string | null } | null;
    const driverName = [p?.first_name, p?.last_name].filter(Boolean).join(" ").trim();

    const { error } = await supabase.from("driver_documents").insert({
      driver_id: userId,
      doc_key,
      document_type: doc_key,
      driver_name: driverName || "Sin nombre",
      uploaded_at: now,
      created_at: now,
      ...fields,
    });
    if (error) throw error;
  }

  return Response.json({
    upload_url: signedData.signedUrl,
    token: signedData.token,
    path: storagePath,
    public_url: publicUrl,
  });
});
