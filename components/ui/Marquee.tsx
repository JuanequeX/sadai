import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";

import Recurso from "@/components/marca/Recurso";

import styles from "./Marquee.module.scss";

type MarqueeProps = {
  /** Frases que se repiten a lo largo de la banda. */
  items: readonly string[];
  /** Segundos que tarda una copia en recorrer su propio ancho. */
  duracion?: number;
  /** Separador entre frases. Por defecto, el destello de la marca. */
  separador?: ReactNode;
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
 * dos extra dejan una copia entera de holgura.
 */
function copiasNecesarias(anchoBanda: number, anchoGrupo: number) {
  return Math.max(Math.ceil(anchoBanda / anchoGrupo) + 2, COPIAS_MINIMAS);
}

/**
 * Banda de texto en bucle, sin huecos a ningún ancho de pantalla.
 *
 * Se repite el grupo las veces que haga falta para desbordar el contenedor y la
 * pista se desplaza el ancho exacto de una copia. Con "reducir movimiento" el CSS
 * la detiene; si no, se pausa y reanuda (WCAG 2.2.2) solo con el botón: un único estado
 * `pausado` controla la animación.
 */
export default function Marquee({
  items,
  duracion = 40,
  separador = <Recurso nombre="destello" className="size-4 text-rosa" />,
  className = "",
}: MarqueeProps) {
  const bandaRef = useRef<HTMLDivElement>(null);
  const grupoRef = useRef<HTMLUListElement>(null);
  const [copias, setCopias] = useState(COPIAS_INICIALES);
  const [pausado, setPausado] = useState(false);

  // El ancho del grupo depende de la fuente, que puede cargar tarde, y el del
  // contenedor del viewport. ResizeObserver cubre ambos casos.
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
    <div ref={bandaRef} className={`${styles.banda} ${className}`} data-pausado={pausado || undefined}>
      {/* El contenido real para lectores de pantalla, una sola vez */}
      <p className="sr-only">{items.join(". ")}</p>
      <div
        className={styles.pista}
        style={
          {
            animationDuration: `${duracion}s`,
            // Una copia, expresada como fracción del ancho total de la pista.
            "--desplazamiento": `-${100 / copias}%`,
          } as CSSProperties
        }
      >
        {Array.from({ length: copias }, (_, copia) => (
          <ul key={copia} ref={copia === 0 ? grupoRef : undefined} className={styles.grupo} aria-hidden="true">
            {items.map((texto, i) => (
              <li key={`${texto}-${i}`}>
                <span>{texto}</span>
                <span className={styles.separador}>{separador}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <button
        type="button"
        className={styles.pausa}
        data-pausa-marquee
        onClick={() => setPausado((v) => !v)}
        aria-pressed={pausado}
        aria-label={pausado ? "Reanudar animación" : "Pausar animación"}
      >
        {pausado ? (
          <Play className="size-5" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Pause className="size-5" strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
