"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone, Mail } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const CONTACT_EMAIL = "contact@urbont.com";
const CONTACT_PHONE = "+1 561 663 2691";

const FAQ: Array<{ patterns: RegExp[]; answer: (lang: "es" | "en") => string }> = [
  {
    patterns: [/^(hola|hi|hello|hey|buenas|saludos|good\s*(morning|afternoon|evening))$/i],
    answer: (lang) => lang === "es"
      ? "¡Hola! 👋 Soy el asistente de soporte de Urbont. Estoy aquí para ayudarte con cualquier pregunta sobre nuestro servicio. ¿En qué puedo ayudarte hoy?"
      : "Hi! 👋 I'm the Urbont support assistant. I'm here to help with any questions about our service. What can I help you with today?",
  },
  {
    patterns: [/precio|costo|tarifa|cuánto|cuanto|cuesta|rate|price|cost|fare|cheap|expensive|cobr/i],
    answer: (lang) => lang === "es"
      ? "💰 Las tarifas de Urbont son hasta un 30% más bajas que otras apps. El precio depende de la distancia, el tiempo del viaje y el tipo de servicio (Go, Premium, Pool, SUV, Valet, Business). Puedes ver una estimación antes de confirmar tu viaje en la app."
      : "💰 Urbont's fares are up to 30% lower than other apps. The price depends on distance, ride time, and service type (Go, Premium, Pool, SUV, Valet, Business). You can see an estimate before confirming your ride in the app.",
  },
  {
    patterns: [/segur|safe|security|danger|peligro|protect|verif/i],
    answer: (lang) => lang === "es"
      ? "🛡️ Tu seguridad es nuestra prioridad. Todos los conductores pasan verificación exhaustiva. Puedes compartir tu viaje en tiempo real con quien quieras, tenemos soporte de emergencia 24/7 y todos los viajes están asegurados."
      : "🛡️ Your safety is our priority. All drivers go through thorough background checks. You can share your real-time location with anyone, we have 24/7 emergency support, and all rides are insured.",
  },
  {
    patterns: [/conductor|driver|manejar|ganar|earn|income|ingreso|registr|unirme|join|solicitar/i],
    answer: (lang) => lang === "es"
      ? "🚗 ¡Únete a Urbont como conductor! Ofrecemos la comisión más baja del mercado (solo 15%). Trabaja cuando quieras, gana más y recibe pagos rápidos. Ve a /conductor para registrarte."
      : "🚗 Join Urbont as a driver! We offer the lowest commission in the market (just 15%). Work when you want, earn more, and get paid quickly. Go to /conductor to sign up.",
  },
  {
    patterns: [/valet|hotel|estacionamiento|parking|event|evento/i],
    answer: (lang) => lang === "es"
      ? `🏨 Urbont Valet es nuestro servicio premium para hoteles, restaurantes y eventos. Personal capacitado, puntual y con actitud de primer nivel. Para precios corporativos escríbenos a ${CONTACT_EMAIL}.`
      : `🏨 Urbont Valet is our premium service for hotels, restaurants, and events. Trained, punctual staff with top-tier service. For corporate pricing, write to us at ${CONTACT_EMAIL}.`,
  },
  {
    patterns: [/empresa|business|corporat|compañia|company|factura|invoice|plan/i],
    answer: (lang) => lang === "es"
      ? `💼 Urbont Business está diseñado para empresas. Incluye panel centralizado, facturación automática, reportes de gastos y flota dedicada. Escríbenos a ${CONTACT_EMAIL} para más información.`
      : `💼 Urbont Business is designed for companies. It includes a centralized dashboard, automatic billing, expense reports, and a dedicated fleet. Write to us at ${CONTACT_EMAIL} for more info.`,
  },
  {
    patterns: [/ciudad|city|disponible|donde|dónde|where|miami|coverage|cobertura|operat/i],
    answer: (lang) => lang === "es"
      ? "📍 Actualmente operamos en Miami y el sur de Florida. Estamos expandiéndonos activamente. Consulta la sección 'Ciudades' en el sitio para ver la cobertura completa."
      : "📍 We currently operate in Miami and South Florida. We're actively expanding. Check the 'Cities' section on the site for full coverage details.",
  },
  {
    patterns: [/pago|payment|tarjeta|card|efectivo|cash|pay|apple\s*pay|google\s*pay/i],
    answer: (lang) => lang === "es"
      ? "💳 Aceptamos todas las tarjetas de crédito y débito principales, Apple Pay y Google Pay. El pago se procesa automáticamente al finalizar el viaje."
      : "💳 We accept all major credit and debit cards, Apple Pay, and Google Pay. Payment is processed automatically when the ride ends.",
  },
  {
    patterns: [/cancel|cancelar|cancelación|refund|reembolso|devolu/i],
    answer: (lang) => lang === "es"
      ? "🔄 Puedes cancelar antes de que el conductor llegue sin costo. Cancelar cuando el conductor ya está cerca puede aplicar una pequeña tarifa. Los reembolsos se procesan en 3-5 días hábiles."
      : "🔄 You can cancel before the driver arrives at no cost. Canceling when the driver is already nearby may apply a small fee. Refunds are processed in 3-5 business days.",
  },
  {
    patterns: [/descargar|download|app|aplicacion|aplicación|ios|android|google\s*play|app\s*store|instalar/i],
    answer: (lang) => lang === "es"
      ? "📱 La app de Urbont está en iOS (App Store) y Android (Google Play). Solo busca 'Urbont' y descárgala gratis. ¡Solicita tu primer viaje hoy!"
      : "📱 The Urbont app is on iOS (App Store) and Android (Google Play). Just search 'Urbont' and download it for free. Request your first ride today!",
  },
  {
    patterns: [/calificacion|calificación|rating|estrella|star|review|puntuacion/i],
    answer: (lang) => lang === "es"
      ? "⭐ El sistema de calificación es bidireccional: pasajeros califican conductores y viceversa. Nuestros conductores tienen una calificación promedio de 4.95/5."
      : "⭐ The rating system is bidirectional: passengers rate drivers and vice versa. Our drivers average 4.95/5 stars.",
  },
  {
    patterns: [/espera|wait|eta|minutos|minutes|cuánto.*tiempo|tiempo.*lleg|arrive|demora/i],
    answer: (lang) => lang === "es"
      ? "⚡ El tiempo de espera promedio en Urbont es de solo 3 minutos, gracias a nuestra amplia red de conductores activos."
      : "⚡ The average wait time on Urbont is just 3 minutes, thanks to our large network of active drivers.",
  },
  {
    patterns: [/contact|contacto|ayuda|help|soporte|support|human|persona|agente|agent|problema|issue|queja|complaint|hablar/i],
    answer: (lang) => lang === "es"
      ? `📞 ¿Necesitas hablar con nuestro equipo?\n\n📧 ${CONTACT_EMAIL}\n📱 ${CONTACT_PHONE}\n\n¡Estamos disponibles para ayudarte!`
      : `📞 Need to talk to our team?\n\n📧 ${CONTACT_EMAIL}\n📱 ${CONTACT_PHONE}\n\nWe're available to help!`,
  },
];

const QUICK_QUESTIONS = ["Pricing", "Safety", "Become a driver", "Download app"];

function detectLang(text: string): "es" | "en" {
  return /hola|gracias|cómo|como|dónde|donde|precio|ayuda|conductor|viaje|quiero|necesito|cuánto|cuanto|disponible/i.test(text) ? "es" : "en";
}

function getResponse(text: string): string {
  const lang = detectLang(text);
  for (const faq of FAQ) {
    if (faq.patterns.some((p) => p.test(text))) return faq.answer(lang);
  }
  return lang === "es"
    ? `No encontré una respuesta exacta para eso. Para asistencia personalizada contacta a nuestro equipo:\n\n📧 ${CONTACT_EMAIL}\n📱 ${CONTACT_PHONE}`
    : `I couldn't find an exact answer. For personalized assistance, contact our team:\n\n📧 ${CONTACT_EMAIL}\n📱 ${CONTACT_PHONE}`;
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  text: "👋 Hi! / ¡Hola! I'm Urbont's support assistant.\n\nAsk me about pricing, safety, drivers, cities, payments and more — or tap a suggestion below.",
};

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendText = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: trimmed }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", text: getResponse(trimmed) }]);
    }, 700 + Math.random() * 500);
  }, []);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendText(text);
  }, [input, sendText]);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-[300] w-14 h-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center transition-all duration-300 ${open ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"}`}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Open support chat"
      >
        <MessageCircle size={24} />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-[300] w-[340px] sm:w-[380px] h-[530px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            <div className="bg-primary px-4 py-3.5 flex items-center gap-3 shrink-0">
              <div className="bg-white/20 p-2 rounded-xl shrink-0">
                <MessageCircle size={17} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">Urbont Support</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-white/75 text-xs font-medium">Online · Usually responds instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors" title={CONTACT_PHONE}>
                  <Phone size={14} className="text-white/80" />
                </a>
                <a href={`mailto:${CONTACT_EMAIL}`} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors" title={CONTACT_EMAIL}>
                  <Mail size={14} className="text-white/80" />
                </a>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors ml-1">
                  <X size={16} className="text-white" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/60">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mb-0.5">
                      <img src="/urbont-logo.png" alt="" className="w-4 h-4 object-contain rounded" />
                    </div>
                  )}
                  <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <img src="/urbont-logo.png" alt="" className="w-4 h-4 object-contain rounded" />
                  </div>
                  <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full block"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.14 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length <= 2 && !typing && (
              <div className="px-3 pt-2.5 pb-1.5 flex gap-1.5 overflow-x-auto shrink-0 border-t border-gray-100 bg-white">
                {QUICK_QUESTIONS.map((q) => (
                  <button key={q} onClick={() => sendText(q)}
                    className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors whitespace-nowrap">
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="px-3 py-3 border-t border-gray-100 flex items-center gap-2 bg-white shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }}}
                placeholder="Ask anything about Urbont…"
                className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50 transition-all"
              />
              <button onClick={send} disabled={!input.trim()}
                className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-35 hover:bg-primary/90 active:scale-95 transition-all shrink-0">
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
