import styles from "./CurvaFluida.module.scss";

type CurvaFluidaProps = {
  /** Color de la sección que viene DEBAJO: es el relleno de la curva. */
  color: string;
  /** Color de la sección que queda ARRIBA: pinta el hueco sobre la curva. */
  fondo: string;
  /** Invierte la curva para cerrar una sección en lugar de abrirla. */
  flip?: boolean;
  className?: string;
};

/*
 * Un único gesto asimétrico, no una onda que se repite.
 *
 * La identidad de la Propuesta 02 no tiene ondas simétricas por ningún lado:
 * su lenguaje son curvas grandes de trazo continuo, como el del isotipo. Por
 * eso la silueta sube a la izquierda, cae hacia el centro-derecha y remonta al
 * final, sin ningún tramo que se espeje.
 */
const CURVA =
  "M0,74 C160,18 306,4 470,30 C662,60 782,112 980,104 C1152,97 1302,52 1440,26 V120 H0 Z";

export default function CurvaFluida({
  color,
  fondo,
  flip = false,
  className = "",
}: CurvaFluidaProps) {
  return (
    <div
      className={`${styles.curva} ${flip ? styles.invertida : ""} ${className}`}
      style={{ backgroundColor: fondo }}
      aria-hidden="true"
    >
      {/* preserveAspectRatio="none" la estira a lo ancho sin deformar el alto */}
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" focusable="false">
        <path d={CURVA} fill={color} />
      </svg>
    </div>
  );
}
