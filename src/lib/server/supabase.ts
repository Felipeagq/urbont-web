import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseServiceRoleKey } from "./env";

/**
 * Esquema permisivo.
 *
 * Este proyecto no genera tipos de Supabase (`supabase gen types`), así que sin
 * un parámetro de tipo el cliente infiere `never` para cualquier tabla y todo
 * insert/upsert falla al compilar. Esto describe las tablas como filas abiertas:
 * mantiene el encadenado de métodos con tipos, sin fingir que conocemos las
 * columnas.
 *
 * Si algún día se generan los tipos reales, sustituir esto por ellos y el
 * compilador empezará a validar nombres de columna.
 */
type LooseRow = Record<string, unknown>;

/* eslint-disable @typescript-eslint/no-explicit-any */
type Database = {
  public: {
    Tables: Record<
      string,
      {
        Row: LooseRow;
        // `any` a propósito en escritura: supabase-js rechaza propiedades no
        // declaradas, y algunos upserts usan claves computadas (`[field]`) que
        // ninguna firma abierta satisface. Sin esquema generado no hay forma
        // honesta de tiparlo mejor.
        Insert: any;
        Update: any;
        Relationships: [];
      }
    >;
    Views: Record<string, { Row: LooseRow; Relationships: [] }>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Cliente de Supabase con service role. Portado de api/_lib/supabase.ts.
 *
 * NOTA: en el proyecto original `@supabase/supabase-js` se importaba pero nunca
 * se declaró en package.json, así que estos 7 endpoints no podían compilar.
 * Aquí la dependencia está declarada.
 *
 * Se crea de forma perezosa para que el fallo por variables ausentes ocurra al
 * atender una petición (error 500 legible) y no al importar el módulo, que
 * tumbaría el build entero.
 */

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (!client) {
    client = createClient<Database>(supabaseUrl(), supabaseServiceRoleKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return client;
}

export interface Profile {
  id: string;
  phone: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string;
  status_val: string;
  rating: number | null;
  avatar_url: string | null;
  total_rides: number | null;
  created_at: string;
}

const PROFILE_COLUMNS =
  "id, phone, email, first_name, last_name, role, status_val, rating, avatar_url, total_rides, created_at";

/** Busca un perfil por número de teléfono. */
export async function findProfileByPhone(phone: string): Promise<Profile | null> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("phone", phone)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as Profile | null;
}

/** Crea el usuario de auth y su perfil para un teléfono ya verificado. */
export async function createPhoneUser(
  phone: string,
  extra?: { first_name?: string; email?: string },
): Promise<Profile> {
  const supabase = getSupabase();

  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    phone,
    phone_confirm: true,
    ...(extra?.email ? { email: extra.email, email_confirm: true } : {}),
  });
  if (authErr) throw authErr;

  const uid = authData.user.id;

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .upsert(
      {
        id: uid,
        phone,
        email: extra?.email ?? null,
        first_name: extra?.first_name ?? null,
        role: "passenger",
      },
      { onConflict: "id" },
    )
    .select()
    .single();
  if (profErr) throw profErr;

  return profile as unknown as Profile;
}
