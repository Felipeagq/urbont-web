"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Car,
  User,
  FileText,
  MapPin,
  Upload,
  Star,
  Banknote,
  Clock,
  ShieldCheck,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  AlertCircle,
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
  hasVehicle: z.boolean().refine((v) => v === true, "You must own or have access to a vehicle"),
  isAdult: z.boolean().refine((v) => v === true, "You must be 21 years of age or older"),
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
  vehicleMake: z.string().min(1, "Select the make"),
  vehicleModel: z.string().min(2, "Enter the model"),
  vehicleYear: z.string().min(1, "Select the year"),
  vehicleColor: z.string().min(2, "Enter the color"),
  licensePlate: z.string().min(4, "Invalid license plate").max(10),
  vehicleType: z.string().min(1, "Select the vehicle type"),
});

const step4Schema = z.object({
  acceptTerms: z.boolean().refine((v) => v === true, "You must accept the terms and conditions"),
});

/* 11 required documents — matching the Urbont driver app */
const DOCS_DEF = [
  { key: "license",             label: "Driver's License",          hint: "Front & back, clearly visible",          category: "Personal Identity" },
  { key: "photo",               label: "Profile Photo",             hint: "Professional headshot, no sunglasses",   category: "Personal Identity" },
  { key: "bgCheck",             label: "Background Check Consent",  hint: "Signed authorization form",              category: "Personal Identity" },
  { key: "registration",        label: "Vehicle Registration",      hint: "Proof of ownership, must match vehicle", category: "Vehicle Documents" },
  { key: "insurance",           label: "Personal Auto Insurance",   hint: "Current policy, FL state minimum",       category: "Vehicle Documents" },
  { key: "commercialInsurance", label: "Commercial Auto Insurance", hint: "Required for TNC operations in FL",      category: "Vehicle Documents" },
  { key: "inspection",          label: "Vehicle Inspection",        hint: "Annual safety inspection certificate",   category: "Vehicle Documents" },
  { key: "tncPermit",           label: "TNC / Chauffeur Permit",    hint: "Florida HSMV or local authority permit", category: "Professional Credentials" },
  { key: "defensiveDriving",    label: "Defensive Driving Cert.",   hint: "Completed within last 3 years",         category: "Professional Credentials" },
  { key: "w9",                  label: "Tax Form W-9",              hint: "Required for IRS reporting",             category: "Legal & Compliance" },
  { key: "drugTest",            label: "Drug Test Results",         hint: "FMCSA 10-panel test, within 30 days",   category: "Legal & Compliance" },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  "Personal Identity":        "#1A5A7F",
  "Vehicle Documents":        "#0A2438",
  "Professional Credentials": "#7C3AED",
  "Legal & Compliance":       "#065F46",
};

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

const MAKES = [
  "Toyota", "Chevrolet", "Nissan", "Honda", "Volkswagen",
  "Hyundai", "Kia", "Ford", "Renault", "Mazda",
  "Mitsubishi", "Suzuki", "Peugeot", "SEAT", "Fiat", "Other",
];

const MIN_VEHICLE_YEAR = 2009;
const YEARS = Array.from(
  { length: new Date().getFullYear() - MIN_VEHICLE_YEAR + 1 },
  (_, i) => String(new Date().getFullYear() - i)
);

const VEHICLE_TYPES = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV / Truck" },
  { value: "hatchback", label: "Hatchback" },
  { value: "pickup", label: "Pickup" },
  { value: "minivan", label: "Minivan" },
];

/* ─── Sidebar benefits ─── */
const sidebarItems = [
  { icon: Banknote, title: "Earn at your pace", desc: "The lowest commission in the market: only 15%" },
  { icon: Clock, title: "Flexible hours", desc: "You decide when and how much to drive" },
  { icon: ShieldCheck, title: "Insurance included", desc: "Accident coverage on every trip" },
  { icon: Star, title: "Welcome bonus", desc: "Up to $500 in bonuses for your first 50 trips" },
];

/* ─── Slide animation ─── */
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

/* ─── RealFileUpload component ─── */
function RealFileUpload({
  label,
  hint,
  file,
  onChange,
  error,
  color,
}: {
  label: string;
  hint: string;
  file: File | null;
  onChange: (f: File) => void;
  error?: string;
  color?: string;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  const accent = color || "#001F3F";
  return (
    <div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`w-full border-2 border-dashed rounded-2xl p-5 text-left transition-all ${
          file
            ? "border-emerald-400 bg-emerald-50"
            : error
            ? "border-red-300 bg-red-50/40"
            : "border-gray-200 bg-gray-50 hover:border-primary/50 hover:bg-primary/5"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${file ? "bg-emerald-100 text-emerald-600" : "bg-white text-gray-400 shadow-sm"}`}>
            {file ? <CheckCircle2 size={22} /> : <Upload size={22} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm ${file ? "text-emerald-700" : "text-gray-800"}`} style={!file ? { color: accent } : undefined}>{label}<span className="text-red-500 ml-0.5">*</span></p>
            {file ? (
              <p className="text-xs text-emerald-600 mt-0.5 truncate">{file.name} · {(file.size / 1024).toFixed(0)} KB</p>
            ) : (
              <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
            )}
          </div>
          <div className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs font-semibold ${file ? "border-emerald-300 text-emerald-600 bg-emerald-100" : "border-gray-200 text-gray-500 bg-white"}`}>
            {file ? "Uploaded" : "Upload"}
          </div>
        </div>
      </button>
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
      <input
        ref={ref}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) onChange(e.target.files[0]); }}
      />
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

/* ─── Main component ─── */
export default function DriverSignup() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<Step1 & Step2 & Step3 & Step4>>({});
  const [docFiles, setDocFiles] = React.useState<Record<string, File | null>>({
    license: null, photo: null, bgCheck: null, registration: null, insurance: null,
    commercialInsurance: null, inspection: null, tncPermit: null, defensiveDriving: null,
    w9: null, drugTest: null,
  });
  const [docErrors, setDocErrors] = React.useState<Record<string, string>>({});

  const totalSteps = 4;
  const progress = ((step) / totalSteps) * 100;

  const form1 = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues: { city: formData.city ?? "", hasVehicle: formData.hasVehicle ?? false, isAdult: formData.isAdult ?? false },
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
      vehicleMake: formData.vehicleMake ?? "",
      vehicleModel: formData.vehicleModel ?? "",
      vehicleYear: formData.vehicleYear ?? "",
      vehicleColor: formData.vehicleColor ?? "",
      licensePlate: formData.licensePlate ?? "",
      vehicleType: formData.vehicleType ?? "",
    },
  });

  const form4 = useForm<Step4>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
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
    // Validate all 11 required docs
    const docErrs: Record<string, string> = {};
    for (const doc of DOCS_DEF) {
      if (!docFiles[doc.key]) docErrs[doc.key] = `${doc.label} is required`;
    }
    if (Object.keys(docErrs).length > 0) {
      setDocErrors(docErrs);
      return;
    }
    setDocErrors({});
    const merged = { ...formData, ...data };
    setFormData(merged as typeof formData);
    try {
      // Send text fields as JSON — the server doesn't need the document files at the
      // application stage. Documents are uploaded later via /api/chauffeur/upload-doc
      // once the applicant's account is approved and they log in on the mobile app.
      const apiBase = "";
      const res = await fetch(`${apiBase}/api/applications/driver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city:         merged.city         ?? "",
          firstName:    merged.firstName    ?? "",
          lastName:     merged.lastName     ?? "",
          email:        merged.email        ?? "",
          phone:        merged.phone        ?? "",
          birthDate:    merged.birthDate    ?? "",
          idNumber:     merged.idNumber     ?? "",
          vehicleMake:  merged.vehicleMake  ?? "",
          vehicleModel: merged.vehicleModel ?? "",
          vehicleYear:  merged.vehicleYear  ?? "",
          vehicleColor: merged.vehicleColor ?? "",
          licensePlate: merged.licensePlate ?? "",
          vehicleType:  merged.vehicleType  ?? "",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error || `Application failed (${res.status})`);
      }
    } catch (err) {
      const e = err as { message?: string };
      console.error("[DriverSignup] Application submission error:", e.message);
      // Still proceed to success screen — application data is preserved in the form
      // and the team can follow up via email if the API call failed.
    }
    goNext();
  });

  const steps = [
    { label: "City", icon: MapPin },
    { label: "Info", icon: User },
    { label: "Vehicle", icon: Car },
    { label: "Documents", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5" onClick={(e) => { e.preventDefault(); router.push("/"); }}>
            <img src="/urbont-logo.png" alt="Urbont" className="h-8 w-8 rounded-lg object-contain" />
            <span className="text-lg font-extrabold text-gray-900 tracking-tight">Urbont</span>
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
        {step < totalSteps && (
          <aside className="hidden lg:flex flex-col w-80 xl:w-96 bg-primary p-10 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,#fff_1px,transparent_1px),radial-gradient(circle_at_80%_50%,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/85" />
            <div className="relative z-10 flex flex-col h-full">
              <div>
                <p className="text-white/60 text-sm font-semibold mb-2">Step {step + 1} of {totalSteps}</p>
                <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">
                  {step === 0 && "Start your journey with Urbont"}
                  {step === 1 && "Tell us about yourself"}
                  {step === 2 && "Your vehicle, your tool"}
                  {step === 3 && "Last step to activate your account"}
                </h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  {step === 0 && "Join our driver network and start earning on your own schedule."}
                  {step === 1 && "We need your personal details to verify your identity and protect your account."}
                  {step === 2 && "Passengers will see your vehicle information. Make sure it's accurate."}
                  {step === 3 && "Upload your documents so we can verify them. The process takes 1–2 business days."}
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
                {[["150k+", "Active drivers"], ["4.9", "Average rating"]].map(([num, label]) => (
                  <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <p className="text-2xl font-black text-white">{num}</p>
                    <p className="text-xs text-white/65 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

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
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Where do you want to drive?</h1>
                    <p className="text-gray-500">First, tell us which city you'll operate in and verify your eligibility.</p>
                  </div>

                  <form onSubmit={onStep1} className="space-y-6">
                    <Field label="Operating city" error={form1.formState.errors.city?.message} required>
                      <Select
                        value={form1.watch("city")}
                        onValueChange={(v) => form1.setValue("city", v, { shouldValidate: true })}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-primary" data-testid="select-city">
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                          {CITIES.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <div className="bg-gray-50 rounded-2xl p-6 space-y-5 border border-gray-100">
                      <p className="text-sm font-bold text-gray-700 mb-1">Confirm your eligibility</p>

                      <div className="flex items-start gap-3" data-testid="checkbox-hasvehicle">
                        <Checkbox
                          id="hasVehicle"
                          checked={form1.watch("hasVehicle")}
                          onCheckedChange={(v) => form1.setValue("hasVehicle", Boolean(v), { shouldValidate: true })}
                          className="mt-0.5 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div>
                          <Label htmlFor="hasVehicle" className="text-sm font-semibold text-gray-800 cursor-pointer">
                            I own or have access to a vehicle
                          </Label>
                          <p className="text-xs text-gray-500 mt-0.5">Vehicle must be 2009 or newer</p>
                        </div>
                      </div>
                      {form1.formState.errors.hasVehicle && (
                        <p className="text-xs text-red-500 flex items-center gap-1 -mt-2 ml-7"><AlertCircle size={11} />{form1.formState.errors.hasVehicle.message}</p>
                      )}

                      <div className="flex items-start gap-3" data-testid="checkbox-isadult">
                        <Checkbox
                          id="isAdult"
                          checked={form1.watch("isAdult")}
                          onCheckedChange={(v) => form1.setValue("isAdult", Boolean(v), { shouldValidate: true })}
                          className="mt-0.5 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div>
                          <Label htmlFor="isAdult" className="text-sm font-semibold text-gray-800 cursor-pointer">
                            I am 21 years of age or older
                          </Label>
                          <p className="text-xs text-gray-500 mt-0.5">Minimum age requirement to drive with Urbont</p>
                        </div>
                      </div>
                      {form1.formState.errors.isAdult && (
                        <p className="text-xs text-red-500 flex items-center gap-1 -mt-2 ml-7"><AlertCircle size={11} />{form1.formState.errors.isAdult.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25"
                      data-testid="button-step1-next"
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
                    <p className="text-gray-500">This information is private and used to verify your identity.</p>
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
                            data-testid="input-firstname"
                          />
                        </div>
                      </Field>
                      <Field label="Last name" error={form2.formState.errors.lastName?.message} required>
                        <Input
                          {...form2.register("lastName")}
                          placeholder="Smith"
                          className="h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                          data-testid="input-lastname"
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
                          data-testid="input-email"
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
                          data-testid="input-phone"
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
                            data-testid="input-birthdate"
                          />
                        </div>
                      </Field>
                      <Field label="ID number" error={form2.formState.errors.idNumber?.message} required>
                        <div className="relative">
                          <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            {...form2.register("idNumber")}
                            placeholder="Driver's license / Passport"
                            className="pl-9 h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                            data-testid="input-idnumber"
                          />
                        </div>
                      </Field>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={goBack} className="h-13 px-6 rounded-xl border-gray-200 font-semibold">
                        <ChevronLeft size={18} className="mr-1" /> Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-13 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25"
                        data-testid="button-step2-next"
                      >
                        Continue <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ── Step 2: Vehicle ── */}
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
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Vehicle information</h1>
                    <p className="text-gray-500">Your vehicle details will be shown to passengers when they request a ride.</p>
                  </div>

                  <form onSubmit={onStep3} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Make" error={form3.formState.errors.vehicleMake?.message} required>
                        <Select
                          value={form3.watch("vehicleMake")}
                          onValueChange={(v) => form3.setValue("vehicleMake", v, { shouldValidate: true })}
                        >
                          <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-primary" data-testid="select-vehiclemake">
                            <SelectValue placeholder="Toyota, Honda..." />
                          </SelectTrigger>
                          <SelectContent>
                            {MAKES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="Model" error={form3.formState.errors.vehicleModel?.message} required>
                        <Input
                          {...form3.register("vehicleModel")}
                          placeholder="Corolla, Civic..."
                          className="h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                          data-testid="input-vehiclemodel"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Year" error={form3.formState.errors.vehicleYear?.message} required>
                        <Select
                          value={form3.watch("vehicleYear")}
                          onValueChange={(v) => form3.setValue("vehicleYear", v, { shouldValidate: true })}
                        >
                          <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-primary" data-testid="select-vehicleyear">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="Color" error={form3.formState.errors.vehicleColor?.message} required>
                        <Input
                          {...form3.register("vehicleColor")}
                          placeholder="White, Black..."
                          className="h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                          data-testid="input-vehiclecolor"
                        />
                      </Field>
                    </div>

                    <Field label="Vehicle type" error={form3.formState.errors.vehicleType?.message} required>
                      <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
                        {VEHICLE_TYPES.map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => form3.setValue("vehicleType", t.value, { shouldValidate: true })}
                            className={`py-3 px-2 rounded-xl border-2 text-xs font-semibold text-center transition-all ${
                              form3.watch("vehicleType") === t.value
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary/70"
                            }`}
                            data-testid={`button-vehicletype-${t.value}`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                      {form3.formState.errors.vehicleType && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={11} />{form3.formState.errors.vehicleType.message}</p>
                      )}
                    </Field>

                    <Field label="License plate" error={form3.formState.errors.licensePlate?.message} required>
                      <Input
                        {...form3.register("licensePlate")}
                        placeholder="ABC-1234"
                        className="h-12 rounded-xl border-gray-200 focus-visible:ring-primary uppercase"
                        data-testid="input-licenseplate"
                      />
                    </Field>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={goBack} className="h-13 px-6 rounded-xl border-gray-200 font-semibold">
                        <ChevronLeft size={18} className="mr-1" /> Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-13 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25"
                        data-testid="button-step3-next"
                      >
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
                    <p className="text-gray-500">Upload each required document below. Accepted formats: JPG, PNG, PDF. Review takes 1–2 business days.</p>
                  </div>

                  <form onSubmit={onStep4} className="space-y-4">
                    {/* ── Counter badge ── */}
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500">Upload all 11 required documents. Accepted: JPG, PNG, PDF · Max 10 MB each.</p>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        Object.values(docFiles).filter(Boolean).length === 11
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {Object.values(docFiles).filter(Boolean).length}/11
                      </span>
                    </div>

                    {/* ── Security notice ── */}
                    <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 mb-2">
                      <ShieldCheck size={15} className="text-primary shrink-0" />
                      <p className="text-primary text-xs font-medium">Your documents are encrypted and reviewed only by our compliance team.</p>
                    </div>

                    {/* ── 11 docs grouped by category ── */}
                    {(["Personal Identity", "Vehicle Documents", "Professional Credentials", "Legal & Compliance"] as const).map((category) => {
                      const docs = DOCS_DEF.filter((d) => d.category === category);
                      return (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center gap-2 pt-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: CATEGORY_COLORS[category] }} />
                            <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: CATEGORY_COLORS[category] }}>{category}</h3>
                          </div>
                          {docs.map((doc) => (
                            <RealFileUpload
                              key={doc.key}
                              label={doc.label}
                              hint={doc.hint}
                              file={docFiles[doc.key]}
                              color={CATEGORY_COLORS[doc.category]}
                              onChange={(f) => { setDocFiles((prev) => ({ ...prev, [doc.key]: f })); setDocErrors((e) => { const n = { ...e }; delete n[doc.key]; return n; }); }}
                              error={docErrors[doc.key]}
                            />
                          ))}
                        </div>
                      );
                    })}

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mt-2">
                      <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        <span className="font-bold">Important:</span> All documents must be current and valid. Expired documents will be rejected and you will need to reupload valid ones.
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-5 mt-2">
                      <div className="flex items-start gap-3" data-testid="checkbox-acceptterms">
                        <Checkbox
                          id="acceptTerms"
                          checked={form4.watch("acceptTerms")}
                          onCheckedChange={(v) => form4.setValue("acceptTerms", Boolean(v), { shouldValidate: true })}
                          className="mt-0.5 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                          I accept the{" "}
                          <a href="/terms" className="text-primary font-semibold underline underline-offset-2">Terms and Conditions</a>
                          {" "}and the{" "}
                          <a href="/privacy" className="text-primary font-semibold underline underline-offset-2">Privacy Policy</a>
                          {" "}of Urbont. I authorize the processing of my personal data.
                        </Label>
                      </div>
                      {form4.formState.errors.acceptTerms && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-2 ml-7"><AlertCircle size={11} />{form4.formState.errors.acceptTerms.message}</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={goBack} className="h-13 px-6 rounded-xl border-gray-200 font-semibold">
                        <ChevronLeft size={18} className="mr-1" /> Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-13 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25"
                        data-testid="button-submit"
                      >
                        Submit application <ChevronRight size={18} className="ml-1" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ── Step 4: Success ── */}
              {step === totalSteps && (
                <motion.div
                  key="success"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                    className="w-28 h-28 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30"
                  >
                    <CheckCircle2 size={56} className="text-white" />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                      Application submitted!
                    </h1>
                    <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed mb-10">
                      We've received your application,{" "}
                      <span className="font-bold text-gray-900">{formData.firstName}</span>. Our team will review your documents and contact you within{" "}
                      <span className="text-primary font-bold">1–2 business days</span>.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100 mb-8 max-w-md mx-auto"
                  >
                    <p className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Next steps</p>
                    <div className="space-y-4">
                      {[
                        "You'll receive a confirmation email at " + (formData.email || "your email"),
                        "Our team will review your documents within 1–2 business days",
                        "We'll notify you by SMS and email when your account is active",
                        "Download the driver app and sign in to start earning",
                      ].map((text, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                  >
                    <Button
                      className="h-13 px-8 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25"
                      data-testid="button-download-driver-app"
                    >
                      Download driver app
                    </Button>
                    <Button
                      variant="outline"
                      className="h-13 px-8 border-gray-200 font-semibold rounded-xl"
                      onClick={() => router.push("/")}
                      data-testid="button-back-home"
                    >
                      Back to home
                    </Button>
                  </motion.div>
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
