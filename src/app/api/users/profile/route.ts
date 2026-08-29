import { NextRequest } from "next/server";
import { withAuth, errorResponse } from "@/lib/server/auth";
import { getSupabase } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

const COLUMNS =
  "id, phone, email, first_name, last_name, role, status_val, rating, avatar_url, total_rides, created_at";

/** Lee el perfil del usuario autenticado. Portado de api/users/profile.ts. */
export const GET = withAuth(async (_req: NextRequest, session) => {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select(COLUMNS)
    .eq("id", session.user_id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return errorResponse("Profile not found.", 404);

  return Response.json({ profile: data });
});

/** Campos que el usuario puede modificar de su propio perfil. */
const EDITABLE_FIELDS = ["first_name", "last_name", "email", "avatar_url"] as const;

export const PATCH = withAuth(async (req: NextRequest, session) => {
  const body = (await req.json()) as Record<string, string | undefined>;

  const updates: Record<string, string> = {};
  for (const key of EDITABLE_FIELDS) {
    if (body[key] !== undefined) updates[key] = body[key] as string;
  }

  if (Object.keys(updates).length === 0) {
    return errorResponse("No valid fields to update.", 400);
  }

  const { data, error } = await getSupabase()
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", session.user_id)
    .select()
    .single();

  if (error) throw error;
  return Response.json({ profile: data });
});
