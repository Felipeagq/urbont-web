import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/server/supabase";
import { signSessionToken } from "@/lib/server/jwt";
import { errorResponse } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

/** Columnas del perfil que necesita este endpoint. */
interface ProfileRow {
  id: string;
  phone: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

/**
 * Canjea un token de Supabase (obtenido con Google OAuth) por un JWT de Urbont.
 *
 * Es el cierre del flujo que arranca en /login (`signInWithOAuth`) y pasa por
 * /auth/callback. A partir de aquí la sesión es idéntica a la del OTP: el resto
 * de la app no distingue cómo se inició sesión.
 *
 *   navegador → Google → /auth/callback → POST aquí → JWT de Urbont
 *
 * El token de Supabase se valida contra Supabase (`auth.getUser`), no se
 * decodifica a mano: así se comprueba de verdad que lo emitió Supabase y sigue
 * vigente.
 */
export async function POST(req: NextRequest) {
  try {
    const { accessToken } = (await req.json()) as { accessToken?: string };

    if (!accessToken) {
      return errorResponse("accessToken is required.", 400);
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return errorResponse("Server not fully configured. Contact support@urbont.com", 503);
    }

    const supabase = getSupabase();

    const { data: authData, error: authErr } = await supabase.auth.getUser(accessToken);
    if (authErr || !authData.user) {
      return errorResponse("Invalid or expired Google session.", 401);
    }

    const authUser = authData.user;

    // El perfil puede no existir todavía: con Google es habitual que sea el
    // primer acceso del usuario.
    const { data: existing } = await supabase
      .from("profiles")
      .select("id, phone, email, first_name, last_name, role")
      .eq("id", authUser.id)
      .maybeSingle();

    let profile = existing as unknown as ProfileRow | null;

    if (!profile) {
      const meta = authUser.user_metadata ?? {};
      const fullName = (meta.full_name ?? meta.name ?? "") as string;
      const [firstName, ...rest] = fullName.split(" ");

      const { data: created, error: createErr } = await supabase
        .from("profiles")
        .upsert(
          {
            id: authUser.id,
            email: authUser.email ?? null,
            first_name: firstName || null,
            last_name: rest.join(" ") || null,
            avatar_url: (meta.avatar_url ?? meta.picture ?? null) as string | null,
            role: "passenger",
          },
          { onConflict: "id" },
        )
        .select("id, phone, email, first_name, last_name, role")
        .single();
      if (createErr) throw createErr;
      profile = created as unknown as ProfileRow;
    }

    if (!profile) return errorResponse("Could not resolve the user profile.", 500);

    const token = signSessionToken({
      user_id: profile.id,
      phone: profile.phone ?? "",
      role: profile.role ?? "passenger",
    });

    return NextResponse.json({
      token,
      user: {
        id: profile.id,
        phone: profile.phone ?? "",
        email: profile.email,
        name: profile.first_name
          ? `${profile.first_name} ${profile.last_name ?? ""}`.trim()
          : null,
        role: profile.role ?? "passenger",
      },
    });
  } catch (err) {
    console.error("[auth/oauth-web]", (err as Error).message);
    return errorResponse("Internal server error.", 500);
  }
}
