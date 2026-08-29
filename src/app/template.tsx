"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Transición de entrada entre páginas.
 *
 * En la app de Vite esto era un <AnimatePresence mode="wait"> envolviendo el
 * <Switch> de wouter. En el App Router, template.tsx se vuelve a montar en cada
 * navegación, que es justo lo que necesita la animación de entrada.
 *
 * Nota: la animación de salida (`exit`) no se conserva. AnimatePresence necesita
 * mantener el nodo saliente montado y el App Router desmonta la página anterior
 * antes de montar la nueva. La entrada — que es lo que se percibe — es idéntica.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
