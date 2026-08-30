"use client";

import React from "react";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Car, Clock, ShieldCheck, Banknote, Menu, X, Star, Users, Globe, Award,
  Smartphone, MapPin, CheckCircle2, Zap, HeartHandshake, BadgeCheck,
  PhoneCall, ChevronRight, ArrowRight, Crown, Briefcase, Truck, Building2,
  Quote, CalendarCheck, BarChart3, Receipt, Cpu, Navigation, Lock,
  TrendingUp, Leaf, ChevronDown, DollarSign, Percent, HelpCircle, Mail, Send,
} from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useLanguage, LANGUAGES } from "@/i18n";
import { useRouter } from "next/navigation";
import CityMap from "@/components/city-map";
import CookieConsent from "@/components/cookie-consent";

/* ─── Animated Counter ─────────────────────────────────────── */
function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) => `${Math.floor(v)}${suffix}`);
  React.useEffect(() => { if (inView) raw.set(to); }, [inView, to, raw]);
  return <motion.span ref={ref}>{display}</motion.span>;
}

/* ─── Welcome Modal ─────────────────────────────────────────── */
function WelcomeModal() {
  const { t } = useLanguage();
  const w = t.welcomeModal;
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const seen = localStorage.getItem("urbont_welcomed");
    if (!seen) {
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const dismiss = () => {
    localStorage.setItem("urbont_welcomed", "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={dismiss} />

      {/* Card — bottom sheet on mobile, centered modal on desktop */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 32, stiffness: 320 }}
        className="relative bg-white rounded-t-[28px] sm:rounded-[28px] w-full sm:max-w-[390px] overflow-hidden shadow-2xl"
      >
        {/* ── Hero image section ── */}
        <div className="relative h-52 overflow-hidden bg-primary">
          {/* City photo as background */}
          <img
            src="/hero.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.55) saturate(1.2)" }}
          />
          {/* Blue color overlay */}
          <div className="absolute inset-0 bg-primary/50 mix-blend-multiply" />

          {/* SVG map lines — city grid like Uber */}
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 390 208" fill="none">
            {/* Grid streets */}
            <line x1="0" y1="80" x2="390" y2="80" stroke="white" strokeWidth="1" strokeDasharray="0"/>
            <line x1="0" y1="130" x2="390" y2="130" stroke="white" strokeWidth="1"/>
            <line x1="80" y1="0" x2="80" y2="208" stroke="white" strokeWidth="1"/>
            <line x1="180" y1="0" x2="180" y2="208" stroke="white" strokeWidth="1"/>
            <line x1="280" y1="0" x2="280" y2="208" stroke="white" strokeWidth="1"/>
            {/* Route path */}
            <path d="M70 170 Q130 80 195 90 Q260 100 320 40"
              stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="8 5"/>
            <circle cx="70" cy="170" r="6" fill="white"/>
            <circle cx="320" cy="40" r="6" fill="white"/>
          </svg>

          {/* Phone mockup floating */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-6 bottom-[-10px] z-10"
          >
            <img
              src="/phone-mockup.png"
              alt="Urbont app"
              className="h-40 w-auto object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Urbont brand text in image */}
          <div className="absolute left-5 bottom-5 z-10">
            <div className="flex items-center gap-2">
              <img src="/urbont-logo.png" alt="" className="w-7 h-7 rounded-lg object-contain" />
              <span className="text-white font-extrabold text-lg tracking-tight drop-shadow-md">Urbont</span>
            </div>
          </div>

          {/* X close button */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <X size={17} className="text-white" />
          </button>
        </div>

        {/* ── Content section ── */}
        <div className="px-5 pt-6 pb-7">
          <h2 className="text-[22px] font-extrabold text-gray-900 leading-snug mb-1.5 tracking-tight">
            {w.title}
          </h2>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            {w.subtitle}
          </p>

          {/* Primary CTA — Urbont blue */}
          <button
            onClick={dismiss}
            className="w-full h-[52px] bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-[15px] transition-colors mb-5 shadow-lg shadow-primary/25"
          >
            {w.primaryCta}
          </button>

          {/* Divider section */}
          <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
            {w.loggedInDesc}
          </p>

          {/* Login CTA — outline blue */}
          <button
            onClick={() => { dismiss(); router.push("/login"); }}
            className="w-full h-[52px] border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-xl text-[15px] transition-all mb-4"
          >
            {w.loginCta}
          </button>

          {/* Create account link */}
          <p className="text-center text-[13px] text-gray-500">
            <button onClick={() => { dismiss(); router.push("/conductor"); }} className="text-primary font-semibold hover:underline underline-offset-2">
              {w.signupCta}
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Ride Price Estimator ──────────────────────────────────── */
const VEHICLE_FARES = [
  { nameKey: 0, base: 22, perMile: 4.5, icon: Car,   gradient: "from-primary to-blue-600",      badge: "bg-primary/10 text-primary" },
  { nameKey: 1, base: 32, perMile: 5.5, icon: Truck, gradient: "from-slate-700 to-slate-900",   badge: "bg-slate-100 text-slate-700" },
  { nameKey: 2, base: 45, perMile: 7.0, icon: Crown, gradient: "from-amber-500 to-orange-500",  badge: "bg-amber-50 text-amber-700" },
];

function RidePriceEstimator() {
  const { t } = useLanguage();
  const r = t.rideEstimator;
  const [origin, setOrigin] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [showEstimate, setShowEstimate] = React.useState(false);
  const [selected, setSelected] = React.useState<number | null>(null);

  const canEstimate = origin.trim().length > 0 && destination.trim().length > 0;

  const handleEstimate = () => {
    if (canEstimate) setShowEstimate(true);
  };

  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-gray-100 shadow-xl p-7"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {r.sectionLabel}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
              {r.title}
            </h2>

            {/* Origin / Destination inputs */}
            <div className="relative mb-5">
              {/* Connector line */}
              <div className="absolute left-[10px] top-[26px] h-[calc(100%-26px)] w-px bg-gradient-to-b from-primary/60 to-primary/20" />

              {/* Origin */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary bg-white shrink-0 z-10 shadow-sm" />
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={r.origin}
                    value={origin}
                    onChange={(e) => { setOrigin(e.target.value); setShowEstimate(false); }}
                    className="w-full h-13 px-4 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium text-gray-800 transition-all placeholder:text-gray-400 pr-10"
                  />
                  <Navigation size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary opacity-60" />
                </div>
              </div>

              {/* Destination */}
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-sm bg-primary shrink-0 z-10 shadow-sm" />
                <input
                  type="text"
                  placeholder={r.destination}
                  value={destination}
                  onChange={(e) => { setDestination(e.target.value); setShowEstimate(false); }}
                  className="flex-1 h-13 px-4 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium text-gray-800 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleEstimate}
              disabled={!canEstimate}
              className="w-full h-13 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl text-base shadow-lg transition-all"
            >
              {r.cta}
            </Button>

            {/* Price estimate results */}
            {showEstimate && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6"
              >
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {r.estimateLabel}
                </p>
                <div className="space-y-2">
                  {VEHICLE_FARES.map((v, i) => {
                    const vehicle = r.vehicles[i];
                    const isSelected = selected === i;
                    return (
                      <motion.button
                        key={i}
                        onClick={() => setSelected(isSelected ? null : i)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                            : "border-gray-100 hover:border-primary/30 hover:shadow-md bg-white"
                        }`}
                      >
                        <div className={`bg-gradient-to-br ${v.gradient} w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md`}>
                          <v.icon size={19} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 text-sm">{vehicle.name}</p>
                            {i === 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Popular</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{r.etaLabel} {vehicle.eta} min</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-extrabold text-gray-900 text-lg">{r.from} ${v.base}</p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <CheckCircle2 size={12} className="text-white" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {selected !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <a href="/conductor">
                      <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25">
                        {t.hero.downloadApp} <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </a>
                  </motion.div>
                )}

                <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
                  {r.disclaimer}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Earnings Calculator ───────────────────────────────────── */
function EarningsCalculator() {
  const { t } = useLanguage();
  const c = t.calculator;
  const [hours, setHours] = React.useState(6);
  const [days, setDays] = React.useState(5);
  const AVG_FARE = 18;
  const TRIPS_PER_HOUR = 2.2;
  const grossWeekly = Math.round(hours * days * TRIPS_PER_HOUR * AVG_FARE);
  const netUrbont = Math.round(grossWeekly * 0.85);
  const netCompetitor = Math.round(grossWeekly * 0.75);
  const monthlyUrbont = netUrbont * 4;
  const monthlyComp = netCompetitor * 4;
  const diff = monthlyUrbont - monthlyComp;

  return (
    <section className="py-28 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
            {c.label}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {c.title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {c.desc}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8"
          >
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-700">
                  {c.hoursPerDay}
                </label>
                <span className="text-2xl font-black text-primary">{hours}h</span>
              </div>
              <input
                type="range" min={2} max={12} value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>2h</span><span>12h</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-700">
                  {c.daysPerWeek}
                </label>
                <span className="text-2xl font-black text-primary">{days} {c.days}</span>
              </div>
              <input
                type="range" min={1} max={7} value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1</span><span>7</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-2">{c.assumptions}</p>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between"><span>{c.avgFare}</span><span className="font-semibold">${AVG_FARE}</span></div>
                <div className="flex justify-between"><span>{c.tripsPerHour}</span><span className="font-semibold">{TRIPS_PER_HOUR}</span></div>
                <div className="flex justify-between"><span>{c.urbontCommission}</span><span className="font-semibold text-emerald-600">15%</span></div>
                <div className="flex justify-between"><span>{c.competitorCommission}</span><span className="font-semibold text-red-500">25%</span></div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl border-2 border-primary shadow-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Urbont</span>
              </div>
              <p className="text-sm text-gray-500 mb-1">{c.estimatedMonthly}</p>
              <motion.p
                key={monthlyUrbont}
                initial={{ scale: 0.95, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-black text-gray-900 mb-2"
              >
                ${monthlyUrbont.toLocaleString()}
              </motion.p>
              <p className="text-xs text-gray-500">
                ${netUrbont.toLocaleString()} / {c.week} · {c.commission} 15%
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">{c.otherPlatforms} (25%)</p>
                  <p className="text-2xl font-bold text-gray-500">${monthlyComp.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium mb-0.5">{c.monthlyDiff}</p>
                  <motion.p
                    key={diff}
                    initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                    className="text-2xl font-black text-emerald-600"
                  >
                    +${diff.toLocaleString()}
                  </motion.p>
                </div>
              </div>
              <div className="mt-3 bg-white rounded-xl p-3 border border-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  {c.comparison(diff, diff * 12)}
                </p>
              </div>
            </div>

            <a href="/conductor">
              <Button className="w-full h-13 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 text-base">
                {c.startEarning}
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ───────────────────────────────────────────────────── */
function FAQ() {
  const { t } = useLanguage();
  const f = t.faq;
  const [open, setOpen] = React.useState<number | null>(null);

  return (
    <section className="py-28 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
            {f.label}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {f.title}
          </h2>
          <p className="text-lg text-gray-600">
            {f.desc}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {f.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-sm md:text-base">{item.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown size={18} className="text-gray-400" />
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{item.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 mb-4 text-sm">
            {f.noAnswer}
          </p>
          <Button variant="outline" className="border-gray-200 text-gray-700 hover:border-primary hover:text-primary font-semibold">
            <HelpCircle size={16} className="mr-2" />
            {f.helpCenter}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Static data ────────────────────────────────────────────── */
const serviceCategoryMeta = [
  { icon: Car, gradient: "from-blue-400 to-cyan-400", tagColor: "bg-blue-100 text-blue-700", name: "Urbont Go" },
  { icon: Crown, gradient: "from-amber-400 to-orange-500", tagColor: "bg-amber-100 text-amber-700", name: "Urbont Premium" },
  { icon: Users, gradient: "from-emerald-400 to-teal-500", tagColor: "bg-emerald-100 text-emerald-700", name: "Urbont Pool" },
  { icon: Truck, gradient: "from-violet-400 to-purple-500", tagColor: "bg-violet-100 text-violet-700", name: "Urbont SUV" },
  { icon: Building2, gradient: "from-rose-400 to-pink-600", tagColor: "bg-rose-100 text-rose-700", name: "Urbont Valet" },
  { icon: Briefcase, gradient: "from-slate-500 to-gray-700", tagColor: "bg-gray-100 text-gray-700", name: "Urbont Business" },
];

const serviceCategoryLinks = [
  "#pasajeros",
  "#pasajeros",
  "#pasajeros",
  "#pasajeros",
  "/valet",
  "#empresas",
];

const passengerFeatureMeta = [
  { icon: Zap, gradient: "from-amber-400 to-orange-500" },
  { icon: Banknote, gradient: "from-emerald-400 to-teal-500" },
  { icon: ShieldCheck, gradient: "from-blue-400 to-cyan-500" },
  { icon: HeartHandshake, gradient: "from-violet-400 to-purple-500" },
];

const techFeatureMeta = [
  { icon: Cpu, gradient: "from-violet-400 to-purple-500" },
  { icon: Navigation, gradient: "from-blue-400 to-cyan-500" },
  { icon: Lock, gradient: "from-emerald-400 to-teal-500" },
  { icon: TrendingUp, gradient: "from-amber-400 to-orange-500" },
  { icon: BadgeCheck, gradient: "from-rose-400 to-pink-500" },
  { icon: Leaf, gradient: "from-green-400 to-emerald-500" },
];

const testimonials = [
  {
    name: "María García", role: "Pasajera frecuente", city: "Miami, FL",
    avatar: "MG", gradient: "from-pink-400 to-rose-500", rating: 5,
    text: "Llevo 8 meses usando Urbont todos los días para ir al trabajo. El conductor siempre llega en menos de 5 minutos y el precio es notablemente más justo. Lo recomiendo sin dudarlo.",
  },
  {
    name: "Roberto Salinas", role: "Conductor activo", city: "Miami, FL",
    avatar: "RS", gradient: "from-blue-400 to-cyan-500", rating: 5,
    text: "Desde que me uní a Urbont mis ingresos crecieron un 40%. La comisión del 15% es la más baja del mercado y el soporte responde en minutos. Por fin una app que cuida a sus conductores.",
  },
  {
    name: "Ana Patricia Reyes", role: "Pasajera frecuente", city: "Miami Beach, FL",
    avatar: "AP", gradient: "from-emerald-400 to-teal-500", rating: 5,
    text: "El seguimiento en tiempo real me da una tranquilidad enorme, especialmente de noche. Puedo compartir mi viaje con mi familia al instante. No volvería a usar ninguna otra app.",
  },
  {
    name: "Hotel Grand Reforma", role: "Cliente Urbont Valet", city: "Miami, FL",
    avatar: "HG", gradient: "from-amber-400 to-orange-500", rating: 5,
    text: "Contratamos Urbont Valet hace 6 meses. El personal está impecablemente capacitado, puntual y con una actitud de servicio de primer nivel. Nuestros huéspedes lo adoran.",
  },
];

const enterpriseBenefitsMeta = [Receipt, BarChart3, CalendarCheck, ShieldCheck];
const stepsMeta = [Smartphone, MapPin, Star];
const statsMeta = [
  { icon: Globe, num: 50, suffix: "+" },
  { icon: Users, num: 2, suffix: "M+" },
  { icon: Car, num: 150, suffix: "k+" },
  { icon: Award, num: 4.8, suffix: "" },
];
const safetyPointsMeta = [BadgeCheck, PhoneCall, ShieldCheck, HeartHandshake];

/* ─── Home Component ─────────────────────────────────────────── */
export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = React.useState(false);
  const [langDropOpen, setLangDropOpen] = React.useState(false);
  const [waitlistEmail, setWaitlistEmail] = React.useState("");
  const [waitlistSuccess, setWaitlistSuccess] = React.useState(false);
  const [waitlistError, setWaitlistError] = React.useState(false);
  const { t, lang, setLang } = useLanguage();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i = 0) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.65, ease: EASE, delay: i * 0.1 },
    }),
  };

  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, -55]);
  const heroBlobParallax = useTransform(scrollY, [0, 600], [0, 50]);

  const techFeatures = t.tech.features;

  return (
    <div className="min-h-screen bg-white selection:bg-primary/20 selection:text-primary overflow-x-hidden">

      {/* ── Navigation ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md border-b border-gray-100 py-3" : "bg-white/80 backdrop-blur-md border-b border-white/20 py-5"}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 z-50">
            <img src="/urbont-logo.png" alt="Urbont Logo" className="h-9 w-9 object-contain rounded-lg shadow-sm" />
            <span className="text-xl font-extrabold tracking-tight text-gray-900">Urbont</span>
          </a>

          <nav className="hidden md:flex items-center gap-7">
            {t.nav.links.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">{link.name}</a>
            ))}
            <a href="#ciudades" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
              {t.nav.citiesLink}
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropOpen(!langDropOpen)}
                onBlur={() => setTimeout(() => setLangDropOpen(false), 150)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:border-primary hover:text-primary transition-colors"
                aria-label="Switch language"
              >
                <Globe size={14} />
                {LANGUAGES.find(l => l.code === lang)?.flag} {t.lang.current}
                <ChevronDown size={12} className={`transition-transform ${langDropOpen ? "rotate-180" : ""}`} />
              </button>
              {langDropOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden min-w-[140px]">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangDropOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-left transition-colors ${lang === l.code ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <span>{l.flag}</span><span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="ghost" className="font-semibold text-gray-700 hover:text-primary" onClick={() => router.push("/login")}>{t.nav.login}</Button>
            <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 shadow-md shadow-primary/25 font-semibold" onClick={() => router.push("/conductor")}>{t.nav.signup}</Button>
          </div>

          <button className="md:hidden p-2 text-gray-700 relative z-10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="button-mobile-menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu Overlay (dark) ── */}
      <div
        className={`fixed inset-0 md:hidden flex flex-col bg-gray-950 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ zIndex: 60 }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
            <img src="/urbont-logo.png" alt="Urbont" className="h-7 w-7 object-contain rounded-lg" />
            <span className="text-lg font-extrabold tracking-tight text-white">Urbont</span>
          </a>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-10">

          {/* Role selector — Uber-style */}
          <div className="mt-6 mb-8">
            <a href="#pasajeros" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-5 border-b border-white/10 group">
              <span className="text-2xl font-extrabold text-white tracking-tight group-hover:text-primary transition-colors">
                {t.nav.links[1].name}
              </span>
              <ArrowRight size={22} className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </a>
            <a href="/conductor" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-5 border-b border-white/10 group">
              <span className="text-2xl font-extrabold text-white tracking-tight group-hover:text-primary transition-colors">
                {t.nav.links[2].name}
              </span>
              <ArrowRight size={22} className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </a>
            <a href="#empresas" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-5 border-b border-white/10 group">
              <span className="text-2xl font-extrabold text-white tracking-tight group-hover:text-primary transition-colors">
                {t.nav.links[3].name}
              </span>
              <ArrowRight size={22} className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </a>
          </div>

          {/* Nav sections */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-8">
            {/* Services */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t.nav.links[0].name}</p>
              <div className="flex flex-col gap-2.5">
                {serviceCategoryMeta.map((cat, i) => (
                  <a key={cat.name} href={serviceCategoryLinks[i]} onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigate */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t.nav.citiesLink}</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { name: t.nav.links[4].name, href: t.nav.links[4].href },
                  { name: t.nav.citiesLink, href: "#ciudades" },
                  { name: "FAQ", href: "#faq" },
                ].map(({ name, href }) => (
                  <a key={name} href={href} onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-5 mb-8 border-t border-white/10 pt-6">
            {[
              { Icon: SiFacebook, href: "https://facebook.com" },
              { Icon: SiInstagram, href: "https://instagram.com" },
              { Icon: SiTiktok, href: "https://tiktok.com" },
              { Icon: SiYoutube, href: "https://youtube.com" },
            ].map(({ Icon, href }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors">
                <Icon size={20} />
              </a>
            ))}
          </div>

          {/* Language selector */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={13} className="text-gray-500" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.nav.language}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button key={l.code}
                  onClick={() => { setLang(l.code); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    lang === l.code
                      ? "bg-primary/20 text-primary border-primary/40"
                      : "text-gray-400 border-white/10 hover:border-white/25 hover:text-white"
                  }`}>
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* App store badges */}
          <div className="flex gap-3 mb-8">
            <a href="#" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 hover:border-white/30 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.97 3.67 2.06-3.44 2.14-2.89 6.84.6 8.35-.69 1.25-1.57 2.35-2.92 2.6zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <div>
                <p className="text-[9px] text-gray-400 leading-none">Download on the</p>
                <p className="text-xs font-bold text-white leading-tight">App Store</p>
              </div>
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 hover:border-white/30 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
                <path d="M3.18 23.76c.3.17.64.22.99.13l12.7-7.34-2.68-2.68-11.01 9.89zm-1.5-20.1a1.74 1.74 0 00-.18.77v18.8c0 .28.06.54.18.77l.09.08 10.53-10.53v-.25L1.59 3.58l-.09.08zm18.54 8.96l-2.64-1.52-2.98 2.98 2.98 2.97 2.67-1.54a1.79 1.79 0 000-2.89zm-16.9 9.62l11.42-6.6-2.68-2.68-8.74 9.28z"/>
              </svg>
              <div>
                <p className="text-[9px] text-gray-400 leading-none">Get it on</p>
                <p className="text-xs font-bold text-white leading-tight">Google Play</p>
              </div>
            </a>
          </div>

          {/* Auth + copyright */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
            <button onClick={() => { setMobileMenuOpen(false); router.push("/login"); }} className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">{t.nav.login}</button>
            <span className="text-gray-700">·</span>
            <button onClick={() => { setMobileMenuOpen(false); router.push("/conductor"); }} className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">{t.nav.signup}</button>
            <span className="flex-1" />
            <p className="text-xs text-gray-600">© 2026 Urbont</p>
          </div>

        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/60" />
        <motion.div
          style={{ y: heroBlobParallax, background: "radial-gradient(circle at 60% 40%, hsl(202 51% 37% / 0.13), transparent 68%)" }}
          className="absolute top-0 right-0 w-[72%] h-[88%] rounded-full blur-3xl animate-blob"
        />
        <motion.div
          style={{ background: "radial-gradient(circle at 40% 60%, hsl(210 100% 75% / 0.32), transparent 68%)" }}
          className="absolute bottom-0 left-0 w-[52%] h-[62%] rounded-full blur-3xl animate-blob-alt"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(202_51%_37%/0.028)_1px,transparent_1px),linear-gradient(to_bottom,hsl(202_51%_37%/0.028)_1px,transparent_1px)] [background-size:64px_64px] hidden lg:block" />
        <motion.div animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-40 right-[10%] w-5 h-5 rounded-full bg-primary/25 hidden lg:block" />
        <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-60 right-[20%] w-3 h-3 rounded-full bg-amber-400/40 hidden lg:block" />
        <motion.div animate={{ y: [0, -12, 0], x: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-44 left-[12%] w-3.5 h-3.5 rounded-full bg-cyan-400/30 hidden lg:block" />
        <motion.div animate={{ y: [0, 18, 0], rotate: [0, -6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }} className="absolute bottom-40 right-[35%] w-2.5 h-2.5 rounded-full bg-violet-400/25 hidden lg:block" />
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute top-52 left-[25%] w-2 h-2 rounded-full bg-rose-400/20 hidden lg:block" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div>
              <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
                className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />{t.hero.badge}
              </motion.div>

              <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.08] mb-6 tracking-tight">
                {t.hero.title1}<br />
                <span className="text-primary">{t.hero.title2}</span>
              </motion.h1>

              <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-lg md:text-xl text-gray-600 mb-9 leading-relaxed max-w-lg">
                {t.hero.desc}
              </motion.p>

              <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Button className="h-14 px-8 text-base bg-gray-900 text-white hover:bg-gray-800 rounded-xl shadow-lg flex items-center gap-3 font-semibold" data-testid="button-hero-download">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current shrink-0">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.97 3.67 2.06-3.44 2.14-2.89 6.84.6 8.35-.69 1.25-1.57 2.35-2.92 2.6zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  {t.hero.downloadApp}
                </Button>
                <a href="/conductor">
                  <Button variant="outline" className="h-14 px-8 text-base border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 rounded-xl font-semibold transition-all" data-testid="button-hero-driver">
                    {t.hero.becomeDriver}<ArrowRight size={18} className="ml-2" />
                  </Button>
                </a>
              </motion.div>

              <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-6 mt-10 pt-8 border-t border-gray-100">
                {t.hero.stats.map(([val, lbl]) => (
                  <div key={lbl}>
                    <p className="text-xl font-extrabold text-gray-900">{val}</p>
                    <p className="text-xs text-gray-500 font-medium">{lbl}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.93, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} style={{ y: heroParallax }} className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl transform translate-x-5 translate-y-5 blur-sm" />
              <img src="/hero.png" alt="Pasajero subiendo a un Urbont" className="relative rounded-3xl shadow-2xl object-cover w-full h-[420px] md:h-[580px]" />

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-100">
                <div className="bg-emerald-500 p-2.5 rounded-xl text-white shadow-md"><ShieldCheck size={20} /></div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.badges.safeRide}</p>
                  <p className="text-xs text-gray-500">{t.badges.verifiedDriver}</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute top-8 -right-6 bg-white p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-100">
                <div className="bg-primary p-2.5 rounded-xl text-white shadow-md"><Clock size={18} /></div>
                <div>
                  <p className="text-xs text-gray-500">{t.badges.avgEta}</p>
                  <p className="text-base font-extrabold text-gray-900">3 min</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <RidePriceEstimator />

      {/* ── Para Pasajeros ── */}
      <section id="pasajeros" className="py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">{t.passengers.sectionLabel}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{t.passengers.title}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{t.passengers.desc}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {passengerFeatureMeta.map((f, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className={`bg-gradient-to-br ${f.gradient} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={26} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t.passengers.features[i].title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{t.passengers.features[i].desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Para Conductores ── */}
      <section id="conductores" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-white to-blue-50/50" />
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }}>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-5">{t.drivers.sectionLabel}</span>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight leading-tight">
                {t.drivers.title1}{" "}<span className="text-primary">{t.drivers.title2}</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">{t.drivers.desc}</p>
              <ul className="space-y-3.5 mb-10">
                {t.drivers.perks.map((perk, i) => (
                  <motion.li key={i} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-primary shrink-0" />
                    <span className="text-gray-700 font-medium">{perk}</span>
                  </motion.li>
                ))}
              </ul>
              <a href="/conductor">
                <Button className="h-14 px-10 text-base bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 font-bold" data-testid="button-driver-signup">
                  {t.drivers.cta}<ArrowRight size={18} className="ml-2" />
                </Button>
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} viewport={{ once: true }}
              className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/25 animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-primary/15 animate-[spin_60s_linear_infinite_reverse]" />
                <div className="absolute inset-12 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center">
                  <Car size={64} className="text-primary/50" />
                </div>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-12 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 min-w-[140px]">
                  <p className="text-xs font-semibold text-gray-500 mb-1">{t.drivers.floatingEarnings}</p>
                  <p className="text-2xl font-black text-emerald-600">$1,250</p>
                  <p className="text-xs text-emerald-500 mt-1 font-medium">{t.drivers.floatingEarningsVs}</p>
                </motion.div>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-12 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100">
                  <div className="flex items-center gap-1.5 text-amber-400 mb-1">{[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}</div>
                  <p className="text-xl font-black text-gray-900">4.95</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.drivers.floatingRating}</p>
                </motion.div>
                <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-1/2 -translate-y-1/2 -right-20 bg-primary rounded-xl px-4 py-2 shadow-xl text-white">
                  <p className="text-xs font-medium opacity-90">{t.drivers.floatingTrips}</p>
                  <p className="text-lg font-black">1,842</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Earnings Calculator ── */}
      <EarningsCalculator />

      {/* ── Servicios ── */}
      <section id="servicios" className="py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">{t.services.sectionLabel}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{t.services.title}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{t.services.desc}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {serviceCategoryMeta.map((cat, i) => (
              <motion.a key={i} href={serviceCategoryLinks[i]} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden p-6 cursor-pointer block">
                <div className={`w-14 h-14 bg-gradient-to-br ${cat.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon size={26} className="text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-extrabold text-gray-900">{cat.name}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${cat.tagColor}`}>{t.services.categories[i].tag}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{t.services.categories[i].desc}</p>
                <div className="mt-4 flex items-center gap-1 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {t.services.learnMore}<ChevronRight size={15} />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tecnología ── */}
      <section id="tecnologia" className="py-28 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
              {t.tech.sectionLabel}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {t.tech.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.tech.desc}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {techFeatureMeta.map((f, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className={`bg-gradient-to-br ${f.gradient} w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={26} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{techFeatures[i].title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{techFeatures[i].desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,#fff_1px,transparent_1px),radial-gradient(circle_at_80%_50%,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {statsMeta.map((stat, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="flex flex-col items-center text-center text-white">
                <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl mb-5 border border-white/20">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-4xl md:text-5xl font-black mb-2 tabular-nums">
                  <AnimatedCounter to={stat.num} suffix={stat.suffix} />
                </p>
                <p className="text-sm font-semibold text-white/75 uppercase tracking-widest">{t.stats.labels[i]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section id="como-funciona" className="py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">{t.howItWorks.sectionLabel}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{t.howItWorks.title}</h2>
            <p className="text-lg text-gray-600">{t.howItWorks.desc}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-10 left-[22%] right-[22%] h-0.5 bg-primary/20" />
            {stepsMeta.map((StepIcon, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25 text-white">
                    <StepIcon size={32} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-black">{i + 1}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t.howItWorks.steps[i].title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm max-w-xs">{t.howItWorks.steps[i].desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ciudades ── */}
      <section id="ciudades" className="py-28 bg-gradient-to-br from-slate-50 to-blue-50/20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
              {t.citiesSection.sectionLabel}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {t.citiesSection.title1} <span className="text-primary">{t.citiesSection.title2}</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.citiesSection.desc}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <CityMap />
          </motion.div>
        </div>
      </section>

      {/* ── Seguridad ── */}
      <section id="seguridad" className="py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="bg-primary p-10 md:p-14 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-7 border border-white/30">
                    <ShieldCheck size={28} className="text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5 tracking-tight leading-tight">{t.safety.title}</h2>
                  <p className="text-white/80 text-lg leading-relaxed mb-8">{t.safety.desc}</p>
                  <ul className="space-y-4">
                    {safetyPointsMeta.map((PointIcon, i) => (
                      <motion.li key={i} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="flex items-center gap-3 text-white">
                        <div className="bg-white/20 p-1.5 rounded-lg border border-white/20 shrink-0"><PointIcon size={16} /></div>
                        <span className="font-medium">{t.safety.points[i]}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-10 md:p-14 flex items-center justify-center bg-gray-50/50">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="w-full max-w-sm">
                  <div className="bg-gradient-to-br from-blue-100 to-primary/20 rounded-2xl h-40 mb-4 relative overflow-hidden border border-gray-100 shadow-sm">
                    <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#2E6DA420_1px,transparent_1px),linear-gradient(to_bottom,#2E6DA420_1px,transparent_1px)] [background-size:20px_20px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white rounded-full p-3 shadow-lg border border-gray-100"><MapPin size={22} className="text-primary" /></div>
                    </div>
                    <div className="absolute top-1/2 left-[30%] right-[30%] h-0.5 bg-primary/40 rounded-full" />
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg">CM</div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-base">Carlos M.</p>
                        <div className="flex items-center text-sm text-gray-500 gap-2 mt-0.5">
                          <span className="flex items-center gap-0.5 text-amber-500 font-semibold"><Star size={13} fill="currentColor" /> 4.9</span>
                          <span className="text-gray-300">•</span>
                          <span>Toyota Corolla Blanco</span>
                        </div>
                      </div>
                      <div className="bg-emerald-100 px-2.5 py-1 rounded-full">
                        <p className="text-xs font-bold text-emerald-700">{t.safety.driverCard.onTheWay}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mb-3 font-medium">
                      {t.safety.driverCard.arriveIn} <span className="text-gray-900 font-bold">3 {t.safety.driverCard.min}</span>
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 text-primary border-primary/25 hover:bg-primary/5 font-semibold h-10 text-sm">
                        <PhoneCall size={15} className="mr-1.5" />{t.safety.driverCard.contact}
                      </Button>
                      <Button variant="destructive" className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold h-10 text-sm shadow-md">
                        {t.safety.driverCard.emergency}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Download CTA ── */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-14 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full" />
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-5">{t.download.label}</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight leading-tight">{t.download.title}</h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">{t.download.desc}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="h-16 px-7 bg-gray-900 text-white hover:bg-gray-800 rounded-2xl text-base flex items-center gap-3 font-semibold shadow-lg" data-testid="button-appstore">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current shrink-0">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.97 3.67 2.06-3.44 2.14-2.89 6.84.6 8.35-.69 1.25-1.57 2.35-2.92 2.6zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs text-gray-400 leading-none font-normal">{t.download.appStore}</div>
                      <div className="text-lg font-bold leading-tight mt-0.5">App Store</div>
                    </div>
                  </Button>
                  <Button className="h-16 px-7 bg-gray-900 text-white hover:bg-gray-800 rounded-2xl text-base flex items-center gap-3 font-semibold shadow-lg" data-testid="button-playstore">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current shrink-0">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186c-.165-.165-.25-.368-.25-.615V2.429c0-.248.085-.45.25-.615zM14.773 11.02l2.336-2.336-12.06-6.963 9.724 9.299zM20.216 10.434l-2.023-1.168-3.414 3.414 3.414 3.414 2.023-1.168c.626-.361 1.002-.857 1.002-1.488s-.376-1.127-1.002-1.488zM4.048 22.756l12.06-6.963-2.336-2.336-9.724 9.299z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs text-gray-400 leading-none font-normal">{t.download.playStore}</div>
                      <div className="text-lg font-bold leading-tight mt-0.5">Google Play</div>
                    </div>
                  </Button>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }} className="flex justify-center items-center relative z-10">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://urbont.app&bgcolor=ffffff&color=2D7D9A&margin=4"
                      alt="Scan to download Urbont"
                      className="w-[180px] h-[180px] rounded-lg"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Scan to download</p>
                    <p className="text-sm text-gray-500">Available on iOS & Android</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Empresas & Valet ── */}
      <section id="empresas" className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }}>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-5">{t.enterprise.sectionLabel}</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 tracking-tight leading-tight">
                  {t.enterprise.title1}{" "}<span className="text-primary">{t.enterprise.title2}</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">{t.enterprise.desc}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/valet">
                    <Button className="h-13 px-8 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20" data-testid="button-valet-cta">
                      <Building2 size={17} className="mr-2" />{t.enterprise.requestValet}
                    </Button>
                  </a>
                  <Button variant="outline" className="h-13 px-8 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary hover:text-primary" data-testid="button-business-info">
                    <Briefcase size={17} className="mr-2" />{t.enterprise.businessInfo}
                  </Button>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
                {enterpriseBenefitsMeta.map((BIcon, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-colors duration-200 group">
                    <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-200">
                      <BIcon size={20} className="text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{t.enterprise.benefits[i].title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{t.enterprise.benefits[i].desc}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="bg-primary rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">{t.enterprise.valet.label}</p>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">{t.enterprise.valet.title}</h3>
                  <p className="text-white/80 max-w-xl leading-relaxed">{t.enterprise.valet.desc}</p>
                  <div className="flex flex-wrap gap-3 mt-5">
                    {t.enterprise.valet.tags.map((tag) => (
                      <span key={tag} className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0">
                  <a href="/valet">
                    <Button className="h-14 px-8 bg-white text-primary font-bold rounded-xl shadow-2xl hover:bg-gray-50 whitespace-nowrap" data-testid="button-valet-banner">
                      {t.enterprise.valet.cta}<ArrowRight size={18} className="ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Roles Comparison ── */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">{t.rolesComparison.sectionLabel}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{t.rolesComparison.title}</h2>
            <p className="text-gray-600 text-lg leading-relaxed">{t.rolesComparison.desc}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Conductor card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }} viewport={{ once: true }}
              className="relative bg-gradient-to-br from-primary/5 via-white to-blue-50/50 border border-primary/20 rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute top-5 right-5">
                <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{t.rolesComparison.conductor.tag}</span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-primary/25">
                <Car size={26} className="text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{t.rolesComparison.conductor.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{t.rolesComparison.conductor.pitch}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {t.rolesComparison.conductor.perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <a href="/conductor">
                <Button className="w-full h-12 font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20">
                  {t.rolesComparison.conductor.cta} <ArrowRight size={16} className="ml-2" />
                </Button>
              </a>
            </motion.div>

            {/* Valet Front Desk card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }} viewport={{ once: true }}
              className="relative bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 border border-amber-200/60 rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute top-5 right-5">
                <span className="inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{t.rolesComparison.valet.tag}</span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-amber-400/25">
                <Zap size={26} className="text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{t.rolesComparison.valet.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{t.rolesComparison.valet.pitch}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {t.rolesComparison.valet.perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <a href="/valet">
                <Button className="w-full h-12 font-bold bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 text-white rounded-xl shadow-lg shadow-amber-400/20 border-0">
                  {t.rolesComparison.valet.cta} <ArrowRight size={16} className="ml-2" />
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Vs divider hint */}
          <div className="flex items-center justify-center mt-8 gap-3 text-sm text-gray-400">
            <div className="h-px w-16 bg-gray-200" />
            <span className="font-semibold">vs</span>
            <div className="h-px w-16 bg-gray-200" />
          </div>
          <p className="text-center text-xs text-gray-400 mt-3 max-w-sm mx-auto">{t.rolesComparison.desc}</p>
        </div>
      </section>

      {/* ── Driver CTA ── */}
      <section className="py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <p className="text-primary font-bold text-sm mb-4 uppercase tracking-widest">{t.driverCta.label}</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight max-w-3xl mx-auto leading-tight">{t.driverCta.title}</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">{t.driverCta.desc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/conductor">
              <Button className="h-14 px-10 text-base bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-xl shadow-primary/30" data-testid="button-driver-cta">
                {t.driverCta.cta}<ArrowRight size={18} className="ml-2" />
              </Button>
            </a>
            <Button variant="outline" className="h-14 px-10 text-base border-gray-600 text-gray-300 hover:border-primary hover:text-white hover:bg-primary/10 rounded-xl font-semibold">
              {t.driverCta.secondary}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── Waitlist ── */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-white to-primary/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-5">
              <Mail size={14} />
              {t.waitlist.sectionLabel}
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              {t.waitlist.title}
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              {t.waitlist.desc}
            </p>

            {waitlistSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl font-semibold text-base"
              >
                <CheckCircle2 size={20} className="shrink-0" />
                {t.waitlist.success}
              </motion.div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!waitlistEmail.includes("@")) return;
                  setWaitlistError(false);
                  try {
                    const res = await fetch(`/api/waitlist`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: waitlistEmail, source: "home" }),
                    });
                    if (res.ok) {
                      setWaitlistSuccess(true);
                    } else {
                      setWaitlistError(true);
                    }
                  } catch {
                    setWaitlistError(true);
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder={t.waitlist.placeholder}
                  className="flex-1 h-13 px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium text-gray-800 bg-white shadow-sm transition-all"
                />
                <Button
                  type="submit"
                  className="h-13 px-6 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 shrink-0 gap-2"
                >
                  <Send size={16} />
                  {t.waitlist.cta}
                </Button>
              </form>
            )}
            {waitlistError && !waitlistSuccess && (
              <p className="mt-3 text-sm text-red-500 font-medium">
                Something went wrong. Please try again or email us at contact@urbont.com.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQ />

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <a href="#" className="flex items-center gap-2.5 mb-6">
                <img src="/urbont-logo.png" alt="Urbont Logo" className="h-9 w-9 object-contain rounded-lg" />
                <span className="text-2xl font-extrabold tracking-tight text-gray-900">Urbont</span>
              </a>
              <p className="text-gray-500 mb-7 max-w-sm leading-relaxed text-sm">{t.footer.desc}</p>
              <div className="flex gap-3">
                {[{Icon: SiFacebook, label: "Facebook"},{Icon: SiInstagram, label: "Instagram"},{Icon: SiTiktok, label: "TikTok"},{Icon: SiYoutube, label: "YouTube"}].map(({Icon, label}) => (
                  <a key={label} href="#" aria-label={label} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all duration-200 hover:scale-105">
                    <Icon size={17} />
                  </a>
                ))}
              </div>
              <div className="mt-6 space-y-2.5">
                <a href="mailto:contact@urbont.com" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors group">
                  <Mail size={14} className="text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                  contact@urbont.com
                </a>
                <a href="tel:+15616632691" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors group">
                  <PhoneCall size={14} className="text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                  +1 561 663 2691
                </a>
              </div>
            </div>
            {t.footer.columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-gray-900 mb-5 uppercase text-xs tracking-widest">{col.title}</h4>
                <ul className="space-y-3.5">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Urbont Technologies Inc. {t.footer.copyright}</p>
            <div className="flex gap-6">
              {t.footer.legal.map((item, i) => (
                <a
                  key={item}
                  href={i === 0 ? "/privacy" : i === 1 ? "/terms" : "#cookies"}
                  className="hover:text-gray-700 transition-colors font-medium"
                >{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <CookieConsent />
      <WelcomeModal />
    </div>
  );
}
