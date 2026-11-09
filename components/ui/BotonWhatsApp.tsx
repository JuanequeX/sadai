import { MessageCircle } from "lucide-react";

import Boton, { type VarianteBoton } from "@/components/ui/Boton";
import { crearWhatsappHref, whatsappHref } from "@/lib/site-config";

type Icono = "mensaje" | "ninguno";

type BotonWhatsAppProps = {
  children?: string;
  variante?: VarianteBoton;
  className?: string;
  /** Icono que acompaña al texto. */
  icono?: Icono;
  /** Texto a precargar en el chat. Por defecto, el genérico de site-config. */
  mensaje?: string;
};

/**
 * Todo CTA de agendar cita pasa por aquí: el href de WhatsApp se construye
 * una sola vez en lib/site-config.ts.
 */
export default function BotonWhatsApp({
  children = "Agenda una cita",
  variante = "vino",
  className = "",
  icono = "mensaje",
  mensaje,
}: BotonWhatsAppProps) {
  return (
    <Boton
      href={mensaje ? crearWhatsappHref(mensaje) : whatsappHref}
      externo
      variante={variante}
      className={className}
      icono={icono === "mensaje" ? <MessageCircle className="size-5" strokeWidth={1.5} aria-hidden="true" /> : undefined}
    >
      {children}
    </Boton>
  );
}
