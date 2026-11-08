import Link from "next/link";
import { ArrowLeft, Navigation } from "lucide-react";

import Metadatos from "@/components/layout/Metadatos";
import Croquis from "@/components/ubicacion/Croquis";
import Boton from "@/components/ui/Boton";
import Pill from "@/components/ui/Pill";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site-config";

const pasos = [
  "Desde el Boulevard Miguel de la Madrid, entra por la Calle General Lázaro Cárdenas: a la derecha si vienes del centro, a la izquierda si vienes de Santiago.",
  "Avanza unos 150 m y dobla a la derecha en la Calle Eusebio Hernández.",
  "A unos 60 m, el estudio queda a tu izquierda en Plaza Don Pedro.",
];

/**
 * Croquis para llegar al estudio desde el Boulevard Miguel de la Madrid.
 * La página es solo el croquis: el mapa interactivo vive en la sección Ubicación del home.
 *
 * El croquis se dimensiona con el viewport (dvh) para verse completo en una pantalla:
 * - móvil/tablet: título compacto, croquis a todo el ancho (cuadrado, nunca más alto que el
 *   espacio bajo el navbar) y los pasos debajo;
 * - desktop: dos columnas; a la izquierda título y pasos, a la derecha el croquis con el alto
 *   disponible de la pantalla (sticky, para que no se pierda al leer los pasos).
 */
export default function ComoLlegar() {
  return (
    <>
      <Metadatos
        titulo={`Cómo llegar | ${site.nombre}`}
        descripcion={`Croquis para llegar a ${site.nombre}, en Plaza Don Pedro, desde el Boulevard Miguel de la Madrid, en Manzanillo, Colima.`}
        ruta="/como-llegar"
      />

      <section className="overflow-x-clip bg-marfil pt-[calc(var(--altura-navbar)+1.5rem)] pb-16 lg:pb-8">
        <div className="contenedor grid gap-6 lg:grid-cols-[minmax(18rem,26rem)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-8">
          <Reveal inmediato className="lg:col-start-1 lg:row-start-1">
            <Pill>Cómo llegar</Pill>
            <h1 className="mt-4 text-h3 lg:mt-6">Desde el Boulevard Miguel de la Madrid</h1>
          </Reveal>

          <Reveal inmediato delay={0.06} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <figure className="lg:sticky lg:top-[calc(var(--altura-navbar)+1.5rem)]">
              {/* Cuadrado que nunca supera el alto útil de la pantalla (dvh menos navbar y márgenes) */}
              <div className="mx-auto aspect-square w-full max-w-[min(100%,calc(100dvh-var(--altura-navbar)-6rem))] overflow-hidden rounded-tarjeta border border-linea bg-marfil">
                {/* Un solo croquis visible: `display: none` saca al otro del árbol de accesibilidad */}
                <Croquis encuadre="cercano" className="block size-full lg:hidden" />
                <Croquis encuadre="amplio" className="hidden size-full lg:block" />
              </div>
              <figcaption className="mx-auto mt-2 max-w-[min(100%,calc(100dvh-var(--altura-navbar)-6rem))] text-legal text-vino-70">
                Croquis ilustrativo, no está a escala exacta. Datos de calles © colaboradores de OpenStreetMap.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal inmediato delay={0.1} className="lg:col-start-1 lg:row-start-2">
            <ol className="space-y-5">
              {pasos.map((paso, i) => (
                <li key={paso} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-pill bg-vino text-etiqueta font-semibold text-marfil">
                    {i + 1}
                  </span>
                  <p className="text-cuerpo">{paso}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-col items-start gap-3">
              <Boton
                href={site.mapsUrl}
                externo
                variante="vino"
                icono={<Navigation className="size-5" strokeWidth={1.5} aria-hidden="true" />}
              >
                Abrir en Google Maps
              </Boton>
              <Link
                href="/#ubicacion"
                className="inline-flex min-h-11 items-center gap-2 text-etiqueta font-semibold underline underline-offset-4 hover:no-underline"
              >
                <ArrowLeft className="size-5" strokeWidth={1.5} aria-hidden="true" />
                Volver a Ubicación
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
