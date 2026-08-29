"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "urbont-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="fixed bottom-5 left-4 right-4 md:left-auto md:right-6 md:max-w-[360px] z-[999]"
        >
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-gray-200/60 p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Cookie size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm mb-1">We use cookies</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  We use cookies to improve your experience, analyze traffic and personalize content. See our{" "}
                  <a href="/privacy" className="text-primary font-semibold hover:underline">
                    Privacy Policy
                  </a>.
                </p>
              </div>
              <button
                onClick={decline}
                className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors mt-0.5"
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={accept}
                className="flex-1 h-9 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90"
              >
                Accept all
              </Button>
              <Button
                onClick={decline}
                variant="outline"
                className="flex-1 h-9 text-sm font-semibold rounded-xl border-gray-200 text-gray-600 hover:border-gray-300"
              >
                Decline
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
