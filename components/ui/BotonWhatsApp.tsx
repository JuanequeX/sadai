import { ArrowUpRight, MessageCircle } from "lucide-react";

import { crearWhatsappHref, whatsappHref } from "@/lib/site-config";

type Variante = "solido" | "claro" | "contorno";
type Icono = "mensaje" | "flecha" | "ninguno";

type BotonWhatsAppProps = {
  children?: string;
  variante?: Variante;
  className?: string;
  /** Icono que acompaña al texto: mensaje antes, flecha después. */
  icono?: Icono;
  /** Texto a precargar en el chat. Por defecto, el genérico de site-config. */
  mensaje?: string;
};

const estilos: Record<Variante, string> = {
  // Cacao sobre fondos claros
  solido: "bg-cacao text-crema hover:bg-cacao-suave",
  // Rosa sobre fondos oscuros
  claro: "bg-rosa text-cacao hover:bg-rosa-claro",
  // Sin relleno, para secundarios
  contorno:
    "border border-cacao text-cacao hover:bg-cacao hover:text-crema bg-transparent",
};

/**
 * Todo CTA de agendar cita pasa por aquí: el href de WhatsApp se construye
 * una sola vez en lib/site-config.ts.
 */
export default function BotonWhatsApp({
  children = "Agendar cita",
  variante = "solido",
  className = "",
  icono = "mensaje",
  mensaje,
}: BotonWhatsAppProps) {
  return (
    <a
      href={mensaje ? crearWhatsappHref(mensaje) : whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${estilos[variante]} ${className}`}
    >
      {icono === "mensaje" ? (
        <MessageCircle className="size-4" aria-hidden="true" />
      ) : null}
      {children}
      {icono === "flecha" ? (
        <ArrowUpRight className="size-4" aria-hidden="true" />
      ) : null}
    </a>
  );
}
