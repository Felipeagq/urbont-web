"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Star,
  Car,
  Users,
  Zap,
  Mail,
  Building2,
  ChevronLeft,
  Palmtree,
  Anchor,
  Waves,
  Landmark,
  Music2,
  Dice5,
  Film,
  Wind,
  Ticket,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import USMapDots from "@/components/USMapDots";

/* ─── Data ─── */
const ACTIVE_CITY = {
  name: "Miami",
  state: "Florida",
  stateCode: "FL",
  icon: Palmtree,
  status: "active",
  since: "2024",
  stats: [
    { label: "Active drivers", value: "2,400+" },
    { label: "Rides completed", value: "180k+" },
    { label: "Avg rating", value: "4.9" },
    { label: "Avg ETA", value: "4 min" },
  ],
  areas: [
    "Downtown Miami",
    "Brickell",
    "Wynwood",
    "Coconut Grove",
    "Coral Gables",
    "Miami Beach",
    "Doral",
    "Hialeah",
    "Little Havana",
    "Aventura",
    "Kendall",
    "Airport (MIA)",
  ],
  desc: "Our home city and operational headquarters. Full coverage across Miami-Dade County with 24/7 service, Valet Front Desk agents at premium venues, and business fleet solutions.",
};

const COMING_SOON: {
  name: string;
  state: string;
  stateCode: string;
  icon: LucideIcon;
  eta: string;
  priority: number;
  highlights: string[];
}[] = [
  { name: "Orlando", state: "Florida", stateCode: "FL", icon: Ticket, eta: "Q3 2025", priority: 1, highlights: ["International Drive", "Lake Nona", "Theme park district"] },
  { name: "Fort Lauderdale", state: "Florida", stateCode: "FL", icon: Anchor, eta: "Q3 2025", priority: 2, highlights: ["Las Olas Blvd", "Port Everglades", "Beach district"] },
  { name: "Tampa", state: "Florida", stateCode: "FL", icon: Landmark, eta: "Q4 2025", priority: 3, highlights: ["Ybor City", "Hyde Park", "Tampa Airport"] },
  { name: "Jacksonville", state: "Florida", stateCode: "FL", icon: Waves, eta: "Q4 2025", priority: 4, highlights: ["Riverside", "Jacksonville Beach", "St. Johns Town Center"] },
  { name: "Atlanta", state: "Georgia", stateCode: "GA", icon: Building2, eta: "Q1 2026", priority: 5, highlights: ["Midtown", "Buckhead", "Hartsfield-Jackson Airport"] },
  { name: "Houston", state: "Texas", stateCode: "TX", icon: Landmark, eta: "Q1 2026", priority: 6, highlights: ["Downtown", "Montrose", "George Bush Airport"] },
  { name: "Dallas", state: "Texas", stateCode: "TX", icon: Star, eta: "Q2 2026", priority: 7, highlights: ["Deep Ellum", "Uptown", "DFW Airport"] },
  { name: "Austin", state: "Texas", stateCode: "TX", icon: Music2, eta: "Q2 2026", priority: 8, highlights: ["Downtown", "South Congress", "Austin-Bergstrom Airport"] },
  { name: "Las Vegas", state: "Nevada", stateCode: "NV", icon: Dice5, eta: "Q3 2026", priority: 9, highlights: ["The Strip", "Downtown Fremont", "Harry Reid Airport"] },
  { name: "New York", state: "New York", stateCode: "NY", icon: Building2, eta: "TBD", priority: 10, highlights: ["Manhattan", "Brooklyn", "Queens"] },
  { name: "Los Angeles", state: "California", stateCode: "CA", icon: Film, eta: "TBD", priority: 11, highlights: ["Hollywood", "Santa Monica", "LAX"] },
  { name: "Chicago", state: "Illinois", stateCode: "IL", icon: Wind, eta: "TBD", priority: 12, highlights: ["The Loop", "River North", "O'Hare Airport"] },
];

/* ─── Seed demand data ─── */
const SEED_DEMANDS: Record<string, number> = {
  "Orlando, FL": 847,
  "Houston, TX": 612,
  "Atlanta, GA": 589,
  "New York, NY": 541,
  "Dallas, TX": 478,
  "Chicago, IL": 392,
  "Los Angeles, CA": 356,
  "Las Vegas, NV": 287,
  "Tampa, FL": 234,
  "Austin, TX": 198,
  "Phoenix, AZ": 176,
  "Jacksonville, FL": 143,
};

function loadDemands(): Record<string, number> {
  try {
    const stored = localStorage.getItem("urbont_demands_v1");
    const parsed: Record<string, number> = stored ? JSON.parse(stored) : {};
    const merged = { ...SEED_DEMANDS };
    for (const [city, count] of Object.entries(parsed)) {
      merged[city] = (merged[city] ?? 0) + count;
    }
    return merged;
  } catch {
    return { ...SEED_DEMANDS };
  }
}

function saveDemandVote(city: string) {
  try {
    const stored = localStorage.getItem("urbont_demands_v1");
    const parsed: Record<string, number> = stored ? JSON.parse(stored) : {};
    parsed[city] = (parsed[city] ?? 0) + 1;
    localStorage.setItem("urbont_demands_v1", JSON.stringify(parsed));
  } catch { /* ignore */ }
}

/* ─── Component ─── */
export default function Cities() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [selectedCity, setSelectedCity] = React.useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = React.useState<string | null>(null);
  const [demandCity, setDemandCity] = React.useState("");
  const [demandEmail, setDemandEmail] = React.useState("");
  const [demandSubmitted, setDemandSubmitted] = React.useState(false);
  const [demandLoading, setDemandLoading] = React.useState(false);
  const [waitlistLoading, setWaitlistLoading] = React.useState(false);
  const [demands, setDemands] = React.useState<Record<string, number>>(() => loadDemands());

  React.useEffect(() => {
    fetch(`/api/demands`)
      .then((r) => r.ok ? r.json() : null)
      .then((data: { cities: { city: string; votes: number }[] } | null) => {
        if (!data?.cities) return;
        const merged: Record<string, number> = { ...SEED_DEMANDS };
        for (const { city, votes } of data.cities) {
          merged[city] = votes;
        }
        setDemands(merged);
      })
      .catch(() => { /* keep localStorage fallback */ });
  }, []);

  const topDemandCities = React.useMemo(
    () => Object.entries(demands).sort(([, a], [, b]) => b - a).slice(0, 8),
    [demands]
  );

  async function handleDemandSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!demandCity || !demandEmail || demandLoading) return;
    setDemandLoading(true);
    try {
      const res = await fetch(`/api/demands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: demandCity, email: demandEmail }),
      });
      if (res.ok) {
        const data: { city: string; votes: number } = await res.json();
        setDemands((prev) => ({ ...prev, [data.city]: data.votes }));
      } else {
        saveDemandVote(demandCity);
        setDemands(loadDemands());
      }
    } catch {
      saveDemandVote(demandCity);
      setDemands(loadDemands());
    } finally {
      setDemandLoading(false);
      setDemandSubmitted(true);
    }
  }

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email || waitlistLoading) return;
    setWaitlistLoading(true);
    try {
      await fetch(`/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city: selectedCity ?? undefined, source: "cities" }),
      });
    } catch { /* proceed anyway */ } finally {
      setWaitlistLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" onClick={(e) => { e.preventDefault(); router.push("/"); }} className="flex items-center gap-2.5">
            <img src="/urbont-logo.png" alt="Urbont" className="h-8 w-8 rounded-lg object-contain" />
            <span className="text-lg font-extrabold text-gray-900 tracking-tight">Urbont</span>
          </a>
          <a href="/" onClick={(e) => { e.preventDefault(); router.push("/"); }} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary transition-colors">
            <ChevronLeft size={16} /> Back to home
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative bg-primary overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,#fff_1px,transparent_1px),radial-gradient(circle_at_80%_50%,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/85" />

        <div className="relative container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-sm font-bold mb-6">
              <MapPin size={14} className="text-white" /> Our cities
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight leading-tight">
              Operating in Miami.<br />
              <span className="text-white/90">Expanding across the US.</span>
            </h1>
            <p className="text-white/75 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-8">
              We launched in Miami, Florida — and we're just getting started. Urbont is on its way to every major US city.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#coming-soon">
                <Button className="h-12 px-8 font-bold bg-white text-primary hover:bg-white/90 rounded-xl shadow-lg">
                  See upcoming cities <ArrowRight size={16} className="ml-2" />
                </Button>
              </a>
              <a href="#waitlist">
                <Button variant="outline" className="h-12 px-8 font-bold border-white/30 text-white bg-white/10 hover:bg-white/20 hover:border-white/50 rounded-xl">
                  Join the waitlist
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Interactive US Map ── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Coverage map</h2>
                <p className="text-sm text-gray-500 mt-0.5">Hover over a city to see details</p>
              </div>
              <div className="flex items-center gap-5 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary inline-block" />
                  Active
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  Coming soon
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-gray-300 inline-block" />
                  Planned
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 overflow-hidden shadow-sm bg-gradient-to-br from-blue-50/40 to-sky-50/30 p-4 md:p-6" style={{ minHeight: 340 }}>
              <USMapDots onCityHover={setHoveredCity} hoveredCity={hoveredCity} />
            </div>

            {/* City info strip below map */}
            {hoveredCity && (() => {
              const info: Record<string, { active: boolean; eta?: string; desc: string }> = {
                "Miami":           { active: true,  desc: "Our home city. Full coverage 24/7 across Miami-Dade County." },
                "Fort Lauderdale": { active: false, eta: "Q3 2025", desc: "Broward County expansion — beach district, Port Everglades." },
                "Orlando":         { active: false, eta: "Q3 2025", desc: "Theme park district, Lake Nona, International Drive." },
                "Tampa":           { active: false, eta: "Q4 2025", desc: "Ybor City, Hyde Park, Tampa International Airport." },
                "Jacksonville":    { active: false, eta: "Q4 2025", desc: "Riverside, Jacksonville Beach, St. Johns Town Center." },
                "Atlanta":         { active: false, eta: "Q1 2026", desc: "Midtown, Buckhead, Hartsfield-Jackson Airport." },
                "Houston":         { active: false, eta: "Q1 2026", desc: "Downtown, The Heights, George Bush Airport." },
                "Dallas":          { active: false, eta: "Q2 2026", desc: "Deep Ellum, Uptown, DFW International Airport." },
                "Austin":          { active: false, eta: "Q2 2026", desc: "Downtown, South Congress, Austin-Bergstrom Airport." },
                "Las Vegas":       { active: false, eta: "Q3 2026", desc: "The Strip, Downtown Fremont, Harry Reid Airport." },
                "Phoenix":         { active: false, eta: "Q3 2026", desc: "Downtown, Scottsdale, Sky Harbor Airport." },
                "Los Angeles":     { active: false, eta: "TBD", desc: "Hollywood, Santa Monica, LAX — major market expansion." },
                "Chicago":         { active: false, eta: "TBD", desc: "The Loop, River North, O'Hare International Airport." },
                "New York":        { active: false, eta: "TBD", desc: "Manhattan, Brooklyn, Queens — our largest future market." },
              };
              const d = info[hoveredCity];
              if (!d) return null;
              return (
                <motion.div
                  key={hoveredCity}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-start gap-4 bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm"
                >
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${d.active ? "bg-emerald-500" : "bg-amber-400"}`} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{hoveredCity} {d.active ? <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active now</span> : <span className="ml-2 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Coming {d.eta}</span>}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{d.desc}</p>
                  </div>
                  {!d.active && (
                    <a href="#waitlist" className="ml-auto shrink-0">
                      <Button size="sm" className="h-8 px-4 text-xs font-bold bg-primary text-white rounded-xl">
                        Notify me
                      </Button>
                    </a>
                  )}
                </motion.div>
              );
            })()}
          </motion.div>
        </div>
      </section>

      {/* ── Active city: Miami ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Now active
              </span>
              <span className="text-gray-400 text-sm">Since {ACTIVE_CITY.since}</span>
            </div>

            <div className="grid lg:grid-cols-5 gap-8 items-start">
              {/* Left info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ACTIVE_CITY.icon size={32} className="text-primary" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-gray-900">{ACTIVE_CITY.name}</h2>
                    <p className="text-gray-500 font-semibold">{ACTIVE_CITY.state}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{ACTIVE_CITY.desc}</p>

                <div className="grid grid-cols-2 gap-3">
                  {ACTIVE_CITY.stats.map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <p className="text-xl font-black text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-5">
                  <a href="/conductor">
                    <Button className="h-10 px-5 font-bold bg-primary text-white rounded-xl text-sm">
                      <Car size={15} className="mr-2" /> Become a driver
                    </Button>
                  </a>
                  <a href="/valet">
                    <Button variant="outline" className="h-10 px-5 font-bold border-gray-200 rounded-xl text-sm">
                      <Zap size={15} className="mr-2" /> Valet agent
                    </Button>
                  </a>
                </div>
              </div>

              {/* Right: coverage areas */}
              <div className="lg:col-span-3 bg-gradient-to-br from-primary/5 to-blue-50/60 rounded-3xl p-7 border border-primary/15">
                <div className="flex items-center gap-2 mb-5">
                  <Building2 size={16} className="text-primary" />
                  <p className="text-sm font-bold text-gray-700">Coverage areas in Miami</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {ACTIVE_CITY.areas.map((area) => (
                    <div key={area} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={14} className="text-primary shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-primary/10 flex flex-wrap gap-3">
                  {[
                    { icon: Clock, label: "24 / 7 service" },
                    { icon: Star, label: "4.9 avg rating" },
                    { icon: Users, label: "Business accounts" },
                    { icon: Zap, label: "Valet agents at venues" },
                  ].map(({ icon: Icon, label }) => (
                    <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-primary/20 text-xs font-semibold text-primary">
                      <Icon size={12} /> {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Coming soon ── */}
      <section id="coming-soon" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">Expansion plan</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Coming soon to these cities</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Tap any city to join the waitlist and be the first to know when Urbont launches there.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {COMING_SOON.map((city, i) => {
              const CityIcon = city.icon;
              return (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
                viewport={{ once: true }}
                onClick={() => setSelectedCity(city.name === selectedCity ? null : city.name)}
                className={`cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 ${
                  selectedCity === city.name
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <CityIcon size={20} className="text-primary" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900">{city.name}</p>
                      <p className="text-xs text-gray-500">{city.state}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    city.eta === "TBD"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {city.eta}
                  </span>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${selectedCity === city.name ? "max-h-40 mt-3 pt-3 border-t border-primary/15" : "max-h-0"}`}>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Key areas:</p>
                  <ul className="space-y-1">
                    {city.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-gray-700">
                        <MapPin size={11} className="text-primary shrink-0" /> {h}
                      </li>
                    ))}
                  </ul>
                  <a href="#waitlist">
                    <Button size="sm" className="w-full mt-4 h-9 text-xs font-bold bg-primary text-white rounded-xl">
                      Notify me in {city.name} <ArrowRight size={13} className="ml-1" />
                    </Button>
                  </a>
                </div>

                {selectedCity !== city.name && (
                  <p className="text-xs text-gray-400 mt-1">Tap to see details</p>
                )}
              </motion.div>
            );})}
          </div>
        </div>
      </section>

      {/* ── Demand / Vote for your city ── */}
      <section id="demand" className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-start"
          >
            {/* Left: form */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">Community demand</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Don't see your city? Vote for it.
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                The more requests a city receives, the faster we expand there. Tell us where you need Urbont and we'll prioritize it.
              </p>

              {demandSubmitted ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
                >
                  <CheckCircle2 size={32} className="text-emerald-500" />
                  <p className="font-bold text-gray-900">Vote registered!</p>
                  <p className="text-sm text-gray-500">
                    We counted your request for <strong>{demandCity}</strong>. We'll notify you at <strong>{demandEmail}</strong> when we launch there.
                  </p>
                  <button onClick={() => { setDemandSubmitted(false); setDemandCity(""); setDemandEmail(""); }} className="text-xs text-primary font-semibold underline underline-offset-2 mt-1">
                    Vote for another city
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleDemandSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Your city <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        value={demandCity}
                        onChange={(e) => setDemandCity(e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                        required
                        className="pl-9 h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Your email <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        value={demandEmail}
                        onChange={(e) => setDemandEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="pl-9 h-12 rounded-xl border-gray-200 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                    Request Urbont in my city <ArrowRight size={16} className="ml-2" />
                  </Button>
                  <p className="text-xs text-gray-400 text-center">No spam — we only write when we launch.</p>
                </form>
              )}
            </div>

            {/* Right: leaderboard */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-extrabold text-gray-700 uppercase tracking-wide">Most requested cities</p>
                <span className="text-xs text-gray-400 font-semibold">{Object.values(demands).reduce((a, b) => a + b, 0).toLocaleString()} total votes</span>
              </div>
              <div className="space-y-3">
                {topDemandCities.map(([city, count], i) => {
                  const maxCount = topDemandCities[0][1];
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <motion.div
                      key={city}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <span className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-primary/10">
                        {i < 3 ? (
                          <Trophy size={14} className="text-primary" />
                        ) : (
                          <span className="text-xs font-bold text-primary">{i + 1}</span>
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-800 truncate">{city}</p>
                          <p className="text-xs font-bold text-gray-500 shrink-0 ml-2">{count.toLocaleString()} votes</p>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${i === 0 ? "bg-primary" : i === 1 ? "bg-primary/70" : i === 2 ? "bg-primary/50" : "bg-gray-300"}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, delay: i * 0.07, ease: "easeOut" }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-5 text-center">Updated in real time as votes come in</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Waitlist ── */}
      <section id="waitlist" className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,#fff_1px,transparent_1px),radial-gradient(circle_at_80%_50%,#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative container mx-auto px-4 md:px-6 max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-sm font-bold mb-5">
              Be the first in your city
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Don't miss the launch
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Enter your email and we'll notify you the moment Urbont goes live in your city — with an exclusive discount for early users.
            </p>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/15 border border-white/30 rounded-2xl p-6 flex flex-col items-center gap-3"
              >
                <CheckCircle2 size={36} className="text-white" />
                <p className="text-white font-bold text-lg">You're on the list!</p>
                <p className="text-white/70 text-sm">We'll email you at <strong>{email}</strong> when Urbont launches near you.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="h-13 pl-10 rounded-xl bg-white border-transparent text-gray-900 placeholder:text-gray-400 focus-visible:ring-white/50"
                  />
                </div>
                <Button type="submit" className="h-13 px-7 font-bold bg-white text-primary hover:bg-white/90 rounded-xl shrink-0">
                  Join waitlist
                </Button>
              </form>
            )}

            <p className="text-white/40 text-xs mt-4">No spam. We'll only write when we launch.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer strip ── */}
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
