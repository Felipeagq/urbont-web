"use client";

/**
 * /auth/callback — OAuth redirect handler
 *
 * Supabase sends the user here after Google OAuth with a URL hash:
 *   https://app.urbont.com/auth/callback#access_token=...&refresh_token=...&type=recovery|magiclink|...
 *
 * We extract the Supabase access token, exchange it for our custom JWT via
 * POST /api/auth/oauth-web, then store the JWT and redirect to /dashboard.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";

const API = "";

export default function AuthCallback() {
  const router = useRouter();
  const { login }       = useAuth();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      try {
        // getSession() lee the hash fragment automatically
        // when detectSessionInUrl: true is set in the client config.
        const { data, error } = await getSupabaseBrowser().auth.getSession();

        if (error || !data.session) {
          // Try exchanging the code in the URL query string (PKCE flow)
          const url    = new URL(window.location.href);
          const code   = url.searchParams.get("code");
          const errParam = url.searchParams.get("error_description") ?? url.searchParams.get("error");

          if (errParam) throw new Error(errParam);
          if (!code)    throw new Error("No se recibió token de autenticación de Google.");

          const { data: exchanged, error: exchangeErr } = await getSupabaseBrowser().auth.exchangeCodeForSession(code);
          if (exchangeErr || !exchanged.session) throw new Error(exchangeErr?.message ?? "No se pudo iniciar sesión.");

          if (cancelled) return;
          await finalize(exchanged.session.access_token);
          return;
        }

        if (cancelled) return;
        await finalize(data.session.access_token);
      } catch (err: unknown) {
        if (cancelled) return;
        console.error("[AuthCallback]", err);
        setErrorMsg(err instanceof Error ? err.message : "Error al iniciar sesión con Google");
        setStatus("error");
      }
    }

    async function finalize(supabaseAccessToken: string) {
      // Exchange Supabase token for our custom JWT so the rest of the app
      // can work the same way regardless of login method.
      const res = await fetch(`${API}/api/auth/oauth-web`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ accessToken: supabaseAccessToken }),
      });
      const body = await res.json() as {
        error?: string;
        token?: string;
        user?: { id: string; phone: string; email?: string; name?: string | null; role?: string };
      };

      if (!res.ok || !body.token || !body.user) {
        throw new Error(body.error ?? "Error al crear sesión de Urbont");
      }

      // AuthUser.name es `string | null`; la respuesta lo trae opcional.
      login(body.token, { ...body.user, name: body.user.name ?? null });
      router.push("/dashboard");
    }

    handleCallback();
    return () => { cancelled = true; };
  }, [login, router]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="text-4xl">⚠️</div>
        <h1 className="text-xl font-bold text-foreground">No se pudo iniciar sesión</h1>
        <p className="text-sm text-muted-foreground max-w-xs">{errorMsg}</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-2 text-sm font-semibold text-primary hover:underline"
        >
          ← Volver al login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <p className="text-sm text-muted-foreground">Iniciando sesión con Google…</p>
    </div>
  );
}
