import styles from "./WaveDivider.module.scss";

type WaveDividerProps = {
  /** Color de la sección que viene DEBAJO: es el relleno de la ola. */
  color: string;
  /** Color de la sección que queda ARRIBA: pinta el hueco sobre la ola. */
  fondo: string;
  /** Invierte la ola para cerrar una sección en lugar de abrirla. */
  flip?: boolean;
  className?: string;
};

// Ocho crestas alternadas a lo ancho. La línea base está en y=48 y la
// amplitud llega a ±44, por eso el viewBox mide 96 de alto.
const PATH =
  "M0,48 Q90,4 180,48 T360,48 T540,48 T720,48 T900,48 T1080,48 T1260,48 T1440,48 V96 H0 Z";

/**
 * Borde ondulado entre dos secciones. Se estira a lo ancho sin deformar
 * la altura gracias a preserveAspectRatio="none".
 */
export default function WaveDivider({
  color,
  fondo,
  flip = false,
  className = "",
}: WaveDividerProps) {
  return (
    <div
      className={`${styles.ola} ${flip ? styles.invertida : ""} ${className}`}
      style={{ backgroundColor: fondo }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 96" preserveAspectRatio="none" focusable="false">
        <path d={PATH} fill={color} />
      </svg>
    </div>
  );
}
