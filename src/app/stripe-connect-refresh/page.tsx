import type { Metadata } from "next";
import { RefreshCw } from "lucide-react";
import EstadoStripe from "./EstadoStripe";

/**
 * A donde Stripe devuelve al chofer cuando el enlace de registro ya no sirve:
 * caducó —duran unos minutos— o se abrió dos veces.
 *
 * Es el `refresh_url` de `accountLinks.create` (urbont-api, api/integrations.ts).
 * No se puede reanudar desde aquí: el enlace nuevo lo pide la app, que es quien
 * tiene la sesión del chofer.
 */
export const metadata: Metadata = {
  title: "El enlace de registro venció · Urbont",
  description: "Vuelve a la app de Urbont para retomar el registro de tu cuenta de pagos.",
  robots: { index: false, follow: false },
};

export default function StripeConnectRefresh() {
  return (
    <EstadoStripe
      icono={<RefreshCw size={36} className="text-primary" aria-hidden />}
      titulo="El enlace venció"
      mensaje="Por seguridad, el enlace de Stripe dura unos minutos. No se perdió nada de lo que ya completaste."
      nota="Vuelve a la app y toca de nuevo el registro de pagos: se genera un enlace nuevo y continúas donde ibas."
    />
  );
}
