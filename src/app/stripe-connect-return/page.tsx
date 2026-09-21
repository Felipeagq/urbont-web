import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import EstadoStripe from "../stripe-connect-refresh/EstadoStripe";

/**
 * A donde Stripe devuelve al chofer cuando termina su registro.
 *
 * Es el `return_url` de `accountLinks.create` (urbont-api, api/integrations.ts).
 * Antes apuntaba a urbont.app, un dominio que no existe, así que el chofer
 * terminaba su registro y caía en una página de error.
 *
 * Llegar aquí NO significa que el registro esté completo: Stripe redirige
 * igual si el chofer abandona a medias. Quien decide es la app, consultando
 * `GET /api/integrations/stripe/connect/status`.
 */
export const metadata: Metadata = {
  title: "Registro de pagos enviado · Urbont",
  description: "Stripe recibió tus datos. Vuelve a la app para ver el estado de tu cuenta de pagos.",
  robots: { index: false, follow: false },
};

export default function StripeConnectReturn() {
  return (
    <EstadoStripe
      icono={<CheckCircle2 size={36} className="text-primary" aria-hidden />}
      titulo="Datos enviados a Stripe"
      mensaje="Stripe está revisando tu información. Vuelve a la app para ver si tu cuenta de pagos ya quedó lista."
      nota="Si Stripe te pidió algo más y no lo completaste, puedes retomar el registro desde la app cuando quieras."
    />
  );
}
