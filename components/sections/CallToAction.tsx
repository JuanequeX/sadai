import BotonWhatsApp from "@/components/ui/BotonWhatsApp";
import IconoInstagram from "@/components/ui/IconoInstagram";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site-config";

import styles from "./CallToAction.module.scss";

// Arco de rx=360 y ry=90 sobre una cuerda de 720: una curva suave, no un domo
const ARCO = "M40,200 A360,90 0 0 1 760,200";

export default function CallToAction() {
  return (
    <section className={styles.cta}>
      <div className="mx-auto max-w-3xl px-6 pb-16 text-center md:pb-20">
        <Reveal>
          <svg
            className={styles.tituloCurvo}
            viewBox="0 0 800 220"
            role="img"
            aria-label="Agenda tu cita"
          >
            <path id="arco-cta" d={ARCO} fill="none" />
            <text>
              <textPath href="#arco-cta" startOffset="50%" textAnchor="middle">
                AGENDA TU CITA
              </textPath>
            </text>
          </svg>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto -mt-2 max-w-md text-base leading-relaxed text-crema/80 md:text-lg">
            Mándame un mensaje y buscamos el horario que te acomode. También
            puedes ver trabajos recientes en Instagram.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <BotonWhatsApp variante="claro" />
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-crema/40 px-7 py-3.5 text-sm font-medium tracking-wide text-crema uppercase transition-colors duration-300 hover:border-rosa hover:text-rosa"
            >
              <IconoInstagram />@{site.instagram}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
