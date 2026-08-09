import type { LucideIcon } from "lucide-react";
import { Footprints, Hand } from "lucide-react";

import BotonWhatsApp from "@/components/ui/BotonWhatsApp";
import Reveal from "@/components/ui/Reveal";

import styles from "./Servicios.module.scss";

type Servicio = {
  icono: LucideIcon;
  titulo: string;
  descripcion: string;
  incluye: string[];
};

// Agregar un servicio aquí lo agrega a la cuadrícula, sin tocar el markup
const servicios: Servicio[] = [
  {
    icono: Hand,
    titulo: "Manicura",
    descripcion:
      "Uñas listas para todos los días o para esa ocasión que ya tienes en la cabeza. Cuidamos primero la salud de tu uña, luego el diseño.",
    incluye: ["Limado y cutícula", "Esmaltado y diseño", "Hidratación final"],
  },
  {
    icono: Footprints,
    titulo: "Pedicura",
    descripcion:
      "Un rato para tus pies: limpieza profunda, exfoliación y color parejo que aguanta la semana completa.",
    incluye: ["Exfoliación y masaje", "Trabajo de talones", "Esmaltado duradero"],
  },
];

export default function Servicios() {
  return (
    <section id="servicios" className="bg-rosa px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Reveal>
            <p className="text-[0.65rem] tracking-[0.3em] text-cacao-suave uppercase">
              Nuestros servicios
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl leading-[1.15] text-balance text-cacao sm:text-4xl md:text-5xl">
              Lo que hacemos, con toda la calma
            </h2>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-7 md:grid-cols-2 md:gap-9">
          {servicios.map((servicio, i) => (
            <Reveal
              key={servicio.titulo}
              as="li"
              delay={0.1 + i * 0.1}
              className={i % 2 === 0 ? styles.tarjeta : `${styles.tarjeta} ${styles.alterna}`}
            >
              <span className={styles.icono}>
                <servicio.icono className="size-6" aria-hidden="true" />
              </span>

              <h3 className="mt-6 text-2xl text-cacao md:text-3xl">
                {servicio.titulo}
              </h3>

              <p className="mt-3.5 text-sm leading-relaxed text-cacao-suave md:text-base">
                {servicio.descripcion}
              </p>

              <ul className="mt-6 space-y-2.5">
                {servicio.incluye.map((punto) => (
                  <li
                    key={punto}
                    className="flex items-center gap-2.5 text-sm text-cacao"
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-rosa" />
                    {punto}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.3}>
          <div className="mt-14 text-center">
            <p className="text-sm text-cacao-suave">
              ¿Buscas algo distinto? Cuéntame qué traes en mente.
            </p>
            <div className="mt-5">
              <BotonWhatsApp>Agendar cita</BotonWhatsApp>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
