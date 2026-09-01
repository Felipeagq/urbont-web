"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowRight, ChevronLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase";
import { normalizePhone } from "@/lib/phone";

const EASE = [0.22, 1, 0.36, 1] as const;
type Step = "phone" | "otp";

const API = "";

export default function Login() {
  const [step, setStep]       = useState<Step>("phone");
  const [phone, setPhone]     = useState("");
  const [otp, setOtp]         = useState("");
  // El API de websitev2 valida el OTP sin estado: /api/otp/send devuelve un
  // token firmado que hay que reenviar en /api/otp/verify. (urbont-api, en
  // cambio, guarda el código en servidor y no lo necesita.)
  const [otpToken, setOtpToken] = useState("");
  const [devCode, setDevCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]     = useState("");
  const { login }             = useAuth();
  const router = useRouter();

  // ── Phone: request OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const phoneNorm = normalizePhone(phone);
      // Correct endpoint: /api/otp/send  (NOT /api/auth/send-otp)
      const res  = await fetch(`${API}/api/otp/send`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ phone: phoneNorm }),
      });
      const data = await res.json() as { error?: string; otpToken?: string; devCode?: string };
      if (!res.ok) throw new Error(data.error ?? "Error enviando código");
      if (!data.otpToken) throw new Error("Respuesta de servidor inválida");
      setPhone(phoneNorm);
      setOtpToken(data.otpToken);
      setDevCode(data.devCode ?? "");
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP: verify code ─────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const phoneNorm = normalizePhone(phone);
      // Correct endpoint: /api/otp/verify  (NOT /api/auth/verify-otp)
      const res  = await fetch(`${API}/api/otp/verify`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ phone: phoneNorm, code: otp, otpToken }),
      });
      const data = await res.json() as {
        error?: string;
        session?: { access_token: string; user_id: string; phone: string; role: string };
        profile?: { first_name?: string | null; last_name?: string | null };
        user_id?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Código inválido");

      // Server returns { session: { access_token, refresh_token, user_id, phone, role }, profile }
      const session = data.session;
      if (!session?.access_token) throw new Error("Respuesta de servidor inválida");

      login(session.access_token, {
        id:    session.user_id,
        phone: session.phone,
        name:  data.profile?.first_name
          ? `${data.profile.first_name} ${data.profile.last_name ?? ""}`.trim()
          : null,
        role:  session.role,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  // ── Google OAuth ─────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error: oauthError } = await getSupabaseBrowser().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (oauthError) throw new Error(oauthError.message);
      // Browser will be redirected to Google — no further action needed here
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error iniciando sesión con Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Urbont</h1>
          <p className="mt-2 text-sm text-muted-foreground">Tu ciudad, a tu ritmo</p>
        </motion.div>

        {/* Google OAuth button (shown on phone step only) */}
        <AnimatePresence>
          {step === "phone" && (
            <motion.div
              key="google-btn"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="mb-6"
            >
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full h-12 text-base gap-3 font-medium border-gray-200"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  "Redirigiendo…"
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar con Google
                  </>
                )}
              </Button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-3 text-xs text-muted-foreground">o continúa con tu número</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === "phone" ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Ingresa tu número</h2>
                  <p className="text-sm text-muted-foreground">
                    Te enviaremos un código de verificación por SMS
                  </p>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+1 (305) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12 text-base"
                    required
                    autoFocus
                  />
                </div>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive">
                    {error}
                  </motion.p>
                )}
                <Button type="submit" size="lg" className="w-full h-12 text-base gap-2" disabled={loading || phone.length < 8}>
                  {loading ? "Enviando..." : "Continuar"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <button
                    type="button"
                    onClick={() => { setStep("phone"); setError(""); setOtp(""); setDevCode(""); }}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Cambiar número
                  </button>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Verifica tu número</h2>
                  <p className="text-sm text-muted-foreground">
                    Código enviado a <span className="font-medium text-foreground">{phone}</span>
                  </p>
                </div>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="pl-10 h-12 text-base tracking-[0.5em] font-mono"
                    required
                    autoFocus
                  />
                </div>
                {devCode && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                    Modo desarrollo: tu código es <span className="font-mono font-semibold">{devCode}</span>
                  </p>
                )}
                {error && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-destructive">
                    {error}
                  </motion.p>
                )}
                <Button type="submit" size="lg" className="w-full h-12 text-base gap-2" disabled={loading || otp.length !== 6}>
                  {loading ? "Verificando..." : "Iniciar sesión"}
                  {!loading && <ShieldCheck className="h-4 w-4" />}
                </Button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ¿No recibiste el código? Reenviar
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
