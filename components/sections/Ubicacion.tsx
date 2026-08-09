import { Clock, MapPin, Navigation, Phone } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { mapaEmbedSrc, site } from "@/lib/site-config";

const datos = [
  { icono: MapPin, titulo: "Dirección", valor: site.direccion },
  { icono: Clock, titulo: "Horarios", valor: site.horarios },
  { icono: Phone, titulo: "Teléfono", valor: site.telefonoVisible },
];

export default function Ubicacion() {
  return (
    <section id="ubicacion" className="bg-crema px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <p className="text-[0.65rem] tracking-[0.3em] text-cacao-suave uppercase">
                Dónde estamos
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-5 text-3xl leading-[1.15] text-balance text-cacao sm:text-4xl md:text-5xl">
                Te esperamos en el estudio
              </h2>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-5 max-w-md text-base leading-relaxed text-cacao-suave">
                Atendemos solo con cita para que llegues, entres y sea tu turno.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="mt-10 space-y-6">
                {datos.map(({ icono: Icono, titulo, valor }) => (
                  <li key={titulo} className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-rosa text-cacao">
                      <Icono className="size-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[0.6rem] tracking-[0.22em] text-cacao-suave uppercase">
                        {titulo}
                      </span>
                      <span className="mt-1 block text-base text-cacao">
                        {valor}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.28}>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-cacao px-7 py-3.5 text-sm font-medium tracking-wide text-cacao uppercase transition-colors duration-300 hover:bg-cacao hover:text-crema"
              >
                <Navigation className="size-4" aria-hidden="true" />
                Cómo llegar
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(62,39,35,0.14)] md:rounded-[2.5rem]">
              <iframe
                src={mapaEmbedSrc}
                title={`Mapa con la ubicación de ${site.nombre}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[320px] w-full border-0 md:h-[460px]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
