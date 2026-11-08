import type { ReactNode } from "react";

type PillProps = {
  children: ReactNode;
  /** `claro` sobre fondos claros (vino), `oscuro` sobre vino o degradados (marfil). */
  tono?: "claro" | "oscuro";
  as?: "p" | "span";
  className?: string;
};

/** Etiqueta no interactiva con contorno fino, firma visual del brand book. */
export default function Pill({ children, tono = "claro", as: Etiqueta = "p", className = "" }: PillProps) {
  const color = tono === "claro" ? "border-linea text-vino" : "border-linea-clara text-marfil";
  return (
    <Etiqueta className={`inline-flex min-h-8 items-center rounded-pill border px-4 text-etiqueta font-semibold ${color} ${className}`}>
      {children}
    </Etiqueta>
  );
}
