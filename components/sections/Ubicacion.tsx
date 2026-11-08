import Link from "next/link";
import { Clock, Map as IconoCroquis, MapPin, Navigation, Phone } from "lucide-react";

import Boton from "@/components/ui/Boton";
import Pill from "@/components/ui/Pill";
import Reveal from "@/components/ui/Reveal";
import { mapaEmbedSrc, rutaComoLlegar, site, telefonoHref } from "@/lib/site-config";

const icono = "size-5";

export default function Ubicacion() {
  // La dirección sigue en TODO en site-config: no se inventan datos.
  const datos = [
    { Icono: MapPin, titulo: "Dirección", valor: <>{site.direccion}</> },
    {
      Icono: Clock,
      titulo: "Horarios",
      valor: (
        <>
          {site.horarios.map((h) => (
            <span key={h.dias} className="block">
              {h.dias} · {h.horas}
            </span>
          ))}
        </>
      ),
    },
    {
      Icono: Phone,
      titulo: "Teléfono",
      valor: (
        <a href={telefonoHref} className="inline-block py-1 underline-offset-4 hover:underline">
          {site.telefonoVisible}
        </a>
      ),
    },
  ];

  return (
    <section id="ubicacion" aria-labelledby="ubicacion-titulo" className="seccion bg-vino text-marfil">
      <div className="contenedor grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-x-16">
        <Reveal className="lg:col-span-5">
          <Pill tono="oscuro">Dónde estamos</Pill>
          <h2 id="ubicacion-titulo" className="mt-6 text-h2">
            Te espero en el estudio.
          </h2>
          <p className="mt-4 text-lead text-marfil-75">Atiendo solo con cita: llegas y es tu turno.</p>

          <ul className="mt-10 space-y-6">
            {datos.map(({ Icono, titulo, valor }) => (
              <li key={titulo} className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-pill bg-rosa text-vino">
                  <Icono className={icono} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-etiqueta font-semibold text-marfil-75">{titulo}</span>
                  <span className="mt-1 block text-cuerpo">{valor}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Boton
              href={site.mapsUrl}
              externo
              variante="contorno-marfil"
              icono={<Navigation className={icono} strokeWidth={1.5} aria-hidden="true" />}
            >
              Abrir en Google Maps
            </Boton>
            <Link
              href={rutaComoLlegar}
              className="inline-flex min-h-11 items-center gap-2 text-etiqueta font-semibold text-marfil underline underline-offset-4 hover:no-underline"
            >
              <IconoCroquis className={icono} strokeWidth={1.5} aria-hidden="true" />
              Ver croquis para llegar
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-7">
          {/* Mapa interactivo directo. `loading="lazy"`: Google no carga hasta acercarse a la sección. */}
          <div className="aspect-[4/3] overflow-hidden rounded-tarjeta border border-rosa-75 bg-vino-80 lg:aspect-[16/11]">
            <iframe
              src={mapaEmbedSrc}
              title={`Mapa interactivo con la ubicación de ${site.marca}`}
              className="size-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
