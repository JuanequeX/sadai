import { MessageCircle } from "lucide-react";

import { whatsappHref } from "@/lib/site-config";

type Variante = "solido" | "claro" | "contorno";

type BotonWhatsAppProps = {
  children?: string;
  variante?: Variante;
  className?: string;
  /** Muestra el icono de mensaje junto al texto. */
  conIcono?: boolean;
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
  conIcono = true,
}: BotonWhatsAppProps) {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${estilos[variante]} ${className}`}
    >
      {conIcono ? <MessageCircle className="size-4" aria-hidden="true" /> : null}
      {children}
    </a>
  );
}
