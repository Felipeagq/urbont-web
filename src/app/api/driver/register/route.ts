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

  const { data: docData, error: docErr } = await supabase
    .from("driver_documents")
    .upsert(
      {
        driver_id: session.user_id,
        status: "pending_documents",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "driver_id" },
    )
    .select()
    .single();
  if (docErr) throw docErr;

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
    document_id: (docData as { id: string }).id,
    status: "pending_documents",
    message: "Registration saved. Please upload your documents to complete the application.",
  });
});
