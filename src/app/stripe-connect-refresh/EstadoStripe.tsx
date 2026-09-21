"use client";

import React, { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";

/**
 * Pantalla de vuelta del registro de pagos, compartida por las dos rutas que
 * Stripe usa: `/stripe-connect-return` al terminar y `/stripe-connect-refresh`
 * cuando el enlace caduca.
 *
 * El chofer llega aquí desde el navegador que abrió la app, así que lo único
 * que tiene que hacer es volver. En iOS y Android el navegador se puede cerrar
 * solo; cuando no se puede, se le dice qué hacer en vez de dejarlo en blanco.
 */
export default function EstadoStripe({
  icono,
  titulo,
  mensaje,
  nota,
}: {
  icono: React.ReactNode;
  titulo: string;
  mensaje: string;
  nota?: string;
}) {
  const [seCerroSolo, setSeCerroSolo] = useState(false);

  useEffect(() => {
    // `window.close()` sólo funciona en pestañas que abrió un script, que es el
    // caso del navegador dentro de la app. En una pestaña normal no hace nada,
    // y por eso las instrucciones se muestran igual.
    const t = setTimeout(() => {
      try {
        window.close();
        setSeCerroSolo(true);
      } catch {
        /* la pestaña sigue abierta: el texto de abajo explica qué hacer */
      }
    }, 1200);
    return () => clearTimeout(t);
  }, []);

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
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10">
            {icono}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-3">{titulo}</h1>
          <p className="text-gray-600 leading-relaxed mb-6">{mensaje}</p>

          <div className="rounded-xl border border-gray-200 bg-white/70 px-5 py-4 text-left">
            <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
              <Smartphone size={16} className="text-primary" aria-hidden />
              Vuelve a la app de Urbont
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {seCerroSolo
                ? "Ya puedes cerrar esta ventana."
                : "Cierra esta ventana o usa el botón de volver de tu teléfono. Tu estado se actualiza solo al regresar."}
            </p>
          </div>

          {nota && <p className="text-xs text-gray-400 mt-5 leading-relaxed">{nota}</p>}
        </div>
      </main>
    </div>
  );
}
