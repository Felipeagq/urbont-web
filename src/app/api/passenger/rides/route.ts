import { NextRequest } from "next/server";
import { withAuth } from "@/lib/server/auth";
import { getSupabase } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

interface Ride {
  ride_status: string | null;
  fare: number | null;
}

/** Historial de viajes del pasajero, paginado. Portado de api/passenger/rides.ts. */
export const GET = withAuth(async (req: NextRequest, session) => {
  const supabase = getSupabase();

  const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10);
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "20", 10), 50);
  const offset = (page - 1) * limit;

  const [{ data: profile }, { data: rides, count }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, first_name, last_name, total_rides, rating, avatar_url")
      .eq("id", session.user_id)
      .maybeSingle(),
    supabase
      .from("rides")
      .select(
        `id, ride_status, fare, vehicle_type, pickup_address, dropoff_address, created_at, scheduled_at, payment_method,
         driver:profiles!driver_id (first_name, last_name, rating, avatar_url)`,
        { count: "exact" },
      )
      .eq("passenger_id", session.user_id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1),
  ]);

  const totalSpent = ((rides ?? []) as unknown as Ride[])
    .filter((r) => r.ride_status === "completed")
    .reduce((sum, r) => sum + (r.fare ?? 0), 0);

  const p = profile as { total_rides?: number; rating?: number } | null;

  return Response.json({
    profile,
    rides: rides ?? [],
    pagination: { page, limit, total: count ?? 0 },
    stats: {
      total_rides: p?.total_rides ?? 0,
      total_spent: Number(totalSpent.toFixed(2)),
      rating: p?.rating ?? 5.0,
    },
  });
});
