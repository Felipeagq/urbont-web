"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Users, Star, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/i18n";

/* ── Projection helpers ──────────────────────────────────────── */
const W_LON = -124.7, E_LON = -66.9, N_LAT = 49.4, S_LAT = 24.5;
const SVG_W = 800, SVG_H = 460;

function toSVG(lon: number, lat: number): [number, number] {
  const x = ((lon - W_LON) / (E_LON - W_LON)) * SVG_W;
  const y = ((N_LAT - lat) / (N_LAT - S_LAT)) * SVG_H;
  return [Math.round(x), Math.round(y)];
}

/* ── City data ───────────────────────────────────────────────── */
interface City {
  name: string;
  state: string;
  lon: number;
  lat: number;
  active: boolean;
  stats?: { drivers: string; passengers: string; rating: string; avgEta: string };
}

const CITIES: City[] = [
  { name: "Miami",           state: "Florida",    lon: -80.19, lat: 25.77, active: true,  stats: { drivers: "850+", passengers: "12K+", rating: "4.9", avgEta: "3 min" } },
  { name: "Orlando",         state: "Florida",    lon: -81.38, lat: 28.54, active: false },
  { name: "Fort Lauderdale", state: "Florida",    lon: -80.14, lat: 26.12, active: false },
  { name: "Tampa",           state: "Florida",    lon: -82.46, lat: 27.95, active: false },
  { name: "Atlanta",         state: "Georgia",    lon: -84.39, lat: 33.75, active: false },
  { name: "Houston",         state: "Texas",      lon: -95.37, lat: 29.76, active: false },
  { name: "Dallas",          state: "Texas",      lon: -96.80, lat: 32.78, active: false },
  { name: "Chicago",         state: "Illinois",   lon: -87.63, lat: 41.88, active: false },
  { name: "New York",        state: "New York",   lon: -74.00, lat: 40.71, active: false },
  { name: "Los Angeles",     state: "California", lon: -118.24, lat: 34.05, active: false },
];

/* ── Simplified continental US outline path ──────────────────── */
// Rough polygon — good enough for a stylized UI map
const US_PATH = `
  M 35,65
  L 35,22 L 108,18 L 200,20 L 320,15 L 450,14 L 580,20 L 720,28 L 770,55
  L 778,90 L 760,135 L 748,168 L 735,198 L 718,228 L 700,258
  L 678,288 L 660,308 L 644,345 L 633,380 L 642,422 L 622,455
  L 600,445 L 578,428 L 566,400 L 548,386 L 510,383 L 468,393
  L 432,400 L 398,408 L 362,420 L 320,415 L 276,405
  L 238,398 L 195,378 L 168,345 L 152,300
  L 157,258 L 172,210 L 183,180 L 162,178 L 118,198
  L 75,198 L 42,185 L 22,145 L 20,100
  Z
`;

/* ── Component ───────────────────────────────────────────────── */
export default function CityMap() {
  const [selected, setSelected] = useState<City>(CITIES[0]);
  const { t } = useLanguage();
  const tc = t.cities;

  return (
    <div className="grid lg:grid-cols-5 gap-6 items-start">
      {/* ── SVG Map ── */}
      <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full"
          style={{ display: "block" }}
        >
          {/* Ocean background */}
          <rect width={SVG_W} height={SVG_H} fill="#e8f4fd" rx="0" />

          {/* Subtle grid lines */}
          {[100, 200, 300, 400].map(y => (
            <line key={`h${y}`} x1={0} y1={y} x2={SVG_W} y2={y} stroke="#cde8f5" strokeWidth={0.7} />
          ))}
          {[100, 200, 300, 400, 500, 600, 700].map(x => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={SVG_H} stroke="#cde8f5" strokeWidth={0.7} />
          ))}

          {/* US landmass */}
          <path d={US_PATH} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1.5} strokeLinejoin="round" />

          {/* City markers */}
          {CITIES.map((city) => {
            const [cx, cy] = toSVG(city.lon, city.lat);
            const isSelected = selected.name === city.name;
            const isActive = city.active;

            return (
              <g
                key={city.name}
                onClick={() => setSelected(city)}
                style={{ cursor: "pointer" }}
                role="button"
                aria-label={city.name}
              >
                {isActive ? (
                  /* Active city — pulsing primary rings */
                  <>
                    <motion.circle
                      cx={cx} cy={cy}
                      fill="hsl(var(--primary))" fillOpacity={0.08}
                      initial={{ r: 18 }}
                      animate={{ r: [18, 26, 18], opacity: [0.12, 0.04, 0.12] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.circle
                      cx={cx} cy={cy}
                      fill="hsl(var(--primary))" fillOpacity={0.18}
                      initial={{ r: 10 }}
                      animate={{ r: [10, 16, 10], opacity: [0.2, 0.08, 0.2] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                    <circle cx={cx} cy={cy} r={8} fill="hsl(var(--primary))" />
                    <circle cx={cx} cy={cy} r={3} fill="white" />
                    {/* City label */}
                    <text x={cx + 12} y={cy - 9} fontSize={11} fontWeight={700} fill="hsl(var(--primary))" fontFamily="sans-serif">
                      {city.name}
                    </text>
                  </>
                ) : (
                  /* Coming-soon city */
                  <>
                    <circle cx={cx} cy={cy} r={isSelected ? 9 : 6}
                      fill={isSelected ? "hsl(var(--primary))" : "#94a3b8"}
                      fillOpacity={isSelected ? 0.25 : 0.2}
                    />
                    <circle cx={cx} cy={cy} r={isSelected ? 5 : 4}
                      fill={isSelected ? "hsl(var(--primary))" : "#94a3b8"}
                    />
                    {isSelected && (
                      <text x={cx + 8} y={cy - 7} fontSize={10} fontWeight={600} fill="#64748b" fontFamily="sans-serif">
                        {city.name}
                      </text>
                    )}
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-5 text-xs text-gray-500 bg-gray-50/50">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary inline-block" />
            {tc.active}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />
            {tc.comingSoon}
          </span>
        </div>
      </div>

      {/* ── Info Panel ── */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6"
          >
            {selected.active ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    {tc.operating}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-0.5">{selected.name}</h3>
                <p className="text-sm text-gray-500 mb-5">{selected.state}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <Car size={16} className="text-primary mb-1" />
                    <p className="text-lg font-black text-gray-900">{selected.stats!.drivers}</p>
                    <p className="text-xs text-gray-500 font-medium">{tc.drivers}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <Users size={16} className="text-primary mb-1" />
                    <p className="text-lg font-black text-gray-900">{selected.stats!.passengers}</p>
                    <p className="text-xs text-gray-500 font-medium">{tc.passengers}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <Star size={16} className="text-amber-500 mb-1" />
                    <p className="text-lg font-black text-gray-900">{selected.stats!.rating}</p>
                    <p className="text-xs text-gray-500 font-medium">{tc.rating}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <Clock size={16} className="text-primary mb-1" />
                    <p className="text-lg font-black text-gray-900">{selected.stats!.avgEta}</p>
                    <p className="text-xs text-gray-500 font-medium">{tc.etaAvg}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                    {tc.comingSoonBadge}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-0.5">{selected.name}</h3>
                <p className="text-sm text-gray-500 mb-5">{selected.state}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tc.comingText(selected.name)}
                </p>
                <button className="mt-4 w-full h-10 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors">
                  {tc.notifyLaunch}
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* City list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            {tc.allCities}
          </p>
          <div className="space-y-1">
            {CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => setSelected(city)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors text-sm font-medium ${
                  selected.name === city.name
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <MapPin size={13} className={city.active ? "text-primary" : "text-gray-400"} />
                <span>{city.name}</span>
                {city.active && (
                  <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    {tc.active}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
