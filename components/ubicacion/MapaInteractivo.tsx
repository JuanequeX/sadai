import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

import { mapaEmbedSrc, site } from "@/lib/site-config";

/**
 * Margen con el que se monta el iframe antes de que el contenedor llegue al viewport.
 * Pequeño a propósito: el `loading="lazy"` nativo de Chrome usa umbrales de 1250–4000 px
 * según la conexión, y en escritorio eso cargaba Google Maps (y sus cookies de terceros)
 * con la página recién abierta, sin que nadie hubiera bajado a Ubicación.
 * Ver docs/rebranding/BEST-PRACTICES.md.
 */
const MARGEN = "200px 0px";

/**
 * Mapa interactivo de Google que solo se monta cuando la sección entra al viewport.
 * Mientras tanto, un placeholder del mismo tamaño (sin CLS, sin botón). Sin JS, un enlace
 * a Google Maps dentro del mismo contenedor.
 */
export default function MapaInteractivo() {
  const ref = useRef<HTMLDivElement>(null);
  const [montado, setMontado] = useState(false);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    const el = ref.current;
    // IntersectionObserver existe en todos los navegadores que soporta el sitio (CSS con
    // aspect-ratio, :focus-visible…), así que no hay rama de respaldo.
    if (!el) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        setMontado(true);
        observador.disconnect();
      },
      { rootMargin: MARGEN },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] overflow-hidden rounded-tarjeta border border-rosa-75 bg-vino-80 lg:aspect-[16/11]"
    >
      {/* Placeholder decorativo: ocupa el mismo hueco y se tapa cuando el mapa termina de cargar. */}
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center text-rosa-75">
        <MapPin className="size-10" strokeWidth={1.25} />
      </div>

      <noscript>
        <a
          href={site.mapsUrl}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-vino-80 p-6 text-center text-etiqueta font-semibold text-marfil underline underline-offset-4"
        >
          <MapPin className="size-10 text-rosa-75" strokeWidth={1.25} aria-hidden="true" />
          Ver la ubicación en Google Maps
        </a>
      </noscript>

      {montado && (
        <iframe
          src={mapaEmbedSrc}
          title={`Mapa interactivo con la ubicación de ${site.marca}`}
          onLoad={() => setCargado(true)}
          className={`relative size-full border-0 transition-opacity duration-500 motion-reduce:transition-none ${
            cargado ? "opacity-100" : "opacity-0"
          }`}
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
    </div>
  );
}
