"use client";

import React from "react";
  import { motion, useMotionValue, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
  import {
    Car, Clock, ShieldCheck, Menu, X, Star, Users, Globe, Award,
    Smartphone, MapPin, ArrowRight, Crown, Truck, Building2, Briefcase,
    ChevronDown, ChevronRight, CheckCircle2,
  } from "lucide-react";
  import { SiFacebook, SiInstagram, SiTiktok, SiYoutube, SiGoogleplay } from "react-icons/si";
  import { Button } from "@/components/ui/button";
  import { useLanguage, LANGUAGES } from "@/i18n";
  import CookieConsent from "@/components/cookie-consent";

  /* ─── Animated Counter ─────────────────────────────────────────────── */
  function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
    const ref = React.useRef<HTMLSpanElement>(null);
    const inView = React.useRef(false);
    const raw = useMotionValue(0);
    const spring = useSpring(raw, { stiffness: 55, damping: 20 });
    const display = useTransform(spring, (v) => {
      const floored = Math.floor(v);
      return `${floored}${suffix}`;
    });
    React.useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting && !inView.current) { inView.current = true; raw.set(to); } },
        { rootMargin: "-80px" }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, [to, raw]);
    return <motion.span ref={ref}>{display}</motion.span>;
  }

  /* ─── Welcome Modal ────────────────────────────────────────────────── */
  function WelcomeModal() {
    const { t } = useLanguage();
    const w = t.welcomeModal;
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
      const seen = localStorage.getItem("urbont_welcomed");
      if (!seen) { const timer = setTimeout(() => setOpen(true), 1400); return () => clearTimeout(timer); }
      return undefined;
    }, []);
    const dismiss = () => { localStorage.setItem("urbont_welcomed", "1"); setOpen(false); };
    if (!open) return null;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} />
        <motion.div
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 35, stiffness: 350 }}
          className="relative bg-white rounded-t-[32px] sm:rounded-[28px] w-full sm:max-w-sm overflow-hidden shadow-2xl"
        >
          <div className="relative h-48 overflow-hidden">
            <img src="/hero.png" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.5)" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute left-5 bottom-4 flex items-center gap-2.5">
              <img src="/urbont-logo.png" alt="" className="w-8 h-8 rounded-xl object-contain" />
              <span className="text-white font-bold text-base tracking-tight">Urbont</span>
            </div>
            <button onClick={dismiss} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
              <X size={15} />
            </button>
          </div>
          <div className="px-6 pt-5 pb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">{w.title}</h2>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">{w.subtitle}</p>
            <button onClick={() => { window.location.href = '/login'; }}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm transition-colors mb-2.5">
              {w.primaryCta}
            </button>
            <button onClick={() => { window.location.href = '/login'; }}
              className="w-full h-12 border border-gray-200 text-gray-700 hover:border-gray-300 font-semibold rounded-xl text-sm transition-colors">
              {w.loginCta}
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  /* ─── Google Play Button ───────────────────────────────────────────── */
  function PlayStoreButton({ label, sublabel, dark = true, className = "" }: { label: string; sublabel: string; dark?: boolean; className?: string }) {
    return (
      <div className="relative inline-flex">
        <button className={`h-12 px-5 flex items-center gap-3 rounded-xl font-semibold transition-colors ${dark ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"} ${className}`}>
          <SiGoogleplay size={20} className="shrink-0" />
          <div className="text-left">
            <div className={`text-[10px] leading-none font-normal ${dark ? "text-gray-400" : "text-gray-500"}`}>{sublabel}</div>
            <div className="text-sm font-semibold leading-tight mt-0.5">Google Play</div>
          </div>
        </button>
        <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
          {label}
        </span>
      </div>
    );
  }

  /* ─── Constants ────────────────────────────────────────────────────── */
  const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay: i * 0.08 } }),
  };

  const statsMeta = [
    { icon: Globe, num: 50, suffix: "+" },
    { icon: Users, num: 2, suffix: "M+" },
    { icon: Car, num: 150, suffix: "k+" },
    { icon: Award, num: 4.8, suffix: "" },
  ];

  const serviceCategoryMeta = [
    { icon: Car,       name: "Urbont Go",       link: "#",         accent: "#3b82f6" },
    { icon: Crown,     name: "Urbont Premium",  link: "#",         accent: "#f59e0b" },
    { icon: Users,     name: "Urbont Pool",     link: "#",         accent: "#10b981" },
    { icon: Truck,     name: "Urbont SUV",      link: "#",         accent: "#8b5cf6" },
    { icon: Building2, name: "Urbont Valet",    link: "/valet",    accent: "#f43f5e" },
    { icon: Briefcase, name: "Urbont Business", link: "#",         accent: "#64748b" },
  ];

  const stepsMeta = [Smartphone, MapPin, Star];

  /* ─── Home ─────────────────────────────────────────────────────────── */
  export default function Home() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [langDropOpen, setLangDropOpen] = React.useState(false);
    const { t, lang, setLang } = useLanguage();

    React.useEffect(() => {
      const onScroll = () => setIsScrolled(window.scrollY > 16);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const { scrollY } = useScroll();
    const imgY = useTransform(scrollY, [0, 600], [0, -40]);

    return (
      <div className="min-h-screen bg-white overflow-x-hidden text-gray-900">

        {/* ──────────── NAV ──────────── */}
        <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
            : "bg-transparent"
        }`}>
          <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
            <a href="#" className="flex items-center gap-2.5 shrink-0">
              <img src="/urbont-logo.png" alt="Urbont" className="h-8 w-8 rounded-lg" />
              <span className="text-lg font-bold tracking-tight">Urbont</span>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: t.nav.links[0].name, href: "#servicios" },
                { label: t.nav.links[2].name, href: "/conductor" },
                { label: t.nav.links[3].name, href: "/valet" },
                { label: t.nav.citiesLink,    href: "/cities" },
              ].map(({ label, href }) => (
                <a key={label} href={href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all">
                  {label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              {/* Language picker */}
              <div className="relative">
                <button
                  onClick={() => setLangDropOpen(v => !v)}
                  onBlur={() => setTimeout(() => setLangDropOpen(false), 160)}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
                >
                  <Globe size={14} />
                  <span>{LANGUAGES.find(l => l.code === lang)?.flag}</span>
                  <ChevronDown size={11} className={`transition-transform ${langDropOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {langDropOpen && (
                    <motion.div initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[150px] py-1">
                      {LANGUAGES.map((l) => (
                        <button key={l.code} onClick={() => { setLang(l.code); setLangDropOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-left transition-colors ${lang === l.code ? "text-gray-900 bg-gray-50" : "text-gray-600 hover:bg-gray-50"}`}>
                          <span>{l.flag}</span><span>{l.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <a href="/login" className="h-9 px-4 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all flex items-center">{t.nav.login}</a>
              <a href="/login" className="h-9 px-4 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors flex items-center">{t.nav.signup}</a>
            </div>

            <button className="md:hidden p-2 -mr-1 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
        </header>

        {/* ──────────── MOBILE MENU ──────────── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                onClick={() => setMobileMenuOpen(false)} />
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 32, stiffness: 320 }}
                className="fixed right-0 top-0 bottom-0 w-72 bg-white z-[70] flex flex-col shadow-2xl"
              >
                <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
                  <span className="font-bold tracking-tight">Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-1 rounded-lg hover:bg-gray-100 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <nav className="flex-1 px-4 py-5 flex flex-col gap-1">
                  {[
                    { label: t.nav.links[0].name, href: "#servicios" },
                    { label: t.nav.links[2].name, href: "/conductor" },
                    { label: t.nav.links[3].name, href: "/valet" },
                    { label: t.nav.citiesLink, href: "/cities" },
                  ].map(({ label, href }) => (
                    <a key={label} href={href} onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-3.5 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all group">
                      {label}
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </a>
                  ))}
                </nav>
                <div className="px-5 pb-8 flex flex-col gap-2.5 border-t border-gray-100 pt-5">
                  {/* Language row */}
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {LANGUAGES.map((l) => (
                      <button key={l.code} onClick={() => { setLang(l.code); setMobileMenuOpen(false); }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${lang === l.code ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                        {l.flag} {l.label}
                      </button>
                    ))}
                  </div>
                  <a href="/login" onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-11 flex items-center justify-center border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    {t.nav.login}
                  </a>
                  <a href="/login" onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-11 flex items-center justify-center bg-gray-900 hover:bg-gray-800 rounded-xl text-sm font-semibold text-white transition-colors">
                    {t.nav.signup}
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ──────────── HERO ──────────── */}
        <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-[#f8f8f6]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.4)_0%,rgba(248,248,246,0)_40%)]" />

          <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 w-full py-20 md:py-0">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Copy */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}
                  className="inline-flex items-center gap-2 mb-8 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-semibold text-gray-600 tracking-wide"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {t.hero.badge}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
                  className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
                >
                  {t.hero.title1}<br />
                  <span className="text-primary">{t.hero.title2}</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                  className="text-base md:text-lg text-gray-500 leading-relaxed mb-8 max-w-md"
                >
                  {t.hero.desc}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
                  className="flex flex-wrap gap-3 mb-10"
                >
                  <PlayStoreButton label="Soon" sublabel={t.download.playStore} />
                  <a href="/conductor"
                    className="h-12 px-5 flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all">
                    {t.hero.becomeDriver}
                    <ArrowRight size={15} />
                  </a>
                </motion.div>

                {/* Trust row — horizontal, never overlapping */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
                  className="flex flex-wrap items-center gap-5 pt-8 border-t border-gray-200"
                >
                  {[
                    { icon: ShieldCheck, label: t.badges.safeRide,     sub: t.badges.verifiedDriver },
                    { icon: Clock,       label: t.badges.avgEta,        sub: "4 min avg" },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Icon size={15} className="text-gray-700" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900 leading-none">{label}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-xs font-semibold text-gray-500 ml-1">4.9</span>
                  </div>
                </motion.div>
              </div>

              {/* Image — desktop only overlapping pills go inside image frame, mobile: full-width below */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/60">
                  <motion.img
                    style={{ y: imgY }}
                    src="/hero.png"
                    alt="Urbont premium ride"
                    className="w-full h-72 sm:h-96 lg:h-[560px] object-cover"
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                  {/* Status pill — inside the image frame, bottom-left, no overflow */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg max-w-[200px]">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-none">{t.badges.safeRide}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{t.badges.verifiedDriver}</p>
                      </div>
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-lg">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Clock size={15} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 leading-none">{t.badges.avgEta}</p>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">4 min</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ──────────── STATS ──────────── */}
        <section className="bg-gray-950 py-14">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {statsMeta.map((s, i) => (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
                  className={`text-center py-8 ${i < 3 ? "md:border-r border-white/10" : ""} ${i < 2 ? "border-b border-white/10 md:border-b-0" : ""}`}>
                  <p className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tight mb-2">
                    <AnimatedCounter to={s.num} suffix={s.suffix} />
                  </p>
                  <p className="text-[11px] font-semibold text-white/35 uppercase tracking-widest">{t.stats.labels[i]}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────── SERVICES ──────────── */}
        <section id="servicios" className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
              className="mb-14 max-w-lg">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">{t.services.sectionLabel}</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{t.services.title}</h2>
              <p className="text-gray-500 leading-relaxed">{t.services.desc}</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {serviceCategoryMeta.map((cat, i) => (
                <motion.a key={i} href={cat.link} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
                  className="group block p-6 rounded-2xl border border-gray-100 hover:border-gray-900 bg-white hover:bg-gray-900 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.accent}15` }}>
                      <cat.icon size={18} style={{ color: cat.accent }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 group-hover:text-gray-600 uppercase tracking-widest transition-colors">
                      {t.services.categories[i].tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-white mb-2 transition-colors">{cat.name}</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors">{t.services.categories[i].desc}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-gray-300 group-hover:text-primary transition-colors">
                    {t.services.learnMore} <ChevronRight size={13} />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────── HOW IT WORKS ──────────── */}
        <section className="py-20 md:py-28 bg-[#f8f8f6]">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
              className="mb-16 max-w-lg">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">{t.howItWorks.sectionLabel}</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{t.howItWorks.title}</h2>
              <p className="text-gray-500 leading-relaxed">{t.howItWorks.desc}</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-px bg-gray-200 rounded-3xl overflow-hidden">
              {stepsMeta.map((StepIcon, i) => (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
                  className="bg-white p-8 md:p-10 flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-black text-gray-100 leading-none select-none">{String(i + 1).padStart(2, "0")}</span>
                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                      <StepIcon size={18} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{t.howItWorks.steps[i].title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed flex-1">{t.howItWorks.steps[i].desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────── SAFETY ──────────── */}
        <section className="py-20 md:py-28 bg-gray-950 overflow-hidden">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">{t.safety.title}</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-5 leading-tight">{t.safety.title}</h2>
                <p className="text-gray-400 leading-relaxed mb-8">{t.safety.desc}</p>
                <ul className="space-y-3">
                  {t.safety.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span className="text-sm text-gray-300">{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE }} viewport={{ once: true }}
                className="bg-gray-900 rounded-3xl p-6 md:p-8 border border-white/10">
                {/* Simulated app screen */}
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Car size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{t.safety.driverCard?.onTheWay ?? "On the way"}</p>
                      <p className="text-gray-500 text-xs">Carlos R. · ⭐ 4.97</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-black text-2xl">{t.safety.driverCard?.arriveIn ?? "Arrives in"}</p>
                    <p className="text-xs text-gray-500">3 {t.safety.driverCard?.min ?? "min"}</p>
                  </div>
                </div>
                {/* Map placeholder */}
                <div className="rounded-2xl bg-gray-800 h-36 mb-5 overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
                    backgroundSize: "24px 24px"
                  }} />
                  <div className="relative z-10 w-8 h-8 rounded-full bg-primary shadow-lg shadow-primary/50 flex items-center justify-center">
                    <MapPin size={16} className="text-white" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 h-10 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-colors">
                    {t.safety.driverCard?.contact ?? "Contact"}
                  </button>
                  <button className="flex-1 h-10 rounded-xl bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-colors">
                    {t.safety.driverCard?.emergency ?? "Emergency"}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ──────────── DRIVER CTA ──────────── */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden bg-gray-900 p-8 md:p-14">
              {/* Subtle texture */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "32px 32px"
              }} />
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="max-w-lg">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">{t.drivers.sectionLabel}</p>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
                    {t.drivers.title1} <span className="text-white/60">{t.drivers.title2}</span>
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{t.drivers.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {t.drivers.perks.slice(0, 3).map((perk) => (
                      <span key={perk} className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-medium border border-white/10">
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
                <a href="/conductor" className="shrink-0">
                  <button className="h-12 px-6 bg-white text-gray-900 font-semibold rounded-xl text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap">
                    {t.drivers.cta} <ArrowRight size={16} />
                  </button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ──────────── DOWNLOAD ──────────── */}
        <section className="py-20 md:py-24 bg-[#f8f8f6]">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">{t.download.label}</p>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">{t.download.title}</h2>
                <p className="text-gray-500 leading-relaxed mb-8">{t.download.desc}</p>
                <PlayStoreButton label="Soon" sublabel={t.download.playStore} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} viewport={{ once: true }}
                className="flex flex-col items-center md:items-start gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://urbont.app&bgcolor=ffffff&color=111111&margin=4"
                    alt="Scan to download Urbont"
                    className="w-36 h-36 rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Scan to download</p>
                  <p className="text-sm text-gray-500">Available on Android · iOS coming soon</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ──────────── FOOTER ──────────── */}
        <footer className="bg-gray-950 text-white py-14 md:py-16">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
              <div className="sm:col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <img src="/urbont-logo.png" alt="Urbont" className="h-7 w-7 rounded-lg" />
                  <span className="font-bold text-base tracking-tight">Urbont</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">Premium Chauffeur Service<br />Miami, FL</p>
                <div className="flex items-center gap-3.5">
                  {[
                    { Icon: SiFacebook, href: "https://facebook.com" },
                    { Icon: SiInstagram, href: "https://instagram.com" },
                    { Icon: SiTiktok, href: "https://tiktok.com" },
                    { Icon: SiYoutube, href: "https://youtube.com" },
                  ].map(({ Icon, href }) => (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </div>

              {[
                {
                  title: "Company",
                  links: [
                    { name: t.nav.links[0].name, href: "#servicios" },
                    { name: t.nav.citiesLink, href: "/cities" },
                    { name: "Privacy Policy", href: "/privacy" },
                    { name: "Terms", href: "/terms" },
                  ],
                },
                {
                  title: "Join Us",
                  links: [
                    { name: t.nav.links[2].name, href: "/conductor" },
                    { name: t.nav.links[3].name, href: "/valet" },
                    { name: t.nav.login, href: "/login" },
                    { name: t.nav.signup, href: "/login" },
                  ],
                },
                {
                  title: "Download",
                  links: [],
                  custom: (
                    <div className="relative inline-flex mt-1">
                      <a href="#" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                        <SiGoogleplay size={16} className="text-gray-400" />
                        <div>
                          <p className="text-[9px] text-gray-600 leading-none">Get it on</p>
                          <p className="text-xs font-semibold text-white leading-tight mt-0.5">Google Play</p>
                        </div>
                      </a>
                      <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">Soon</span>
                    </div>
                  ),
                },
              ].map(({ title, links, custom }) => (
                <div key={title}>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">{title}</p>
                  {links.map(({ name, href }) => (
                    <a key={name} href={href} className="block text-sm text-gray-500 hover:text-white transition-colors mb-2.5">{name}</a>
                  ))}
                  {custom}
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-700">© 2026 Urbont Technologies Inc. All rights reserved.</p>
              <div className="flex items-center gap-5">
                <a href="/privacy" className="text-xs text-gray-700 hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-xs text-gray-700 hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>

        <WelcomeModal />
        <CookieConsent />
      </div>
    );
  }
  