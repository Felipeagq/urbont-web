"use client";

/**
 * Cliente Supabase del navegador.
 *
 * Sólo se usa para el login con Google: `signInWithOAuth` en /login, y la
 * lectura de la sesión en /auth/callback. Todo lo demás pasa por los route
 * handlers de /api, que usan la service_role key en el servidor.
 *
 * La anon key es pública por diseño: viaja en el bundle y sólo concede lo que
 * permitan las políticas RLS. La service_role key NUNCA va aquí.
 *
 * Se construye de forma perezosa: `createClient` lanza si la URL está vacía, y
 * a nivel de módulo eso rompería el prerender de las páginas que lo importan.
 * Así, un entorno sin configurar sólo desactiva el botón de Google en lugar de
 * tumbar el build.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "El inicio de sesión con Google no está configurado: faltan " +
        "NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  client = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      // La sesión de Urbont la lleva auth-context con su propio JWT; la de
      // Supabase sólo hace falta durante el intercambio del callback.
      persistSession: false,
      // Necesario para leer el fragmento/código que Google devuelve en la URL.
      detectSessionInUrl: true,
      // Con persistSession=false el verifier de PKCE vive en memoria y se pierde
      // al redirigir. El flujo implícito manda los tokens en el fragmento, que
      // sí sobrevive al salto.
      flowType: "implicit",
    },
  });

  return client;
}

/** true si el entorno tiene lo necesario para ofrecer login con Google. */
export function isGoogleLoginAvailable(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
