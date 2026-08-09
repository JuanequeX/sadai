import { useReducedMotion } from "motion/react";

import styles from "./Marquee.module.scss";

type MarqueeProps = {
  /** Frases que se repiten a lo largo de la banda. */
  items: readonly string[];
  /** Segundos que tarda una vuelta completa. */
  duracion?: number;
  className?: string;
};

/**
 * Banda de texto en bucle. Se renderizan dos copias idénticas y la pista
 * se desplaza -50%, así el corte nunca se ve.
 */
export default function Marquee({
  items,
  duracion = 28,
  className = "",
}: MarqueeProps) {
  const sinMovimiento = useReducedMotion();

  const grupo = (
    <ul className={styles.grupo} aria-hidden="true">
      {items.map((texto, i) => (
        <li key={`${texto}-${i}`}>
          <span>{texto}</span>
          <span className={styles.punto} />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`${styles.banda} ${className}`}>
      {/* El contenido real para lectores de pantalla, una sola vez */}
      <span className="sr-only">{items.join(". ")}</span>
      <div
        className={styles.pista}
        style={
          sinMovimiento
            ? { animation: "none" }
            : { animationDuration: `${duracion}s` }
        }
      >
        {grupo}
        {grupo}
      </div>
    </div>
  );
}
