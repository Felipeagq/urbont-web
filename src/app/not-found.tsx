"use client";

import React from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/urbont-logo.png" alt="Urbont" className="h-8 w-8 object-contain rounded-lg shadow-sm" />
            <span className="text-lg font-extrabold tracking-tight text-gray-900">Urbont</span>
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-md">
          <div className="relative inline-block mb-8">
            <div className="text-[120px] md:text-[160px] font-extrabold text-gray-100 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10">
                <MapPin size={36} className="text-primary" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Destination not found
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Looks like this route doesn't exist yet. Let us take you somewhere better.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/">
              <Button className="h-12 px-8 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 gap-2">
                <ArrowLeft size={16} />
                Back to home
              </Button>
            </a>
            <a href="/#servicios">
              <Button variant="outline" className="h-12 px-8 font-semibold rounded-xl border-gray-200 text-gray-700 hover:border-primary hover:text-primary">
                Explore services
              </Button>
            </a>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Urbont Technologies Inc.
      </footer>
    </div>
  );
}
