import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

import styles from "./BotonCopiar.module.scss";

type BotonCopiarProps = {
  /** Lo que va al portapapeles. */
  valor: string;
  /** Qué se está copiando; se usa para el `aria-label` y el anuncio. */
  etiqueta: string;
  children?: string;
  /** `contorno` para acciones secundarias, como copiar todo de una vez. */
  variante?: "solido" | "contorno";
  className?: string;
  /**
   * Qué hacer si el portapapeles no está disponible. El campo individual
   * aprovecha esto para seleccionar el texto y que se pueda copiar a mano.
   */
  alFallar?: () => void;
  /** Avisa cuando cambia el estado de confirmación (p. ej. para resaltar la tarjeta). */
  alCopiar?: (copiado: boolean) => void;
};

/** Cuánto dura la confirmación antes de volver a «Copiar». */
const MS_CONFIRMACION = 2000;

/**
 * Único sitio donde se habla con el portapapeles: lo usan tanto cada dato
 * bancario como el botón que los copia todos de una vez.
 */
export default function BotonCopiar({
  valor,
  etiqueta,
  children = "Copiar",
  variante = "solido",
  className = "",
  alFallar,
  alCopiar,
}: BotonCopiarProps) {
  const [copiado, setCopiado] = useState(false);

  // Devuelve el botón a su estado inicial, y limpia si el componente se va
  // antes de que venza el plazo.
  useEffect(() => {
    if (!copiado) return;
    const t = setTimeout(() => {
      setCopiado(false);
      alCopiar?.(false);
    }, MS_CONFIRMACION);
    return () => clearTimeout(t);
  }, [copiado, alCopiar]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(true);
      alCopiar?.(true);
    } catch {
      // El portapapeles falla en contextos no seguros y si se deniega el
      // permiso. Antes que dejar un botón que no hace nada, se delega.
      alFallar?.();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copiar}
        className={`${styles.boton} ${variante === "contorno" ? styles.contorno : ""} ${className}`}
        // Con el texto por defecto ("Copiar") el nombre accesible dice qué se copia. Con un texto
        // propio no se pisa: el nombre debe contener lo visible (WCAG 2.5.3, label-in-name).
        aria-label={children === "Copiar" ? `Copiar ${etiqueta.toLowerCase()}` : undefined}
      >
        {copiado ? (
          <Check className={styles.icono} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Copy className={styles.icono} strokeWidth={1.5} aria-hidden="true" />
        )}
        {copiado ? "Copiado" : children}
      </button>

      {/* El cambio de texto del botón no lo anuncian todos los lectores de
          pantalla, así que la confirmación se emite también por aquí. */}
      <span aria-live="polite" className="sr-only">
        {copiado ? `${etiqueta} copiado` : ""}
      </span>
    </>
  );
}
