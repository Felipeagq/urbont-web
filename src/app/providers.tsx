"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import { LanguageProvider } from "@/i18n";
import CursorSpotlight from "@/components/cursor-spotlight";
import SupportChat from "@/components/support-chat";
import ScrollToTop from "@/components/scroll-to-top";

/**
 * Scroll suave con Lenis.
 *
 * En la app de Vite se inicializaba en main.tsx, a nivel de módulo. Aquí vive
 * en un efecto para que no se ejecute durante el render del servidor y para
 * poder destruirlo al desmontar.
 */
function SmoothScroll() {
  useEffect(() => {
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;

    // Import dinámico: Lenis toca `window` al construirse.
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Dentro del estado para que cada sesión tenga su propio cliente y no se
  // comparta caché entre peticiones durante el render en servidor.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <SmoothScroll />
            <CursorSpotlight />
            {children}
            <ScrollToTop />
            <SupportChat />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}
