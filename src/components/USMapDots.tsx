"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   Coordinate helpers
   ViewBox: 960 × 600
   Lon range: -125 → -66.9  (58.1°)
   Lat range:  24.4 → 49.4  (25.0°)
──────────────────────────────────────────── */
function toXY(lon: number, lat: number): [number, number] {
  const x = ((lon + 125) / 58.1) * 960;
  const y = ((49.4 - lat) / 25.0) * 600;
  return [Math.round(x), Math.round(y)];
}

/* ─── City data ─── */
export type CityDot = {
  name: string;
  state: string;
  lon: number;
  lat: number;
  active: boolean;
  eta?: string;
};

export const CITY_DOTS: CityDot[] = [
  { name: "Miami",           state: "FL", lon: -80.19, lat: 25.77, active: true  },
  { name: "Fort Lauderdale", state: "FL", lon: -80.14, lat: 26.12, active: false, eta: "Q3 2025" },
  { name: "Orlando",         state: "FL", lon: -81.38, lat: 28.54, active: false, eta: "Q3 2025" },
  { name: "Tampa",           state: "FL", lon: -82.46, lat: 27.95, active: false, eta: "Q4 2025" },
  { name: "Jacksonville",    state: "FL", lon: -81.66, lat: 30.33, active: false, eta: "Q4 2025" },
  { name: "Atlanta",         state: "GA", lon: -84.39, lat: 33.75, active: false, eta: "Q1 2026" },
  { name: "Houston",         state: "TX", lon: -95.37, lat: 29.76, active: false, eta: "Q1 2026" },
  { name: "Dallas",          state: "TX", lon: -96.80, lat: 32.78, active: false, eta: "Q2 2026" },
  { name: "Austin",          state: "TX", lon: -97.74, lat: 30.27, active: false, eta: "Q2 2026" },
  { name: "Las Vegas",       state: "NV", lon: -115.14, lat: 36.17, active: false, eta: "Q3 2026" },
  { name: "Phoenix",         state: "AZ", lon: -112.07, lat: 33.45, active: false, eta: "Q3 2026" },
  { name: "Los Angeles",     state: "CA", lon: -118.24, lat: 34.05, active: false, eta: "TBD"    },
  { name: "Chicago",         state: "IL", lon: -87.63, lat: 41.88, active: false, eta: "TBD"    },
  { name: "New York",        state: "NY", lon: -74.01, lat: 40.71, active: false, eta: "TBD"    },
];

/* ─── Simplified continental US outline (clockwise, 960×600 viewBox) ─── */
const US_PATH =
  "M70,90 L330,68 L473,53 L762,83 L842,58 L872,78 L866,108 " +
  "L842,168 L822,218 L802,278 L792,328 L782,368 " +
  // FL peninsula: east coast down, tip, west coast up
  "L792,398 L802,443 L797,478 L784,508 L770,528 " +
  "L754,513 L740,498 L720,476 L707,456 L696,446 " +
  // Gulf coast W
  "L680,436 L640,421 L600,431 L565,436 L530,426 L507,426 " +
  "L490,441 L470,456 L442,471 L420,476 L400,486 L374,496 " +
  "L344,491 L320,486 L280,486 L240,486 L200,486 " +
  // CA south
  "L174,476 L158,460 L145,426 " +
  // Pacific coast N
  "L125,376 L112,316 L108,276 L96,236 L84,196 L80,171 " +
  "L84,151 L90,111 L96,91 Z";

/* ─── State abbreviation labels (approximate centers) ─── */
const STATE_LABELS = [
  { code: "FL", lon: -81.5,  lat: 27.8  },
  { code: "GA", lon: -83.4,  lat: 32.5  },
  { code: "TX", lon: -99.0,  lat: 31.5  },
  { code: "NV", lon: -116.5, lat: 38.5  },
  { code: "AZ", lon: -111.5, lat: 34.3  },
  { code: "CA", lon: -119.5, lat: 36.8  },
  { code: "IL", lon: -89.2,  lat: 40.0  },
  { code: "NY", lon: -75.5,  lat: 43.0  },
];

/* ─── Component ─── */
export default function USMapDots({
  onCityHover,
  hoveredCity,
}: {
  onCityHover: (name: string | null) => void;
  hoveredCity: string | null;
}) {
  return (
    <svg
      viewBox="0 0 960 600"
      className="w-full h-full"
      style={{ overflow: "visible" }}
      aria-label="Map of US cities covered by Urbont"
    >
      <defs>
        <radialGradient id="mapBg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgb(239,246,255)" />
          <stop offset="100%" stopColor="rgb(219,234,254)" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#94a3b8" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Ocean background */}
      <rect width="960" height="600" fill="url(#mapBg)" rx="16" />

      {/* US land silhouette */}
      <path
        d={US_PATH}
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeLinejoin="round"
        filter="url(#softShadow)"
      />

      {/* State abbreviation labels */}
      {STATE_LABELS.map(({ code, lon, lat }) => {
        const [x, y] = toXY(lon, lat);
        return (
          <text
            key={code}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fontWeight="600"
            fill="#94a3b8"
            fontFamily="system-ui, sans-serif"
            style={{ userSelect: "none", pointerEvents: "none" }}
          >
            {code}
          </text>
        );
      })}

      {/* ── City dots ── */}
      {CITY_DOTS.map((city) => {
        const [x, y] = toXY(city.lon, city.lat);
        const isHovered = hoveredCity === city.name;

        return (
          <g
            key={city.name}
            onMouseEnter={() => onCityHover(city.name)}
            onMouseLeave={() => onCityHover(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Pulse ring (active city only) */}
            {city.active && (
              <>
                <motion.circle
                  cx={x} cy={y} r={18}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                  initial={{ opacity: 0.6, scale: 0.8 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.circle
                  cx={x} cy={y} r={14}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  initial={{ opacity: 0.4, scale: 0.9 }}
                  animate={{ opacity: 0, scale: 1.6 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                />
              </>
            )}

            {/* Hover ring */}
            {isHovered && (
              <motion.circle
                cx={x} cy={y} r={14}
                fill="none"
                stroke={city.active ? "hsl(var(--primary))" : "#f59e0b"}
                strokeWidth="2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}

            {/* Main dot */}
            <motion.circle
              cx={x} cy={y}
              r={city.active ? 8 : 6}
              fill={city.active ? "hsl(var(--primary))" : isHovered ? "#f59e0b" : "#94a3b8"}
              stroke="white"
              strokeWidth={city.active ? 2.5 : 2}
              filter={city.active ? "url(#glow)" : undefined}
              animate={{
                r: isHovered ? (city.active ? 10 : 8) : city.active ? 8 : 6,
              }}
              transition={{ duration: 0.15 }}
            />

            {/* Active dot center */}
            {city.active && (
              <circle cx={x} cy={y} r={3} fill="white" style={{ pointerEvents: "none" }} />
            )}
          </g>
        );
      })}

      {/* ── Tooltips ── */}
      <AnimatePresence>
        {hoveredCity && (() => {
          const city = CITY_DOTS.find((c) => c.name === hoveredCity);
          if (!city) return null;
          const [x, y] = toXY(city.lon, city.lat);

          // Flip left if too close to right edge
          const flipX = x > 780;
          const flipY = y > 450;
          const tipX = flipX ? x - 130 : x + 16;
          const tipY = flipY ? y - 70 : y - 10;

          return (
            <motion.g
              key={hoveredCity}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ pointerEvents: "none" }}
            >
              <rect
                x={tipX} y={tipY}
                width="120" height={city.active ? 52 : 48}
                rx="8"
                fill="white"
                stroke="#e2e8f0"
                strokeWidth="1"
                filter="url(#softShadow)"
              />
              {/* Active badge dot */}
              <circle
                cx={tipX + 12} cy={tipY + 14}
                r="4"
                fill={city.active ? "#10b981" : "#f59e0b"}
              />
              <text x={tipX + 22} y={tipY + 18} fontSize="11" fontWeight="700" fill="#111827" fontFamily="system-ui,sans-serif">
                {city.name}, {city.state}
              </text>
              {city.active ? (
                <>
                  <text x={tipX + 10} y={tipY + 34} fontSize="10" fontWeight="600" fill="#10b981" fontFamily="system-ui,sans-serif">
                    ● Active now
                  </text>
                  <text x={tipX + 10} y={tipY + 46} fontSize="9.5" fill="#6b7280" fontFamily="system-ui,sans-serif">
                    Full coverage · 24/7
                  </text>
                </>
              ) : (
                <text x={tipX + 10} y={tipY + 34} fontSize="10" fontWeight="600" fill="#f59e0b" fontFamily="system-ui,sans-serif">
                  Coming {city.eta}
                </text>
              )}
            </motion.g>
          );
        })()}
      </AnimatePresence>
    </svg>
  );
}
