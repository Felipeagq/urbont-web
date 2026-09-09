import { NextRequest } from "next/server";
import { withAuth, errorResponse } from "@/lib/server/auth";
import { getSupabase } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

/**
 * Alta de conductor: pasa el perfil a rol `chauffeur` y crea la fila de
 * documentos en estado pendiente. Portado de api/driver/register.ts.
 */
export const POST = withAuth(async (req: NextRequest, session) => {
  const supabase = getSupabase();

  const {
    first_name, last_name, email, phone, city,
    vehicle_make, vehicle_model, vehicle_year,
    vehicle_type, vehicle_color, vehicle_plate, vehicle_seats,
  } = (await req.json()) as Record<string, string | undefined>;

  if (!first_name || !last_name) {
    return errorResponse("first_name and last_name are required.", 400);
  }

  const { error: profErr } = await supabase
    .from("profiles")
    .update({
      first_name,
      last_name,
      email: email ?? null,
      phone: phone ?? null,
      role: "chauffeur",
      title: city ? `Driver — ${city}` : "Driver",
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user_id);
  if (profErr) throw profErr;

  // Aquí no se toca driver_documents. La versión anterior insertaba una fila
  // suelta con `onConflict: "driver_id"`, que además de necesitar un índice
  // único inexistente creaba un documento sin `doc_key`: en el modelo de una
  // fila por documento, cada fila la crea su propia subida en
  // /api/driver/documents.

  // Datos del vehículo en la columna JSONB del perfil.
  await supabase
    .from("profiles")
    .update({
      vehicle: {
        make: vehicle_make, model: vehicle_model, year: vehicle_year,
        type: vehicle_type, color: vehicle_color,
        plate: vehicle_plate, seats: vehicle_seats,
      },
    })
    .eq("id", session.user_id);

  return Response.json({
    success: true,
    status: "pending_documents",
    message: "Registration saved. Please upload your documents to complete the application.",
  });
});
