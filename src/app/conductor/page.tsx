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
  Camera,
  ClipboardList,
  ClipboardCheck,
  Scale,
  Award,
  Receipt,
  FlaskConical,
  Shield,
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
  // Personal Identity
  licenseUploaded:              z.boolean().optional(),
  photoUploaded:                z.boolean().optional(),
  bgCheckUploaded:              z.boolean().optional(),
  // Vehicle Documents
  registrationUploaded:         z.boolean().optional(),
  personalInsuranceUploaded:    z.boolean().optional(),
  commercialInsuranceUploaded:  z.boolean().optional(),
  inspectionUploaded:           z.boolean().optional(),
  // Professional Credentials
  tncPermitUploaded:            z.boolean().optional(),
  defensiveDrivingUploaded:     z.boolean().optional(),
  // Legal & Compliance
  w9Uploaded:                   z.boolean().optional(),
  drugTestUploaded:             z.boolean().optional(),
  // Terms
  acceptTerms: z.boolean().refine((v) => v === true, "You must accept the terms and conditions"),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;
type Step4 = z.infer<typeof step4Schema>;

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

const YEARS = Array.from({ length: 16 }, (_, i) => String(2024 - i));

const VEHICLE_TYPES = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV / Truck" },
  { value: "hatchback", label: "Hatchback" },
  { value: "pickup", label: "Pickup" },
  { value: "minivan", label: "Minivan" },
];

/* ─── Document definitions (mirrors app's ChauffeurRegistrationScreen) ─── */
const DOC_CATEGORIES = [
  { id: "personal",    label: "Personal Identity",        color: "#1A5A7F", bg: "rgba(26,90,127,0.08)" },
  { id: "vehicle",     label: "Vehicle Documents",        color: "#0A2438", bg: "rgba(10,36,56,0.07)" },
  { id: "credentials", label: "Professional Credentials", color: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
  { id: "compliance",  label: "Legal & Compliance",       color: "#065F46", bg: "rgba(6,95,70,0.08)" },
] as const;

type DocCategoryId = typeof DOC_CATEGORIES[number]["id"];

interface DocDef {
  id: keyof Omit<Step4, "acceptTerms">;
  label: string;
  hint: string;
  category: DocCategoryId;
  icon: React.ElementType;
}

const DOCS: DocDef[] = [
  { id: "licenseUploaded",             label: "Driver's License",           hint: "Front & back, clearly visible • JPG, PNG or PDF",             category: "personal",    icon: CreditCard },
  { id: "photoUploaded",               label: "Profile Photo",              hint: "Professional headshot, no sunglasses • JPG or PNG",            category: "personal",    icon: Camera },
  { id: "bgCheckUploaded",             label: "Background Check Consent",   hint: "Signed authorization form • PDF preferred",                    category: "personal",    icon: ClipboardList },
  { id: "registrationUploaded",        label: "Vehicle Registration",       hint: "Proof of ownership, must match vehicle • JPG, PNG or PDF",     category: "vehicle",     icon: FileText },
  { id: "personalInsuranceUploaded",   label: "Personal Auto Insurance",    hint: "Current policy, FL state minimum • JPG, PNG or PDF",           category: "vehicle",     icon: ShieldCheck },
  { id: "commercialInsuranceUploaded", label: "Commercial Auto Insurance",  hint: "Required for TNC operations in FL • JPG, PNG or PDF",          category: "vehicle",     icon: Shield },
  { id: "inspectionUploaded",          label: "Vehicle Inspection",         hint: "Annual safety inspection certificate • JPG, PNG or PDF",       category: "vehicle",     icon: ClipboardCheck },
  { id: "tncPermitUploaded",           label: "TNC / Chauffeur Permit",     hint: "Florida HSMV or local authority permit • JPG, PNG or PDF",     category: "credentials", icon: Scale },
  { id: "defensiveDrivingUploaded",    label: "Defensive Driving Cert.",    hint: "Completed within last 3 years • JPG, PNG or PDF",              category: "credentials", icon: Award },
  { id: "w9Uploaded",                  label: "Tax Form W-9",               hint: "Required for IRS reporting • PDF preferred",                   category: "compliance",  icon: Receipt },
  { id: "drugTestUploaded",            label: "Drug Test Results",          hint: "FMCSA 10-panel test, within 30 days • JPG, PNG or PDF",        category: "compliance",  icon: FlaskConical },
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
      data-testid={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
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

/* ─── Main component ─── */
export default function DriverSignup() {
  const router = useRouter();
  const [phonePrefix, setPhonePrefix] = React.useState("+1");
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<Step1 & Step2 & Step3 & Step4>>({});

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
      licenseUploaded:             formData.licenseUploaded             ?? false,
      photoUploaded:               formData.photoUploaded               ?? false,
      bgCheckUploaded:             formData.bgCheckUploaded             ?? false,
      registrationUploaded:        formData.registrationUploaded        ?? false,
      personalInsuranceUploaded:   formData.personalInsuranceUploaded   ?? false,
      commercialInsuranceUploaded: formData.commercialInsuranceUploaded ?? false,
      inspectionUploaded:          formData.inspectionUploaded          ?? false,
      tncPermitUploaded:           formData.tncPermitUploaded           ?? false,
      defensiveDrivingUploaded:    formData.defensiveDrivingUploaded    ?? false,
      w9Uploaded:                  formData.w9Uploaded                  ?? false,
      drugTestUploaded:            formData.drugTestUploaded            ?? false,
      acceptTerms:                 formData.acceptTerms                 ?? false,
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
      await fetch("/api/applications/driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city:         merged.city ?? "",
          firstName:    merged.firstName ?? "",
          lastName:     merged.lastName ?? "",
          email:        merged.email ?? "",
          phone:        merged.phone ?? "",
          birthDate:    merged.birthDate ?? "",
          idNumber:     merged.idNumber ?? "",
          vehicleMake:  merged.vehicleMake ?? "",
          vehicleModel: merged.vehicleModel ?? "",
          vehicleYear:  merged.vehicleYear ?? "",
          vehicleColor: merged.vehicleColor ?? "",
          licensePlate: merged.licensePlate ?? "",
          vehicleType:  merged.vehicleType ?? "",
        }),
      });
    } catch { /* proceed to success even if API fails */ }
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
          <aside className="hidden lg:flex flex-col w-80 xl:w-96 bg-gradient-to-br from-primary via-blue-500 to-blue-400 p-10 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
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
                        <div className="flex gap-2">
                          <div className="relative">
                            <select
                              value={phonePrefix}
                              onChange={(e) => {
                                const prev = phonePrefix;
                                setPhonePrefix(e.target.value);
                                const cur = form2.getValues("phone");
                                const local = cur.startsWith(prev) ? cur.slice(prev.length) : cur;
                                form2.setValue("phone", e.target.value + local, { shouldValidate: true });
                              }}
                              className="h-12 rounded-xl border border-gray-200 px-2 pr-6 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                              style={{ minWidth: 80 }}
                            >
                              {COUNTRY_CODES.map((c) => (
                                <option key={c.name} value={c.dial}>{c.flag} {c.dial}</option>
                              ))}
                            </select>
                            <svg className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                          </div>
                          <div className="flex-1">
                            <Input
                              value={form2.watch("phone").startsWith(phonePrefix) ? form2.watch("phone").slice(phonePrefix.length) : form2.watch("phone")}
                              onChange={(e) => form2.setValue("phone", phonePrefix + e.target.value, { shouldValidate: true })}
                              type="tel"
                              placeholder="305 555 0123"
                              className="h-12 rounded-xl border-gray-200 focus-visible:ring-primary w-full"
                              data-testid="input-phone"
                            />
                          </div>
                        </div>
                    </Field>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1 px-0.5">
                      By providing your number, you consent to receive SMS from Urbont (trip alerts, safety notices). Msg & data rates may apply. Reply <strong>STOP</strong> to opt out. <a href="/privacy" className="text-primary underline underline-offset-2 font-medium">Privacy Policy</a>.
                    </p>

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
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">Step 4 of 4</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Upload your documents</h1>
                    <p className="text-gray-500">We need the same 11 documents required in the driver app. Click each box to mark it as ready. Review takes 1–2 business days.</p>
                  </div>

                  {/* Progress bar */}
                  {(() => {
                    const uploadedCount = DOCS.filter(d => form4.watch(d.id)).length;
                    const pct = Math.round((uploadedCount / DOCS.length) * 100);
                    return (
                      <div className="mb-6 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-gray-600">Documents uploaded</span>
                          <span className="text-xs font-bold text-primary">{uploadedCount} / {DOCS.length}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        {uploadedCount === DOCS.length && (
                          <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                            <CheckCircle2 size={12} /> All documents ready — great job!
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  <form onSubmit={onStep4} className="space-y-6">
                    {DOC_CATEGORIES.map((cat) => {
                      const catDocs = DOCS.filter(d => d.category === cat.id);
                      return (
                        <div key={cat.id}>
                          {/* Category header */}
                          <div className="flex items-center gap-2 mb-3">
                            <div
                              className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{ background: cat.bg, color: cat.color }}
                            >
                              {cat.label}
                            </div>
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-xs text-gray-400 font-medium">
                              {catDocs.filter(d => form4.watch(d.id)).length}/{catDocs.length}
                            </span>
                          </div>

                          {/* Documents in this category */}
                          <div className="space-y-3">
                            {catDocs.map((doc) => (
                              <UploadBox
                                key={doc.id}
                                label={doc.label}
                                hint={doc.hint}
                                icon={doc.icon}
                                uploaded={!!form4.watch(doc.id)}
                                onToggle={() => form4.setValue(doc.id, !form4.watch(doc.id), { shouldValidate: true })}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                      <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        <span className="font-bold">Important:</span> All documents must be current and valid. Expired documents will be rejected. You can submit your application now and upload pending documents later from the driver app.
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-5">
                      <div className="flex items-start gap-3" data-testid="checkbox-acceptterms">
                        <Checkbox
                          id="acceptTerms"
                          checked={form4.watch("acceptTerms")}
                          onCheckedChange={(v) => form4.setValue("acceptTerms", Boolean(v), { shouldValidate: true })}
                          className="mt-0.5 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                          I accept the{" "}
                          <a href="/terms" className="text-primary font-semibold underline underline-offset-2">Terms of Service</a>
                          {" "}and the{" "}
                          <a href="/privacy" className="text-primary font-semibold underline underline-offset-2">Privacy Policy</a>
                          {" "}of Urbont, including consent to receive SMS messages. Msg & data rates may apply. Reply STOP to opt out.
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
                    className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-300/50"
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
    </div>
  );
}
