"use client";

/**
 * /dashboard — Post-login user dashboard
 *
 * Shown to any authenticated user after login (OTP or Google OAuth).
 * Redirects to /login if the user is not authenticated.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { LogOut, User, ShieldCheck, Car, Briefcase, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const ROLE_LABELS: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  chauffeur: { label: "Conductor",   icon: Car,        color: "text-blue-600 bg-blue-50" },
  valet:     { label: "Valet",       icon: Briefcase,  color: "text-purple-600 bg-purple-50" },
  passenger: { label: "Pasajero",    icon: User,       color: "text-green-600 bg-green-50" },
  admin:     { label: "Administrador", icon: ShieldCheck, color: "text-red-600 bg-red-50" },
};

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated after loading
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const roleInfo = ROLE_LABELS[user.role ?? "passenger"] ?? ROLE_LABELS.passenger;
  const RoleIcon = roleInfo.icon;
  const displayName = user.name || user.email || user.phone || "Usuario";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <button onClick={() => router.push("/")} className="flex items-center gap-2">
            <img src="/urbont-logo.png" alt="Urbont" className="h-8 w-8 rounded-lg object-contain" />
            <span className="text-lg font-extrabold text-gray-900 tracking-tight">Urbont</span>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-gray-500 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-10">
        {/* Welcome card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="bg-gradient-to-br from-primary via-blue-600 to-blue-500 rounded-3xl p-8 text-white mb-6 shadow-xl shadow-primary/20"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-black text-white border border-white/30 shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-white/70 text-sm font-semibold">Bienvenido de nuevo</p>
              <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">{displayName}</h1>
              <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 border border-white/30`}>
                <RoleIcon className="h-3 w-3" />
                {roleInfo.label}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {user.email && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1, ease: EASE }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Email</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
            </motion.div>
          )}
          {user.phone && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15, ease: EASE }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Teléfono</p>
              <p className="text-sm font-semibold text-gray-800">{user.phone}</p>
            </motion.div>
          )}
        </div>

        {/* Role-specific content */}
        {(user.role === "chauffeur" || user.role === "valet") && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2, ease: EASE }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl ${roleInfo.color}`}>
                <RoleIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Tu cuenta de {roleInfo.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">Tu solicitud está siendo revisada por nuestro equipo</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">⏳ Revisión en proceso</p>
              <p className="text-amber-700 text-xs leading-relaxed">
                Recibirás una notificación cuando tu cuenta sea aprobada. El proceso toma 1–2 días hábiles.
              </p>
            </div>
          </motion.div>
        )}

        {/* Download the app CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25, ease: EASE }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-gray-100 text-gray-600">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Descarga la app de Urbont</p>
              <p className="text-xs text-gray-500 mt-0.5">Gestiona tu cuenta desde tu móvil</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://apps.apple.com/app/urbont"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              App Store <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.urbont"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              Google Play <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
