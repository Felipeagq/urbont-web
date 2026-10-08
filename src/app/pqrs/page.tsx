"use client";

import React from "react";
import { ArrowLeft, MessageSquareText, HelpCircle, Frown, AlertOctagon, Lightbulb, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/i18n";

/** El backend recibe la PQRS directo del navegador: así su límite por IP es por visitante. */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.urbont.com";

type Tipo = "peticion" | "queja" | "reclamo" | "sugerencia";

const COPY = {
  en: {
    back: "Back to home",
    badge: "Customer care",
    title: "Requests, complaints and suggestions",
    intro: "Tell us what you need. We review every submission and reply by email. You will receive a reference number to follow up.",
    typeLabel: "What would you like to submit?",
    types: {
      peticion:   { label: "Request",    desc: "Ask for information or a service" },
      queja:      { label: "Complaint",  desc: "Report dissatisfaction with a service or person" },
      reclamo:    { label: "Claim",      desc: "Ask us to correct a charge or a failure" },
      sugerencia: { label: "Suggestion", desc: "Share an idea to improve Urbont" },
    },
    name: "Full name",
    email: "Email",
    phone: "Phone (optional)",
    subject: "Subject (optional)",
    description: "Describe your request",
    descriptionHint: "Include dates, trip details or any information that helps us.",
    submit: "Submit",
    sending: "Sending…",
    privacy: "We only use this information to answer your request. See our",
    privacyLink: "Privacy Policy",
    successTitle: "We received your request",
    successBody: "Your reference number is",
    successNote: "We also sent it to your email. Keep it for any follow-up.",
    another: "Submit another",
    errors: {
      type: "Choose the type of request.",
      name: "Enter your name.",
      email: "Enter a valid email.",
      description: "Describe your request (at least 10 characters).",
      rate: "Too many requests. Please try again later.",
      generic: "We could not submit your request. Please try again.",
    },
  },
  es: {
    back: "Volver al inicio",
    badge: "Atención al cliente",
    title: "Peticiones, quejas, reclamos y sugerencias",
    intro: "Cuéntanos qué necesitas. Revisamos cada solicitud y respondemos por correo. Recibirás un número de radicado para hacer seguimiento.",
    typeLabel: "¿Qué quieres enviar?",
    types: {
      peticion:   { label: "Petición",   desc: "Solicita información o un servicio" },
      queja:      { label: "Queja",      desc: "Manifiesta inconformidad con un servicio o una persona" },
      reclamo:    { label: "Reclamo",    desc: "Pide corregir un cobro o una falla" },
      sugerencia: { label: "Sugerencia", desc: "Comparte una idea para mejorar Urbont" },
    },
    name: "Nombre completo",
    email: "Correo",
    phone: "Teléfono (opcional)",
    subject: "Asunto (opcional)",
    description: "Describe tu solicitud",
    descriptionHint: "Incluye fechas, datos del viaje o cualquier información que nos ayude.",
    submit: "Enviar",
    sending: "Enviando…",
    privacy: "Solo usamos estos datos para responder tu solicitud. Consulta nuestra",
    privacyLink: "Política de privacidad",
    successTitle: "Recibimos tu solicitud",
    successBody: "Tu número de radicado es",
    successNote: "También te lo enviamos por correo. Consérvalo para cualquier seguimiento.",
    another: "Enviar otra",
    errors: {
      type: "Elige el tipo de solicitud.",
      name: "Escribe tu nombre.",
      email: "Escribe un correo válido.",
      description: "Describe tu solicitud (mínimo 10 caracteres).",
      rate: "Demasiados envíos. Inténtalo más tarde.",
      generic: "No pudimos enviar tu solicitud. Inténtalo de nuevo.",
    },
  },
} as const;

const ICONOS: Record<Tipo, React.ElementType> = {
  peticion: HelpCircle,
  queja: Frown,
  reclamo: AlertOctagon,
  sugerencia: Lightbulb,
};

const VACIO = { name: "", email: "", phone: "", subject: "", description: "", website: "" };

export default function Pqrs() {
  const { lang } = useLanguage();
  const c = lang === "es" ? COPY.es : COPY.en;

  const [tipo, setTipo] = React.useState<Tipo | null>(null);
  const [form, setForm] = React.useState(VACIO);
  const [errors, setErrors] = React.useState<Partial<Record<"type" | "name" | "email" | "description", string>>>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);
  const [numero, setNumero] = React.useState<string | null>(null);

  const set = (k: keyof typeof VACIO) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validar = () => {
    const er: typeof errors = {};
    if (!tipo) er.type = c.errors.type;
    if (form.name.trim().length < 2) er.name = c.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) er.email = c.errors.email;
    if (form.description.trim().length < 10) er.description = c.errors.description;
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validar()) return;
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/support/pqrs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: tipo, ...form }),
      });
      const data = (await res.json().catch(() => ({}))) as { number?: string | null; field?: string; errorCode?: string };
      if (res.status === 429) throw new Error(c.errors.rate);
      if (!res.ok) {
        const campo = data.field as keyof typeof errors | undefined;
        if (campo && campo in c.errors) {
          setErrors({ [campo]: c.errors[campo as keyof typeof c.errors] });
          return;
        }
        throw new Error(c.errors.generic);
      }
      setNumero(data.number ?? "—");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setFormError((err as Error).message || c.errors.generic);
    } finally {
      setSending(false);
    }
  };

  const reiniciar = () => {
    setNumero(null);
    setTipo(null);
    setForm(VACIO);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/urbont-logo.png" alt="Urbont" className="h-8 w-8 object-contain rounded-lg" />
            <span className="text-lg font-extrabold tracking-tight text-gray-900">Urbont</span>
          </a>
          <a href="/">
            <Button variant="ghost" className="gap-2 text-sm font-semibold text-gray-600">
              <ArrowLeft size={16} />
              {c.back}
            </Button>
          </a>
        </div>
      </header>

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-5">
              <MessageSquareText size={14} />
              {c.badge} · PQRS
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{c.title}</h1>
            <p className="text-gray-600 leading-relaxed">{c.intro}</p>
          </div>

          {numero ? (
            <div className="p-8 rounded-2xl border border-emerald-200 bg-emerald-50 text-center">
              <CheckCircle2 size={40} className="mx-auto text-emerald-600 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">{c.successTitle}</h2>
              <p className="text-gray-600 mb-3">{c.successBody}</p>
              <p className="text-2xl font-mono font-bold text-gray-900 mb-4">{numero}</p>
              <p className="text-sm text-gray-500 mb-6">{c.successNote}</p>
              <Button variant="outline" onClick={reiniciar}>{c.another}</Button>
            </div>
          ) : (
            <form onSubmit={enviar} className="space-y-6" noValidate>
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">{c.typeLabel}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(c.types) as Tipo[]).map((t) => {
                    const Icono = ICONOS[t];
                    const activo = tipo === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setTipo(t); setErrors((er) => ({ ...er, type: undefined })); }}
                        aria-pressed={activo}
                        className={`text-left p-4 rounded-2xl border-2 transition-all ${
                          activo ? "border-primary bg-primary/5" : "border-gray-200 bg-white hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icono size={18} className={activo ? "text-primary" : "text-gray-400"} />
                          <span className="font-semibold text-gray-900 text-sm">{c.types[t].label}</span>
                        </div>
                        <p className="text-xs text-gray-500">{c.types[t].desc}</p>
                      </button>
                    );
                  })}
                </div>
                {errors.type && <FieldError text={errors.type} />}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Campo label={c.name} error={errors.name}>
                  <Input value={form.name} onChange={set("name")} autoComplete="name" maxLength={255} />
                </Campo>
                <Campo label={c.email} error={errors.email}>
                  <Input type="email" value={form.email} onChange={set("email")} autoComplete="email" maxLength={255} />
                </Campo>
                <Campo label={c.phone}>
                  <Input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" maxLength={20} />
                </Campo>
                <Campo label={c.subject}>
                  <Input value={form.subject} onChange={set("subject")} maxLength={150} />
                </Campo>
              </div>

              <Campo label={c.description} error={errors.description}>
                <Textarea value={form.description} onChange={set("description")} rows={6} maxLength={5000} />
                <p className="text-xs text-gray-400 mt-1">{c.descriptionHint}</p>
              </Campo>

              {/* Trampa para bots: una persona no la ve ni la rellena. */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={set("website")}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" /> {formError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <p className="text-xs text-gray-500">
                  {c.privacy}{" "}
                  <a href="/privacy" className="text-primary font-semibold hover:underline">{c.privacyLink}</a>.
                </p>
                <Button type="submit" disabled={sending} className="gap-2 shrink-0">
                  {sending && <Loader2 size={16} className="animate-spin" />}
                  {sending ? c.sending : c.submit}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

function Campo({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-gray-700">{label}</Label>
      {children}
      {error && <FieldError text={error} />}
    </div>
  );
}

function FieldError({ text }: { text: string }) {
  return (
    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
      <AlertCircle size={11} />
      {text}
    </p>
  );
}
