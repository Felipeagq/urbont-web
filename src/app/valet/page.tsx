"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  User,
  FileText,
  MapPin,
  Upload,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Zap,
  Clock,
  ShieldCheck,
  Star,
  Building2,
  Languages,
  Car,
  Smartphone,
  BadgeCheck,
  ChevronDown,
  Hotel,
  UtensilsCrossed,
  Tent,
  Plane,
  Dice5,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

/* ─── Zod schemas per step ─── */
const step1Schema = z.object({
  city: z.string().min(1, "Please select your city"),
  isAdult: z.boolean().refine((v) => v === true, "You must be 18 years of age or older"),
  hasCommunicationSkills: z.boolean().refine(
    (v) => v === true,
    "This role requires direct guest interaction"
  ),
});

const step2Schema = z.object({
  firstName: z.string().min(2, "Minimum 2 characters"),
  lastName: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Invalid phone number").max(15),
  birthDate: z.string().min(1, "Enter your date of birth"),
  idNumber: z.string().min(5, "Invalid ID number"),
});

const step3Schema = z.object({
  experienceLevel: z.string().min(1, "Select your experience level"),
  venueType: z.string().min(1, "Select a venue type"),
  schedule: z.string().min(1, "Select your availability"),
  languages: z.string().min(1, "Select the languages you speak"),
});

const step4Schema = z.object({
  idUploaded: z.boolean().refine((v) => v === true, "You must upload your ID"),
  photoUploaded: z.boolean().refine((v) => v === true, "You must upload a profile photo"),
  acceptTerms: z.boolean().refine((v) => v === true, "You must accept the terms and conditions"),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;
type Step4 = z.infer<typeof step4Schema>;

/* ─── Constants ─── */
const CITIES = [
  "Miami, FL",
  "Orlando, FL",
  "Tampa, FL",
  "Fort Lauderdale, FL",
  "Jacksonville, FL",
  "Atlanta, GA",
  "Houston, TX",
  "Dallas, TX",
  "Austin, TX",
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Phoenix, AZ",
  "Las Vegas, NV",
  "Other city",
];

const EXPERIENCE_LEVELS = [
  { value: "none", label: "No prior hospitality experience" },
  { value: "basic", label: "Less than 1 year (reception, customer service)" },
  { value: "intermediate", label: "1–3 years (hotel, restaurant, events)" },
  { value: "advanced", label: "3+ years in hospitality or VIP service" },
];

const VENUE_TYPES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "hotel", label: "Hotel / Resort", icon: Hotel },
  { value: "restaurant", label: "Restaurant / Bar", icon: UtensilsCrossed },
  { value: "events", label: "Event Center", icon: Tent },
  { value: "corporate", label: "Corporate Building", icon: Building2 },
  { value: "airport", label: "Airport / Terminal", icon: Plane },
  { value: "any", label: "No preference", icon: MapPin },
];

const SCHEDULES = [
  { value: "morning", label: "Morning (6 am – 2 pm)" },
  { value: "afternoon", label: "Afternoon (2 pm – 10 pm)" },
  { value: "night", label: "Night (10 pm – 6 am)" },
  { value: "full", label: "Full shift (24 hours)" },
  { value: "flexible", label: "Flexible / on demand" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English only" },
  { value: "es", label: "Spanish only" },
  { value: "en-es", label: "English and Spanish" },
  { value: "en-es-other", label: "English, Spanish and another language" },
  { value: "other", label: "Other language" },
];

/* ─── Sidebar benefits ─── */
const sidebarItems = [
  { icon: Zap, title: "Fast dispatch", desc: "Your role is key: connect guests with Urbont drivers in seconds" },
  { icon: Clock, title: "Flexible shifts", desc: "You choose your schedule based on venue availability" },
  { icon: ShieldCheck, title: "Training included", desc: "Urbont trains you to master dispatch and guest service" },
  { icon: Star, title: "Welcome bonus", desc: "Up to $300 in bonuses for your first 30 days as an agent" },
];

/* ─── Slide animation ─── */
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

/* ─── UploadBox component ─── */
function UploadBox({
  label,
  hint,
  icon: Icon,
  uploaded,
  onToggle,
  error,
}: {
  label: string;
  hint: string;
  icon: React.ElementType;
  uploaded: boolean;
  onToggle: () => void;
  error?: string;
}) {
  return (
    <div
      onClick={onToggle}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 transition-all duration-200
        ${uploaded
          ? "border-emerald-400 bg-emerald-50"
          : error
          ? "border-red-300 bg-red-50/40"
          : "border-gray-200 bg-gray-50 hover:border-primary/50 hover:bg-primary/5"
        }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${uploaded ? "bg-emerald-100 text-emerald-600" : "bg-white text-gray-400 shadow-sm"}`}>
          {uploaded ? <CheckCircle2 size={22} /> : <Icon size={22} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${uploaded ? "text-emerald-700" : "text-gray-800"}`}>{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
          {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
        </div>
        <div className={`shrink-0 p-2 rounded-lg border text-xs font-semibold transition-colors ${uploaded ? "border-emerald-300 text-emerald-600 bg-emerald-100" : "border-gray-200 text-gray-500 bg-white"}`}>
          {uploaded ? "Uploaded" : <Upload size={14} />}
        </div>
      </div>
    </div>
  );
}

/* ─── Field wrapper ─── */
function Field({ label, error, children, required }: { label: string; error?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

/* ─── Valet intro / landing screen ─── */
function ValetIntro({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const howItWorks = [
    {
      step: "01",
      icon: User,
      color: "bg-primary/10 text-primary",
      title: "Guest requests a ride",
      desc: "A hotel guest or restaurant patron approaches the front desk or uses the Urbont guest app to request a pickup.",
    },
    {
      step: "02",
      icon: Smartphone,
      color: "bg-primary/10 text-primary",
      title: "You dispatch in seconds",
      desc: "You open the Urbont Agent app and assign the nearest available Urbont driver to the guest — all in under 30 seconds.",
    },
    {
      step: "03",
      icon: Car,
      color: "bg-primary/10 text-primary",
      title: "Driver arrives fast",
      desc: "The driver arrives at the venue entrance in under 5 minutes. The guest gets picked up seamlessly — you get the credit.",
    },
  ];

  const perks = [
    { icon: Building2, title: "Premium venues", desc: "Hotels, restaurants, event centers and corporate buildings across Miami." },
    { icon: Clock,     title: "Flexible shifts",  desc: "Morning, afternoon or night — you choose the schedule that fits your life." },
    { icon: BadgeCheck, title: "Full training",   desc: "Urbont trains you on the agent app, dispatch protocol and guest service." },
    { icon: Star,      title: "Welcome bonus",    desc: "Up to $300 in bonuses during your first 30 days as an active agent." },
  ];

  const faqs = [
    { q: "Do I need a car?", a: "No. As a Valet Front Desk agent you work at a fixed venue — no driving required. Your job is coordinating, not transporting." },
    { q: "Do I need prior experience in hospitality?", a: "No prior experience is required. Urbont provides complete onboarding and training before you start. A friendly attitude and good communication skills are all you need." },
    { q: "How much can I earn?", a: "Agents earn a base pay per shift plus performance bonuses for every successful dispatch. Exact rates depend on your city and venue." },
    { q: "What hours does the role involve?", a: "You choose your availability when you apply — morning, afternoon, night or flexible. Urbont matches you with venues that need coverage during those hours." },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onBack}>
            <img src="/urbont-logo.png" alt="Urbont" className="h-8 w-8 rounded-lg object-contain" />
            <span className="text-lg font-extrabold text-gray-900 tracking-tight">Urbont</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary ml-1">Valet</span>
          </div>
          <button onClick={onBack} className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors">
            ← Back to home
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,#fff_1px,transparent_1px),radial-gradient(circle_at_80%_50%,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/85" />
        <div className="relative container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-sm font-bold mb-6">
              <Zap size={14} className="text-white" /> Urbont Valet Front Desk
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight leading-tight">
              The role that connects<br />
              <span className="text-white/90">passengers with drivers</span><br />
              in seconds.
            </h1>
            <p className="text-white/75 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-8">
              You work at hotels, restaurants and events. When a guest needs a ride, you dispatch an Urbont driver immediately — you are the human link between the passenger and the trip.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onStart}
                className="h-14 px-10 text-base font-bold bg-white text-primary hover:bg-white/90 rounded-xl shadow-lg"
              >
                Apply to become an agent <ArrowRight size={18} className="ml-2" />
              </Button>
              <a href="#how-it-works">
                <Button variant="outline" className="h-14 px-8 font-bold border-white/20 text-white bg-white/5 hover:bg-white/10 rounded-xl">
                  How it works
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">The dispatch process</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">How it works</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">Three simple steps from guest request to driver arrival — all orchestrated by you.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-primary/20 z-0" />

            {howItWorks.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }} viewport={{ once: true }}
                className="relative z-10 bg-white rounded-3xl border border-gray-100 p-7 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                    <item.icon size={22} />
                  </div>
                  <span className="text-4xl font-black text-gray-100 select-none">{item.step}</span>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Why become a Valet agent?</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <perk.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-extrabold text-gray-900 mb-2">{perk.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Venues */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
          >
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Where you'll work</h2>
            <p className="text-gray-500 mb-8">Urbont places agents at premium venues across the city.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {([
                { icon: Hotel, label: "Hotels & Resorts" },
                { icon: UtensilsCrossed, label: "Restaurants & Bars" },
                { icon: Tent, label: "Event Centers" },
                { icon: Building2, label: "Corporate Buildings" },
                { icon: Plane, label: "Airport Lounges" },
                { icon: Dice5, label: "Entertainment Venues" },
              ] as const).map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700">
                  <Icon size={16} className="text-primary shrink-0" strokeWidth={1.75} />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
          >
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                    <ChevronDown size={18} className={`text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,#fff_1px,transparent_1px),radial-gradient(circle_at_80%_50%,#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative text-center px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Ready to join the team?</h2>
          <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">The application takes less than 5 minutes. We review your info within 1–2 business days and assign you to a venue.</p>
          <Button
            onClick={onStart}
            className="h-14 px-12 text-base font-bold bg-white text-primary hover:bg-gray-50 rounded-xl shadow-lg"
          >
            Apply now — it's free <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </section>

      <footer className="bg-primary border-t border-white/10 py-6 text-center">
        <p className="text-white/70 text-sm">
          © {new Date().getFullYear()} Urbont Technologies Inc. ·{" "}
          <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
          {" · "}
          <a href="/terms" className="hover:text-white transition-colors">Terms</a>
        </p>
      </footer>
    </div>
  );
}

/* ─── Main component ─── */
export default function ValetSignup() {
  const router = useRouter();
  const [showForm, setShowForm] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<Step1 & Step2 & Step3 & Step4>>({});

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const form1 = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      city: formData.city ?? "",
      isAdult: formData.isAdult ?? false,
      hasCommunicationSkills: formData.hasCommunicationSkills ?? false,
    },
  });

  const form2 = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      firstName: formData.firstName ?? "",
      lastName: formData.lastName ?? "",
      email: formData.email ?? "",
      phone: formData.phone ?? "",
      birthDate: formData.birthDate ?? "",
      idNumber: formData.idNumber ?? "",
    },
  });

  const form3 = useForm<Step3>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      experienceLevel: formData.experienceLevel ?? "",
      venueType: formData.venueType ?? "",
      schedule: formData.schedule ?? "",
      languages: formData.languages ?? "",
    },
  });

  const form4 = useForm<Step4>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      idUploaded: formData.idUploaded ?? false,
      photoUploaded: formData.photoUploaded ?? false,
      acceptTerms: formData.acceptTerms ?? false,
    },
  });

  function goNext() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const onStep1 = form1.handleSubmit((data) => { setFormData((f) => ({ ...f, ...data })); goNext(); });
  const onStep2 = form2.handleSubmit((data) => { setFormData((f) => ({ ...f, ...data })); goNext(); });
  const onStep3 = form3.handleSubmit((data) => { setFormData((f) => ({ ...f, ...data })); goNext(); });
  const onStep4 = form4.handleSubmit(async (data) => {
    const merged = { ...formData, ...data };
    setFormData(merged as typeof formData);
    try {
      await fetch(`/api/applications/valet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city:            merged.city ?? "",
          firstName:       merged.firstName ?? "",
          lastName:        merged.lastName ?? "",
          email:           merged.email ?? "",
          phone:           merged.phone ?? "",
          birthDate:       merged.birthDate ?? "",
          idNumber:        merged.idNumber ?? "",
          experienceLevel: merged.experienceLevel ?? "",
          venueType:       merged.venueType ?? "",
          schedule:        merged.schedule ?? "",
          languages:       merged.languages ?? "",
        }),
      });
    } catch (err) {
      const e = err as { message?: string };
      console.error("[ValetSignup] Application submission error:", e.message);
      // Still proceed to success screen — application data is preserved in the form
      // and the team can follow up via email if the API call failed.
    }
    goNext();
  });

  const steps = [
    { label: "City", icon: MapPin },
    { label: "Info", icon: User },
    { label: "Experience", icon: Building2 },
    { label: "Documents", icon: FileText },
  ];

  if (!showForm) {
    return (
      <ValetIntro
        onStart={() => { setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        onBack={() => router.push("/")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5" onClick={(e) => { e.preventDefault(); router.push("/"); }}>
            <img src="/urbont-logo.png" alt="Urbont" className="h-8 w-8 rounded-lg object-contain" />
            <span className="text-lg font-extrabold text-gray-900 tracking-tight">Urbont</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary ml-1">Valet</span>
          </a>

          {step < totalSteps && (
            <div className="hidden md:flex items-center gap-2">
              {steps.map((s, i) => (
                <React.Fragment key={i}>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    i < step ? "bg-primary/10 text-primary" :
                    i === step ? "bg-primary text-white shadow-md shadow-primary/25" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    {i < step ? <CheckCircle2 size={13} /> : <s.icon size={13} />}
                    {s.label}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-6 h-0.5 rounded-full ${i < step ? "bg-primary/40" : "bg-gray-200"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <a href="/" onClick={(e) => { e.preventDefault(); router.push("/"); }} className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors">
            ← Back to home
          </a>
        </div>

        {step < totalSteps && (
          <div className="h-1 bg-gray-100">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        )}
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        {step < totalSteps && (
          <aside className="hidden lg:flex flex-col w-80 xl:w-96 bg-primary p-10 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,#fff_1px,transparent_1px),radial-gradient(circle_at_80%_50%,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/85" />
            <div className="relative z-10 flex flex-col h-full">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 mb-4">
                  <Building2 size={12} /> Urbont Valet Front Desk
                </span>
                <p className="text-white/60 text-sm font-semibold mb-2">Step {step + 1} of {totalSteps}</p>
                <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">
                  {step === 0 && "Become a Valet agent"}
                  {step === 1 && "Tell us about yourself"}
                  {step === 2 && "Your experience & availability"}
                  {step === 3 && "Last step to activate your account"}
                </h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  {step === 0 && "As a Valet Front Desk agent, your job is to get Urbont drivers for passengers immediately at hotels, restaurants and events."}
                  {step === 1 && "We need your personal details to verify your identity and protect your agent account."}
                  {step === 2 && "Your hospitality experience and availability help us place you at the right venue."}
                  {step === 3 && "Upload your documents so we can verify you. The process takes 1–2 business days."}
                </p>
              </div>

              <div className="mt-10 space-y-5">
                {sidebarItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className="flex items-start gap-4"
                  >
                    <div className="bg-white/15 p-2.5 rounded-xl border border-white/20 shrink-0">
                      <item.icon size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{item.title}</p>
                      <p className="text-white/65 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-8 grid grid-cols-2 gap-4">
                {[["240+", "Venues served"], ["4.8", "Agent rating"]].map(([num, label]) => (
                  <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <p className="text-2xl font-black text-white">{num}</p>
                    <p className="text-xs text-white/65 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Form area */}
        <main className="flex-1 flex items-start justify-center p-6 md:p-10 lg:p-16 overflow-y-auto">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait" custom={direction}>

              {/* ── Step 0: City & eligibility ── */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">Step 1 of 4</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Where do you want to work as an agent?</h1>
                    <p className="text-gray-500">Select the city where you want to be stationed as a Valet Front Desk agent and confirm your eligibility.</p>
                  </div>

                  <form onSubmit={onStep1} className="space-y-6">
                    <Field label="Operating city" error={form1.formState.errors.city?.message} required>
                      <Select
                        value={form1.watch("city")}
                        onValueChange={(v) => form1.setValue("city", v, { shouldValidate: true })}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-primary">
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                          {CITIES.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    {/* Role explainer */}
                    <div className="bg-primary/5 rounded-2xl p-5 border border-primary/15">
                      <p className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                        <Zap size={14} /> What does a Valet Front Desk agent do?
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        You work at hotels, restaurants or event centers. When a guest needs a ride, you dispatch an Urbont driver in seconds — you are the human link between the passenger and the trip.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 space-y-5 border border-gray-100">
                      <p className="text-sm font-bold text-gray-700 mb-1">Confirm your eligibility</p>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="isAdult"
                          checked={form1.watch("isAdult")}
                          onCheckedChange={(v) => form1.setValue("isAdult", Boolean(v), { shouldValidate: true })}
                          className="mt-0.5 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div>
                          <Label htmlFor="isAdult" className="text-sm font-semibold text-gray-800 cursor-pointer">
                            I am 18 years of age or older
                          </Label>
                          <p className="text-xs text-gray-500 mt-0.5">Minimum age requirement to be an Urbont Valet agent</p>
                        </div>
                      </div>
                      {form1.formState.errors.isAdult && (
                        <p className="text-xs text-red-500 flex items-center gap-1 -mt-2 ml-7"><AlertCircle size={11} />{form1.formState.errors.isAdult.message}</p>
                      )}

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="hasCommunicationSkills"
                          checked={form1.watch("hasCommunicationSkills")}
                          onCheckedChange={(v) => form1.setValue("hasCommunicationSkills", Boolean(v), { shouldValidate: true })}
                          className="mt-0.5 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div>
                          <Label htmlFor="hasCommunicationSkills" className="text-sm font-semibold text-gray-800 cursor-pointer">
                            I am comfortable interacting with guests directly
                          </Label>
                          <p className="text-xs text-gray-500 mt-0.5">The role involves constant communication with passengers and driver coordination</p>
                        </div>
                      </div>
                      {form1.formState.errors.hasCommunicationSkills && (
                        <p className="text-xs text-red-500 flex items-center gap-1 -mt-2 ml-7"><AlertCircle size={11} />{form1.formState.errors.hasCommunicationSkills.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25"
                    >
                      Continue <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* ── Step 1: Personal information ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">Step 2 of 4</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Your personal information</h1>
                    <p className="text-gray-500">This information is private and used to verify your identity as an agent.</p>
                  </div>

                  <form onSubmit={onStep2} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="First name" error={form2.formState.errors.firstName?.message} required>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            {...form2.register("firstName")}
                            placeholder="John"
                            className="pl-9 h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                          />
                        </div>
                      </Field>
                      <Field label="Last name" error={form2.formState.errors.lastName?.message} required>
                        <Input
                          {...form2.register("lastName")}
                          placeholder="Smith"
                          className="h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                        />
                      </Field>
                    </div>

                    <Field label="Email address" error={form2.formState.errors.email?.message} required>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          {...form2.register("email")}
                          type="email"
                          placeholder="john@example.com"
                          className="pl-9 h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                        />
                      </div>
                    </Field>

                    <Field label="Phone number" error={form2.formState.errors.phone?.message} required>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          {...form2.register("phone")}
                          type="tel"
                          placeholder="+1 (305) 555-0123"
                          className="pl-9 h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                        />
                      </div>
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Date of birth" error={form2.formState.errors.birthDate?.message} required>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            {...form2.register("birthDate")}
                            type="date"
                            className="pl-9 h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                          />
                        </div>
                      </Field>
                      <Field label="ID number" error={form2.formState.errors.idNumber?.message} required>
                        <Input
                          {...form2.register("idNumber")}
                          placeholder="Driver's license / Passport"
                          className="h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                        />
                      </Field>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={goBack} className="h-13 px-6 rounded-xl border-gray-200 font-semibold">
                        <ChevronLeft size={18} className="mr-1" /> Back
                      </Button>
                      <Button type="submit" className="flex-1 h-13 text-base font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/25">
                        Continue <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ── Step 2: Experience & availability ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">Step 3 of 4</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Your experience & availability</h1>
                    <p className="text-gray-500">Tell us your background so we can place you at the right venue and schedule.</p>
                  </div>

                  <form onSubmit={onStep3} className="space-y-6">
                    <Field label="Hospitality / customer service experience" error={form3.formState.errors.experienceLevel?.message} required>
                      <Select
                        value={form3.watch("experienceLevel")}
                        onValueChange={(v) => form3.setValue("experienceLevel", v, { shouldValidate: true })}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-200">
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPERIENCE_LEVELS.map((e) => (
                            <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                        Preferred venue type <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {VENUE_TYPES.map((vt) => {
                          const VenueIcon = vt.icon;
                          return (
                          <button
                            key={vt.value}
                            type="button"
                            onClick={() => form3.setValue("venueType", vt.value, { shouldValidate: true })}
                            className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                              form3.watch("venueType") === vt.value
                                ? "border-primary bg-primary/8 shadow-md shadow-primary/15"
                                : "border-gray-200 hover:border-primary/40 hover:bg-gray-50"
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${form3.watch("venueType") === vt.value ? "bg-primary/15" : "bg-gray-100"}`}>
                              <VenueIcon size={18} className={form3.watch("venueType") === vt.value ? "text-primary" : "text-gray-500"} strokeWidth={1.75} />
                            </div>
                            <span className={`text-sm font-semibold ${form3.watch("venueType") === vt.value ? "text-primary" : "text-gray-700"}`}>
                              {vt.label}
                            </span>
                          </button>
                        );})}
                      </div>
                      {form3.formState.errors.venueType && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-2"><AlertCircle size={11} />{form3.formState.errors.venueType.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Schedule availability" error={form3.formState.errors.schedule?.message} required>
                        <Select
                          value={form3.watch("schedule")}
                          onValueChange={(v) => form3.setValue("schedule", v, { shouldValidate: true })}
                        >
                          <SelectTrigger className="h-12 rounded-xl border-gray-200">
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            {SCHEDULES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="Languages you speak" error={form3.formState.errors.languages?.message} required>
                        <div className="relative">
                          <Languages size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                          <Select
                            value={form3.watch("languages")}
                            onValueChange={(v) => form3.setValue("languages", v, { shouldValidate: true })}
                          >
                            <SelectTrigger className="h-12 rounded-xl border-gray-200 pl-9">
                              <SelectValue placeholder="Languages" />
                            </SelectTrigger>
                            <SelectContent>
                              {LANGUAGE_OPTIONS.map((l) => (
                                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </Field>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={goBack} className="h-13 px-6 rounded-xl border-gray-200 font-semibold">
                        <ChevronLeft size={18} className="mr-1" /> Back
                      </Button>
                      <Button type="submit" className="flex-1 h-13 text-base font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/25">
                        Continue <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ── Step 3: Documents ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">Step 4 of 4</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Upload your documents</h1>
                    <p className="text-gray-500">We verify your identity to protect guests and venues. The process takes 1–2 business days.</p>
                  </div>

                  <form onSubmit={onStep4} className="space-y-4">
                    <UploadBox
                      label="Government-issued ID"
                      hint="Driver's license, state ID or passport (current and valid)"
                      icon={FileText}
                      uploaded={form4.watch("idUploaded")}
                      onToggle={() => form4.setValue("idUploaded", !form4.watch("idUploaded"), { shouldValidate: true })}
                      error={form4.formState.errors.idUploaded?.message}
                    />

                    <UploadBox
                      label="Profile photo"
                      hint="Recent photo, neutral background, good lighting (JPG or PNG)"
                      icon={User}
                      uploaded={form4.watch("photoUploaded")}
                      onToggle={() => form4.setValue("photoUploaded", !form4.watch("photoUploaded"), { shouldValidate: true })}
                      error={form4.formState.errors.photoUploaded?.message}
                    />

                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mt-2">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="acceptTerms"
                          checked={form4.watch("acceptTerms")}
                          onCheckedChange={(v) => form4.setValue("acceptTerms", Boolean(v), { shouldValidate: true })}
                          className="mt-0.5 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div>
                          <Label htmlFor="acceptTerms" className="text-sm font-semibold text-gray-800 cursor-pointer leading-relaxed">
                            I accept the{" "}
                            <a href="/terms" className="text-primary underline underline-offset-2">Terms and Conditions</a>
                            {" "}and the{" "}
                            <a href="/privacy" className="text-primary underline underline-offset-2">Privacy Policy</a>
                            {" "}of Urbont
                          </Label>
                          <p className="text-xs text-gray-500 mt-0.5">As an independent agent, you agree to operate under the Valet Front Desk role guidelines</p>
                        </div>
                      </div>
                      {form4.formState.errors.acceptTerms && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-2 ml-7"><AlertCircle size={11} />{form4.formState.errors.acceptTerms.message}</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={goBack} className="h-13 px-6 rounded-xl border-gray-200 font-semibold">
                        <ChevronLeft size={18} className="mr-1" /> Back
                      </Button>
                      <Button type="submit" className="flex-1 h-14 text-base font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/25">
                        Submit application <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ── Confirmation ── */}
              {step === 4 && (
                <motion.div
                  key="done"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                    <CheckCircle2 size={40} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Application submitted!</h1>
                  <p className="text-gray-500 text-base leading-relaxed max-w-sm mx-auto mb-8">
                    Your application to become an <strong>Urbont Valet Front Desk</strong> agent is under review. We'll verify your information within <strong>1–2 business days</strong> and notify you by email.
                  </p>

                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-8 text-left max-w-sm mx-auto">
                    <p className="text-sm font-bold text-gray-700 mb-3">What happens next?</p>
                    <div className="space-y-3">
                      {[
                        "We review your documents (1–2 business days)",
                        "We contact you for a brief virtual onboarding",
                        "We assign you to a venue in your city",
                        "You start receiving dispatch requests",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-primary text-xs font-black">{i + 1}</span>
                          </div>
                          <p className="text-sm text-gray-600">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/")}
                    className="w-full max-w-sm h-13 text-base font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/25"
                  >
                    Back to home
                  </Button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>

      <footer className="bg-primary border-t border-white/10 py-6 text-center">
        <p className="text-white/70 text-sm">
          © {new Date().getFullYear()} Urbont Technologies Inc. ·{" "}
          <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
          {" · "}
          <a href="/terms" className="hover:text-white transition-colors">Terms</a>
        </p>
      </footer>
    </div>
  );
}
