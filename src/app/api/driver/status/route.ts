import { NextRequest } from "next/server";
import { withAuth } from "@/lib/server/auth";
import { getSupabase } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

interface Ride {
  ride_status: string | null;
  fare: number | null;
}

/** Panel del conductor: perfil, documentos, viajes recientes y totales. */
export const GET = withAuth(async (_req: NextRequest, session) => {
  const supabase = getSupabase();

  const [{ data: profile }, { data: documents }, { data: rides }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, first_name, last_name, role, rating, total_rides, avatar_url, vehicle")
      .eq("id", session.user_id)
      .maybeSingle(),
    supabase
      .from("driver_documents")
      .select("status, rejection_reason, license_doc_url, vehicle_registration_url, insurance_doc_url, updated_at")
      .eq("driver_id", session.user_id)
      .maybeSingle(),
    supabase
      .from("rides")
      .select("id, ride_status, fare, created_at, pickup_address, dropoff_address")
      .eq("driver_id", session.user_id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const totalEarnings = ((rides ?? []) as Ride[])
    .filter((r) => r.ride_status === "completed")
    .reduce((sum, r) => sum + (r.fare ?? 0), 0);

  const p = profile as { total_rides?: number; rating?: number } | null;

  return Response.json({
    profile,
    documents,
    recent_rides: rides ?? [],
    stats: {
      total_rides: p?.total_rides ?? 0,
      rating: p?.rating ?? 5.0,
      total_earnings: Number(totalEarnings.toFixed(2)),
    },
  });
});
