import Image from "next/image";
import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site-config";

import styles from "./SobreMi.module.scss";

const valores = [
  { icono: ShieldCheck, texto: "Herramientas esterilizadas en cada cita" },
  { icono: HeartHandshake, texto: "Atención uno a uno, sin prisas" },
  { icono: Sparkles, texto: "Diseños pensados para ti" },
];

export default function SobreMi() {
  return (
    <section id="sobre-mi" className="bg-arena px-5 py-10 md:px-10 md:py-18">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className={styles.collage}>
          <div className={styles.marco}>
            <Image
              src="/sadai-retrato.png"
              alt="Sadai en su estudio, frente al letrero de neón de la marca"
              width={1133}
              height={1600}
              sizes="(min-width: 1024px) 40vw, 90vw"
              className={styles.retrato}
            />
          </div>

          <div className={styles.tarjetaFlotante} aria-hidden="true">
            <span className="block font-titulo text-3xl text-cacao">
              {site.fundado}
            </span>
            <span className="mt-1 block text-[0.6rem] tracking-[0.22em] text-cacao-suave uppercase">
              Desde
            </span>
          </div>

          <div className={styles.mancha} aria-hidden="true" />
        </Reveal>

        <div>
          <Reveal>
            <p className="text-[0.65rem] tracking-[0.3em] text-cacao-suave uppercase">
              Sobre mí
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mt-5 text-3xl leading-[1.15] text-balance text-cacao sm:text-4xl md:text-5xl">
              El detalle es la cultura.
              <br />
              <span className="font-firma text-[1.35em] leading-none text-cacao">
                Sadai
              </span>{" "}
              es el nombre.
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-7 space-y-4 text-base leading-relaxed text-cacao-suave">
              <p>
                Abrí este espacio en {site.fundado} con una idea sencilla: que
                arreglarte las uñas se sintiera como un descanso y no como un
                trámite. Por eso trabajo con cita y atiendo a una sola persona
                a la vez.
              </p>
              <p>
                Aquí cada servicio empieza escuchando qué necesitas —el largo,
                la forma, el color, el cuidado que traes— y termina con unas
                manos que se ven y se sienten tuyas.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <ul className="mt-9 space-y-4">
              {valores.map(({ icono: Icono, texto }) => (
                <li key={texto} className="flex items-center gap-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-crema text-cacao">
                    <Icono className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-cacao">{texto}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
