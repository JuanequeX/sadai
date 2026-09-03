import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

import BotonWhatsApp from "@/components/ui/BotonWhatsApp";
import Monograma from "@/components/ui/Monograma";
import { site } from "@/lib/site-config";

import styles from "./Hero.module.scss";

/**
 * Portada a pantalla completa, según el mockup de la propuesta de identidad.
 *
 * La composición se parte en dos: el texto a la izquierda sobre fondo claro y
 * un panel rosa a la derecha con el monograma recortado, como en la tarjeta de
 * presentación donde la marca se sale del formato. No lleva fotografía: la
 * única imagen disponible del estudio es un retrato de interior que funciona
 * en «Sobre mí» pero no sostiene una portada a sangre.
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
      <div className={styles.panel} aria-hidden="true">
        <Monograma className={styles.monogramaGigante} />
      </div>

      <div className={`contenedor ${styles.contenido}`}>
        <div className={styles.aparece} style={retraso(0)}>
          {/*
            Dimensiones nativas del asset: el export está en `unoptimized`, así
            que next/image sólo las usa para reservar el hueco y evitar saltos.
          */}
          <Image
            src="/logotipo-lockup.png"
            alt={`Logotipo de ${site.nombre}`}
            width={1999}
            height={659}
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
          <BotonWhatsApp />
        </div>

        {/* Dentro del contenedor, no de la sección: sólo así cae bajo el
            logotipo en vez de pegarse al borde del viewport. */}
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
      </div>
    </section>
  );
}
