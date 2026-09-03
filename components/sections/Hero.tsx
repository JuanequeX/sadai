import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

import BotonWhatsApp from "@/components/ui/BotonWhatsApp";
import Isotipo from "@/components/ui/Isotipo";
import { site } from "@/lib/site-config";

import styles from "./Hero.module.scss";

/**
 * Portada a pantalla completa, según el mockup de la propuesta de identidad.
 *
 * El peso visual lo carga la "S" en periwinkle que invade el borde derecho, no
 * una fotografía: la única imagen disponible del estudio es un retrato de
 * interior que funciona en «Sobre mí» pero no sostiene una portada a sangre.
 *
 * La entrada se anima con keyframes de CSS y no con motion: es el contenido
 * above the fold y así queda visible aunque el JS no cargue o la pestaña se
 * abra en segundo plano (Chrome congela requestAnimationFrame ahí y una
 * animación JS se quedaría a medias, con el texto invisible).
 */
export default function Hero() {
  // Escalona la entrada sin repetir la clase en cada elemento
  const retraso = (segundos: number) =>
    ({ animationDelay: `${segundos}s` }) as CSSProperties;

  return (
    <section className={styles.hero}>
      <Isotipo className={styles.marcaGigante} />

      <div className={styles.contenido}>
        <div className={styles.aparece} style={retraso(0)}>
          {/*
            Dimensiones nativas del asset: el export está en `unoptimized`, así
            que next/image sólo las usa para reservar el hueco y evitar saltos.
          */}
          <Image
            src="/logotipo-sadai-rosa.png"
            alt={`Logotipo de ${site.nombre}`}
            width={1657}
            height={787}
            priority
            className={styles.logotipo}
          />
        </div>

        <p
          className={`${styles.aparece} ${styles.antetitulo}`}
          style={retraso(0.1)}
        >
          Estudio privado · Manzanillo
        </p>

        <h1
          className={`${styles.aparece} ${styles.titular}`}
          style={retraso(0.18)}
        >
          Uñas que cuentan <em>tu propia</em> historia
        </h1>

        <p
          className={`${styles.aparece} ${styles.entrada}`}
          style={retraso(0.26)}
        >
          Manicura y pedicura con calma, higiene y detalle. Una clienta a la
          vez, para que el tiempo aquí también sea tuyo.
        </p>

        <div className={`${styles.aparece} mt-10`} style={retraso(0.34)}>
          <BotonWhatsApp variante="claro" />
        </div>
      </div>

      {/* El centrado va en el contenedor: el keyframe anima transform y pisaría el -translate-x-1/2 */}
      <div className={styles.bajar}>
        <a
          href="#sobre-mi"
          className={styles.aparece}
          style={retraso(0.5)}
          aria-label="Ir a la sección Sobre mí"
        >
          <ArrowDown className={styles.flecha} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
