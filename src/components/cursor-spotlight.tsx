"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CursorSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!spotRef.current) return;
      if (!active) setActive(true);
      spotRef.current.style.setProperty("--x", `${e.clientX}px`);
      spotRef.current.style.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [active]);

  return (
    <div
      ref={spotRef}
      className={`pointer-events-none fixed inset-0 z-[200] transition-opacity duration-700 hidden lg:block ${
        active ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background:
          "radial-gradient(700px circle at var(--x, -9999px) var(--y, -9999px), rgba(46,109,154,0.065), transparent 70%)",
      }}
    />
  );
}
