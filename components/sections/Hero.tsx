import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";

import Logotipo from "@/components/marca/Logotipo";
import BotonWhatsApp from "@/components/ui/BotonWhatsApp";
import Degradado from "@/components/ui/Degradado";
import Imagen from "@/components/ui/Imagen";
import type { FuenteImagen } from "@/lib/imagenes";
import { site } from "@/lib/site-config";

import styles from "./Hero.module.scss";

type FotoHero = FuenteImagen & { alt: string; posicion?: string };

/**
 * Portada (PRD §6.2, mockup "Presencia digital").
 *
 * Por defecto, sin foto: panel de degradado aura a ancho completo. Con `foto` cambia al
 * layout dividido 50/50 en desktop (foto debajo en 4:5 en móvil). Hoy no se pasa: no hay
 * fotografía con licencia (PRD §12.2).
 *
 * Fondo "seda" inspirado en el Degradado 05 (Hero.module.scss). Todo el texto va en marfil:
 * los tonos que cruzan la columna central están acotados para que marfil cumpla ≥ 4.5:1.
 *
 * La entrada es por keyframes de CSS, no JS: el above-the-fold queda visible aunque el JS
 * no cargue. El h1 y el lead solo se desplazan (sin opacity 0) para no retrasar el LCP.
 */
export default function Hero({ foto }: { foto?: FotoHero }) {
  const retraso = (ms: number) => ({ animationDelay: `${ms}ms` }) as CSSProperties;

  const panel = (
    <Degradado
      variante="aura"
      grano
      className={`${styles.panel} flex flex-col pt-[var(--altura-navbar)]`}
    >
      <div className="contenedor flex flex-1 flex-col items-center justify-between gap-8 text-center">
        <p className={`${styles.aparece} mt-2 w-full`} style={retraso(0)}>
          <Logotipo titulo={site.marca} className="mx-auto h-auto w-[min(64vw,500px)] min-w-[240px] text-marfil" />
        </p>

        <div className={`${styles.titular} flex flex-col items-center gap-5`}>
          <h1 id="hero-titulo" className={`${styles.desliza} font-titulo text-display text-marfil`} style={retraso(100)}>
            Tus uñas.
            <br />
            Tu forma
            <br />
            de decirlo.
          </h1>
          <p className={`${styles.desliza} max-w-[28ch] text-lead text-marfil`} style={retraso(180)}>
            Estudio privado de uñas artísticas en Manzanillo, Colima.
          </p>
        </div>

        <div className={`${styles.cta} flex flex-col items-center gap-4`}>
          <div className={`${styles.aparece} flex flex-col items-center gap-2 sm:flex-row sm:gap-6`} style={retraso(260)}>
            <BotonWhatsApp variante="contorno-marfil" />
            <a
              href="#servicios"
              className="inline-flex min-h-11 items-center px-2 text-etiqueta font-semibold text-marfil underline underline-offset-4 hover:no-underline"
            >
              Ver servicios
            </a>
          </div>
          <a
            href="#sobre-mi"
            className={`${styles.aparece} hidden min-h-11 min-w-11 items-center justify-center text-marfil-75 hover:text-marfil md:inline-flex`}
            style={retraso(420)}
            aria-label="Ir a la sección Sobre mí"
          >
            <ArrowDown className={`${styles.flecha} size-5`} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>
    </Degradado>
  );

  if (!foto) {
    return (
      <section aria-labelledby="hero-titulo" className={styles.hero}>
        {panel}
      </section>
    );
  }

  return (
    <section aria-labelledby="hero-titulo" className={`${styles.hero} lg:grid lg:grid-cols-2`}>
      {panel}
      <Imagen
        {...foto}
        prioridad
        sizes="(min-width:1024px) 50vw, 100vw"
        className="block"
        classNameImg="aspect-[4/5] size-full object-cover lg:aspect-auto"
      />
    </section>
  );
}
