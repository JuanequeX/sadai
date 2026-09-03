import { useRef } from "react";

import BotonCopiar from "@/components/ui/BotonCopiar";

import styles from "./CampoCopiable.module.scss";

type CampoCopiableProps = {
  etiqueta: string;
  /** Lo que va al portapapeles. */
  valor: string;
  /**
   * Lo que se enseña, si difiere de lo que se copia. El número de cuenta se
   * muestra agrupado para poder leerlo, pero se copia sin espacios: pegarlo
   * con espacios en la app del banco falla.
   */
  mostrado?: string;
};

export default function CampoCopiable({
  etiqueta,
  valor,
  mostrado,
}: CampoCopiableProps) {
  const valorRef = useRef<HTMLSpanElement>(null);

  // Respaldo cuando no hay portapapeles: dejar el valor seleccionado para
  // poder copiarlo a mano.
  const seleccionar = () => {
    const nodo = valorRef.current;
    const seleccion = window.getSelection();
    if (!nodo || !seleccion) return;
    const rango = document.createRange();
    rango.selectNodeContents(nodo);
    seleccion.removeAllRanges();
    seleccion.addRange(rango);
  };

  return (
    <div className={styles.campo}>
      <p className={styles.etiqueta}>{etiqueta}</p>

      <div className={styles.fila}>
        <span ref={valorRef} className={styles.valor}>
          {mostrado ?? valor}
        </span>

        <BotonCopiar valor={valor} etiqueta={etiqueta} alFallar={seleccionar} />
      </div>
    </div>
  );
}
