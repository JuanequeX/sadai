import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

import BotonWhatsApp from "@/components/ui/BotonWhatsApp";
import { site } from "@/lib/site-config";

import styles from "./Hero.module.scss";

/**
 * Portada a pantalla completa.
 *
 * La entrada se anima con keyframes de CSS y no con motion: es el contenido
 * above the fold y así queda visible aunque el JS no cargue o la pestaña se
 * abra en segundo plano (Chrome congela requestAnimationFrame ahí y una
 * animación JS se quedaría a medias, con el texto invisible).
 *
 * Hoy el fondo es un degradado de la paleta. Cuando exista una foto real del
 * estudio, colócala en `public/hero.jpg` y sustituye los blobs por un
 * <Image fill priority /> con un overlay cacao al ~35%, como en la referencia.
 */
export default function Hero() {
  // Escalona la entrada sin repetir la clase en cada elemento
  const retraso = (segundos: number) =>
    ({ animationDelay: `${segundos}s` }) as CSSProperties;

  return (
    <section className={styles.hero}>
      <div className={styles.blobRosa} aria-hidden="true" />
      <div className={styles.blobArena} aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-6 py-28 text-center">
        <div className={styles.aparece} style={retraso(0)}>
          <Image
            src="/logo-sadai.png"
            alt={`Logotipo de ${site.nombre}`}
            width={140}
            height={140}
            priority
            className="size-24 rounded-full object-cover shadow-[0_10px_40px_rgba(62,39,35,0.12)] md:size-28"
          />
        </div>

        <p
          className={`${styles.aparece} mt-8 text-[0.65rem] tracking-[0.34em] text-cacao-suave uppercase md:text-xs`}
          style={retraso(0.1)}
        >
          Estudio privado · Manzanillo
        </p>

        <h1
          className={`${styles.aparece} mt-5 text-4xl leading-[1.1] text-balance text-cacao sm:text-5xl md:text-7xl`}
          style={retraso(0.18)}
        >
          Uñas que cuentan{" "}
          {/* pr-* compensa el swash final de la cursiva, que si no roza la palabra siguiente */}
          <span className="font-firma pr-2 text-[1.25em] leading-none text-rosa [text-shadow:0_1px_0_rgba(62,39,35,0.12)] md:pr-4">
            tu propia
          </span>{" "}
          historia
        </h1>

        <p
          className={`${styles.aparece} mt-7 max-w-md text-base leading-relaxed text-cacao-suave md:text-lg`}
          style={retraso(0.26)}
        >
          Manicura y pedicura con calma, higiene y detalle. Una clienta a la
          vez, para que el tiempo aquí también sea tuyo.
        </p>

        <div className={`${styles.aparece} mt-10`} style={retraso(0.34)}>
          <BotonWhatsApp />
        </div>
      </div>

      {/* El centrado va en el contenedor: el keyframe anima transform y pisaría el -translate-x-1/2 */}
      <div className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 md:bottom-28">
        <a
          href="#sobre-mi"
          className={`${styles.aparece} block text-cacao-suave`}
          style={retraso(0.5)}
          aria-label="Ir a la sección Sobre mí"
        >
          <ArrowDown className={styles.flecha} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
