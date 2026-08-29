import { NextRequest } from "next/server";
import { withAuth } from "@/lib/server/auth";
import { getSupabase } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

/** Perfil del usuario de la sesión actual. Portado de api/auth/me.ts. */
export const GET = withAuth(async (_req: NextRequest, session) => {
  const { data: profile } = await getSupabase()
    .from("profiles")
    .select("id, phone, email, first_name, last_name, role, status_val, rating, avatar_url, total_rides")
    .eq("id", session.user_id)
    .maybeSingle();

  // Si el perfil no existe todavía, se devuelve el payload del token — mismo
  // comportamiento que el original.
  return Response.json({ user: profile ?? session });
});
