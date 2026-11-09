import type { ReactNode } from "react";

import styles from "./Degradado.module.scss";

export type VarianteDegradado = "aura" | "01" | "02" | "04" | "05" | "03";

type DegradadoProps = {
  variante: VarianteDegradado;
  /** Capa de grano del brand book (evita banding). */
  grano?: boolean;
  /** Oscurece un extremo para asegurar contraste del texto marfil. */
  velo?: "ninguno" | "inferior" | "superior";
  /** Desplazamiento lento del fondo (solo sin "reducir movimiento"). */
  animado?: boolean;
  as?: "div" | "section";
  className?: string;
  children?: ReactNode;
  id?: string;
  "aria-labelledby"?: string;
  "aria-hidden"?: boolean;
};

const CLASE_VARIANTE: Record<VarianteDegradado, string> = {
  aura: styles.aura,
  "01": styles.v01,
  "02": styles.v02,
  "03": styles.v03,
  "04": styles.v04,
  "05": styles.v05,
};

/**
 * Fondo de degradado de marca (PRD §3.4). 01, 02, 04, 05 y aura son CSS puro (0 bytes);
 * 03 usa imagen (vertical en móvil, horizontal desde md) generada con
 * `pnpm assets imagenes --con-degradado-03`; encuadre por `--d03-pos` del llamador.
 */
export default function Degradado({
  variante,
  grano = true,
  velo = "ninguno",
  animado = false,
  as: Etiqueta = "div",
  className = "",
  children,
  ...resto
}: DegradadoProps) {
  // Las capas de grano y velo (::before/::after absolutos) necesitan un ancestro posicionado.
  const posicion = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className) ? "" : "relative";
  const clases = [
    posicion,
    styles.degradado,
    CLASE_VARIANTE[variante],
    grano ? "grano" : "",
    velo === "inferior" ? styles.veloInferior : velo === "superior" ? styles.veloSuperior : "",
    animado ? styles.animado : "",
    className,
  ].join(" ");

  return (
    <Etiqueta className={clases} {...resto}>
      {children}
    </Etiqueta>
  );
}
