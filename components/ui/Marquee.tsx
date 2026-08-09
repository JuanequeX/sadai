import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import styles from "./Marquee.module.scss";

type MarqueeProps = {
  /** Frases que se repiten a lo largo de la banda. */
  items: readonly string[];
  /** Segundos que tarda una copia en recorrer su propio ancho. */
  duracion?: number;
  className?: string;
};

/** Con menos de dos copias no hay ninguna que releve a la que sale. */
const COPIAS_MINIMAS = 2;

/**
 * Copias del HTML estático, antes de que la hidratación permita medir.
 *
 * Pasarse no cuesta nada: el efecto ajusta el número al alza o a la baja en
 * cuanto monta. Quedarse corto sí se ve, porque la primera pintura llega antes
 * de que haya JS y el corte asomaría hasta que hidrate.
 */
const COPIAS_INICIALES = 6;

/**
 * Cuántas copias hacen falta para que nunca se vea el final de la pista.
 *
 * La pista se desplaza como mucho el ancho de una copia, así que al cerrar el
 * ciclo sólo quedan `copias - 1` tapando la banda: `ceil` cubre el ancho y las
 * dos extra dejan una copia entera de holgura, muy por encima de lo que puede
 * comerse un redondeo a subpíxeles.
 */
function copiasNecesarias(anchoBanda: number, anchoGrupo: number) {
  return Math.max(Math.ceil(anchoBanda / anchoGrupo) + 2, COPIAS_MINIMAS);
}

/**
 * Banda de texto en bucle, sin huecos a ningún ancho de pantalla.
 *
 * Se repite el grupo las veces que haga falta para desbordar el contenedor y la
 * pista se desplaza el ancho exacto de una copia, así que al cerrar el ciclo
 * queda idéntica a como empezó y el salto es invisible.
 */
export default function Marquee({
  items,
  duracion = 28,
  className = "",
}: MarqueeProps) {
  const sinMovimiento = useReducedMotion();
  const bandaRef = useRef<HTMLDivElement>(null);
  const grupoRef = useRef<HTMLUListElement>(null);
  const [copias, setCopias] = useState(COPIAS_INICIALES);

  // El ancho del grupo depende de la fuente, que puede cargar tarde, y el del
  // contenedor del viewport. ResizeObserver cubre ambos casos sin escuchar
  // resize a mano.
  useEffect(() => {
    const banda = bandaRef.current;
    const grupo = grupoRef.current;
    if (!banda || !grupo) return;

    const recalcular = () => {
      const anchoGrupo = grupo.getBoundingClientRect().width;
      const anchoBanda = banda.getBoundingClientRect().width;
      if (anchoGrupo === 0) return;

      const necesarias = copiasNecesarias(anchoBanda, anchoGrupo);
      // Sin el guardia, cada render dispararía otra medición en bucle.
      setCopias((previas) => (previas === necesarias ? previas : necesarias));
    };

    const observador = new ResizeObserver(recalcular);
    observador.observe(banda);
    observador.observe(grupo);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={bandaRef} className={`${styles.banda} ${className}`}>
      {/* El contenido real para lectores de pantalla, una sola vez */}
      <span className="sr-only">{items.join(". ")}</span>
      <div
        className={styles.pista}
        style={
          sinMovimiento
            ? { animation: "none" }
            : ({
                animationDuration: `${duracion}s`,
                // Una copia, expresada como fracción del ancho total de la pista.
                "--desplazamiento": `-${100 / copias}%`,
              } as React.CSSProperties)
        }
      >
        {Array.from({ length: copias }, (_, copia) => (
          <ul
            key={copia}
            ref={copia === 0 ? grupoRef : undefined}
            className={styles.grupo}
            aria-hidden="true"
          >
            {items.map((texto, i) => (
              <li key={`${texto}-${i}`}>
                <span>{texto}</span>
                <span className={styles.punto} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
