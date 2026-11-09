import type { MouseEventHandler, ReactNode } from "react";

export type VarianteBoton = "vino" | "marfil" | "contorno-vino" | "contorno-marfil";

type BotonProps = {
  href?: string;
  /** Abre en otra pestaña y lo anuncia a lectores de pantalla. */
  externo?: boolean;
  variante: VarianteBoton;
  tamano?: "md" | "sm";
  icono?: ReactNode;
  iconoFinal?: ReactNode;
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: "button" | "submit";
  "aria-label"?: string;
};

const VARIANTES: Record<VarianteBoton, string> = {
  vino: "bg-vino text-marfil hover:bg-vino-hover",
  marfil: "bg-marfil text-vino hover:bg-rosa-claro",
  "contorno-vino": "border border-vino text-vino hover:bg-vino hover:text-marfil",
  "contorno-marfil": "border border-marfil text-marfil hover:bg-marfil hover:text-vino",
};

const TAMANOS = { md: "min-h-11 px-6", sm: "min-h-11 px-4" } as const;

/** Botón pill de la marca (PRD §3.8). Sin mayúsculas sostenidas. */
export default function Boton({
  href,
  externo = false,
  variante,
  tamano = "md",
  icono,
  iconoFinal,
  className = "",
  children,
  onClick,
  type = "button",
  "aria-label": ariaLabel,
}: BotonProps) {
  const clases = `inline-flex items-center justify-center gap-2 rounded-pill text-etiqueta font-semibold transition-colors duration-200 ${TAMANOS[tamano]} ${VARIANTES[variante]} ${className}`;
  const contenido = (
    <>
      {icono}
      {children}
      {iconoFinal}
      {externo && !ariaLabel ? <span className="sr-only"> (se abre en otra pestaña)</span> : null}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={clases}
        onClick={onClick}
        aria-label={ariaLabel}
        {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {contenido}
      </a>
    );
  }
  return (
    <button type={type} className={clases} onClick={onClick} aria-label={ariaLabel}>
      {contenido}
    </button>
  );
}
