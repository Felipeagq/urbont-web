"use client";

import { LoginGuard } from "@/components/auth-guard";
import { useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { Phone, ArrowRight, ChevronLeft, User, Mail, ChevronDown, Car, ParkingSquare } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { useAuth } from "@/context/auth-context";
  import { useRouter } from "next/navigation";

  const EASE = [0.22, 1, 0.36, 1] as const;
  type Step = "role" | "form" | "otp";
  type Mode = "login" | "register";
  type UserRole = "passenger" | "valet" | "driver";

  const COUNTRY_CODES = [
    { flag: "🇺🇸", name: "United States", dial: "+1" },
    { flag: "🇨🇦", name: "Canada", dial: "+1" },
    { flag: "🇲🇽", name: "Mexico", dial: "+52" },
    { flag: "🇦🇷", name: "Argentina", dial: "+54" },
    { flag: "🇧🇷", name: "Brazil", dial: "+55" },
    { flag: "🇨🇴", name: "Colombia", dial: "+57" },
    { flag: "🇨🇱", name: "Chile", dial: "+56" },
    { flag: "🇵🇪", name: "Peru", dial: "+51" },
    { flag: "🇻🇪", name: "Venezuela", dial: "+58" },
    { flag: "🇪🇨", name: "Ecuador", dial: "+593" },
    { flag: "🇬🇹", name: "Guatemala", dial: "+502" },
    { flag: "🇨🇷", name: "Costa Rica", dial: "+506" },
    { flag: "🇵🇦", name: "Panama", dial: "+507" },
    { flag: "🇩🇴", name: "Dominican Republic", dial: "+1809" },
    { flag: "🇨🇺", name: "Cuba", dial: "+53" },
    { flag: "🇬🇧", name: "United Kingdom", dial: "+44" },
    { flag: "🇪🇸", name: "Spain", dial: "+34" },
    { flag: "🇫🇷", name: "France", dial: "+33" },
    { flag: "🇩🇪", name: "Germany", dial: "+49" },
    { flag: "🇮🇹", name: "Italy", dial: "+39" },
    { flag: "🇵🇹", name: "Portugal", dial: "+351" },
    { flag: "🇷🇺", name: "Russia", dial: "+7" },
    { flag: "🇨🇳", name: "China", dial: "+86" },
    { flag: "🇮🇳", name: "India", dial: "+91" },
    { flag: "🇯🇵", name: "Japan", dial: "+81" },
    { flag: "🇰🇷", name: "South Korea", dial: "+82" },
    { flag: "🇦🇺", name: "Australia", dial: "+61" },
  ];

  const ROLE_OPTIONS: { role: UserRole; label: string; sublabel: string; icon: React.ReactNode; accent: string }[] = [
    {
      role: "passenger",
      label: "Passenger",
      sublabel: "Request rides",
      icon: <User className="h-6 w-6" />,
      accent: "from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/50",
    },
    {
      role: "valet",
      label: "Valet",
      sublabel: "Parking & valet services",
      icon: <ParkingSquare className="h-6 w-6" />,
      accent: "from-violet-500/10 to-violet-600/5 border-violet-500/20 hover:border-violet-500/50",
    },
    {
      role: "driver",
      label: "Driver",
      sublabel: "Drive & earn",
      icon: <Car className="h-6 w-6" />,
      accent: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/50",
    },
  ];

  function Login() {
    const [mode, setMode] = useState<Mode>("register");
    const [step, setStep] = useState<Step>("role");
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState("+1");
    const [localPhone, setLocalPhone] = useState("");
    const [smsConsent, setSmsConsent] = useState(false);

    const [otp, setOtp] = useState("");
    const [otpToken, setOtpToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();
    const router = useRouter();

    const fullPhone = countryCode + localPhone.trim();
    const phoneReady = localPhone.trim().length >= 6;
    const emailValid = email.includes("@") && email.includes(".");
    const registerReady = firstName.trim().length >= 2 && emailValid && phoneReady;
    const loginReady = phoneReady;
    const canContinue = (mode === "register" ? registerReady : loginReady) && smsConsent;

    const switchMode = (m: Mode) => {
      setMode(m);
      setError("");
      setSmsConsent(false);
      if (m === "register") {
        setStep("role");
        setUserRole(null);
      } else {
        setStep("form");
      }
    };

    const handleRoleSelect = (role: UserRole) => {
      setUserRole(role);
      if (role === "driver") {
        router.push("/conductor");
        return;
      }
      if (role === "valet") {
        router.push("/valet");
        return;
      }
      // passenger → continue with OTP register
      setStep("form");
    };

    const handleSendOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canContinue) return;
      setError("");
      setLoading(true);
      try {
        const apiBase = "";
        const res = await fetch(`${apiBase}/api/otp/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: fullPhone }),
        });
        let data: { error?: string; otpToken?: string };
        try { data = await res.json() as { error?: string; otpToken?: string }; }
        catch { throw new Error("Server error. Please try again."); }
        if (!res.ok) throw new Error(data.error ?? "Error sending code");
        setOtpToken(data.otpToken ?? "");
        setStep("otp");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);
      try {
        const apiBase = "";
        const res = await fetch(`${apiBase}/api/otp/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: fullPhone, code: otp, otpToken }),
        });
        let data: { error?: string; session?: { access_token: string; user_id: string; phone?: string; role?: string }; profile?: { first_name?: string } };
        try { data = await res.json() as typeof data; }
        catch { throw new Error("Server error. Please try again."); }
        if (!res.ok) throw new Error(data.error ?? "Invalid code");

        const session = data.session!;
        login(session.access_token, {
          id: session.user_id,
          phone: session.phone ?? fullPhone,
          name: firstName.trim() || data.profile?.first_name || null,
          // El original omitía `role`, así que quedaba `undefined` hasta la
          // siguiente recarga. Como /dashboard enruta según el rol, un conductor
          // aterrizaba en el panel de pasajero justo después de iniciar sesión.
          role: session.role ?? "passenger",
        });

        if (mode === "register" && (firstName.trim() || email.trim())) {
          fetch(`${""}/api/users/profile`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ first_name: firstName.trim(), email: email.trim() }),
          }).catch(() => {});
        }

        router.push("/");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mb-10 text-center"
          >
            <img src="/urbont-logo.png" alt="Urbont" className="mx-auto h-20 w-20 rounded-2xl" />
            <p className="mt-3 text-sm text-muted-foreground">Premium Chauffeur Service · Miami</p>
          </motion.div>

          {/* Mode toggle — show only on form/role steps (not OTP) */}
          {step !== "otp" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex bg-muted rounded-xl p-1 mb-8"
            >
              {(["register", "login"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    mode === m
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "register" ? "Create account" : "Log in"}
                </button>
              ))}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* ── ROLE SELECTOR (register only) ── */}
            {step === "role" && mode === "register" ? (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground mb-1">How will you use Urbont?</h2>
                  <p className="text-sm text-muted-foreground">Choose your account type to get started</p>
                </div>
                <div className="space-y-3">
                  {ROLE_OPTIONS.map(({ role, label, sublabel, icon, accent }) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-br ${accent} transition-all duration-200 group text-left`}
                    >
                      <div className="shrink-0 h-11 w-11 rounded-xl bg-background/60 flex items-center justify-center text-foreground border border-border/50 group-hover:scale-105 transition-transform">
                        {icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : step === "form" ? (
              <motion.div
                key={`form-${mode}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {mode === "register" && (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          type="button"
                          onClick={() => { setStep("role"); setUserRole(null); }}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Back"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground leading-tight">Create your account</h2>
                          <p className="text-sm text-muted-foreground">Fill in your details to get started</p>
                        </div>
                      </div>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Your name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10 h-12 text-base"
                          required
                          autoFocus
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="you@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 text-base"
                          required
                        />
                      </div>
                    </>
                  )}

                  {mode === "login" && (
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Welcome back</h2>
                      <p className="text-sm text-muted-foreground">
                        We'll send a verification code to your phone via SMS
                      </p>
                    </div>
                  )}

                  {/* Phone with country code */}
                  <div className="flex gap-2">
                    <div className="relative">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="h-12 rounded-md border border-input bg-background px-2 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                        style={{ minWidth: 80 }}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.name} value={c.dial}>
                            {c.flag} {c.dial}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="305 000 0000"
                        value={localPhone}
                        onChange={(e) => setLocalPhone(e.target.value)}
                        className="pl-10 h-12 text-base w-full"
                        required
                        autoFocus={mode === "login"}
                      />
                    </div>
                  </div>

                  {/* SMS Consent */}
                  <label className="flex items-start gap-3 cursor-pointer select-none py-1">
                    <div
                      className="shrink-0 mt-0.5 flex items-center justify-center rounded border-2 transition-colors"
                      style={{
                        width: 18,
                        height: 18,
                        borderColor: smsConsent ? "hsl(var(--primary))" : "hsl(var(--border))",
                        backgroundColor: smsConsent ? "hsl(var(--primary))" : "transparent",
                      }}
                    >
                      {smsConsent && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 3.5L3.8 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={smsConsent}
                      onChange={(e) => setSmsConsent(e.target.checked)}
                      className="sr-only"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      I agree to receive SMS verification codes and account notifications from URBONT to the phone number provided. Message and data rates may apply. Reply STOP to cancel.{" "}
                      <a href="/terms" className="underline hover:text-foreground transition-colors">
                        Terms
                      </a>{" "}
                      &{" "}
                      <a href="/privacy" className="underline hover:text-foreground transition-colors">
                        Privacy Policy
                      </a>.
                    </span>
                  </label>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base gap-2"
                    disabled={loading || !canContinue}
                  >
                    {loading
                      ? "Sending..."
                      : mode === "register"
                      ? "Create account"
                      : "Continue"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </form>
              </motion.div>
            ) : step === "otp" ? (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Back"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground leading-tight">Verify your phone</h2>
                      <p className="text-sm text-muted-foreground">
                        Enter the 6-digit code sent to{" "}
                        <span className="font-medium text-foreground">{fullPhone}</span>
                      </p>
                    </div>
                  </div>

                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="h-14 text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                    autoFocus
                    required
                  />

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base gap-2"
                    disabled={loading || otp.length < 6}
                  >
                    {loading ? "Verifying..." : "Verify & continue"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>

                  <button
                    type="button"
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                    onClick={() => { setStep("form"); setOtp(""); setError(""); }}
                  >
                    Resend code
                  </button>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    );
  }

export default function Page() {
  return (
    <LoginGuard>
      <Login />
    </LoginGuard>
  );
}
