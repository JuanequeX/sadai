import { ArrowUpRight } from "lucide-react";

import Recurso from "@/components/marca/Recurso";
import {
  MOSTRAR_DESCRIPCIONES,
  formatearPrecio,
  precioAccesible,
  type Categoria,
  type Servicio,
} from "@/lib/menu-servicios";
import { crearMensajeServicio, crearWhatsappHref } from "@/lib/site-config";

/** Una fila del menú: viñeta · nombre ···· precio · Agendar. */
export default function FilaServicio({ servicio, categoria }: { servicio: Servicio; categoria: Categoria }) {
  const { precio } = servicio;
  const valor = precio.tipo === "fijo" ? precio.monto : precio.desde;

  return (
    <li className="relative grid min-h-11 grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 border-b border-linea py-3 last:border-0">
      {/* items-center: viñeta, nombre, precio y botón comparten el centro de la primera fila
          (con baseline, el texto quedaba arriba del centro del botón de 44 px). */}
      <Recurso nombre="destello" className="size-3 text-vino" />
      {/* minmax(0,1fr) + min-w-0: a 320 px "semipermanente" no ensancha la tarjeta; se divide con guion. */}
      <span className="flex min-w-0 items-baseline text-menu">
        <span className="min-w-0 hyphens-auto [overflow-wrap:anywhere]">{servicio.nombre}</span>
        <span aria-hidden="true" className="mx-2 hidden min-w-4 flex-1 -translate-y-[0.3em] border-b border-dotted border-linea min-[22.5rem]:block" />
      </span>
      <data value={valor} className="text-menu font-semibold whitespace-nowrap tabular-nums">
        <span aria-hidden="true">{formatearPrecio(precio)}</span>
        <span className="sr-only">{precioAccesible(precio)}</span>
      </data>
      <a
        href={crearWhatsappHref(crearMensajeServicio(servicio.nombre, categoria.nombre))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Agendar ${servicio.nombre}, ${categoria.nombre.toLowerCase()} (se abre en otra pestaña)`}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill text-etiqueta font-semibold text-vino transition-colors duration-200 after:absolute after:inset-0 sm:min-w-0 sm:border sm:border-vino sm:px-4 sm:after:hidden sm:hover:bg-vino sm:hover:text-marfil"
      >
        <ArrowUpRight className="size-5 sm:hidden" strokeWidth={1.5} aria-hidden="true" />
        <span className="hidden sm:inline">Agendar</span>
      </a>
      {MOSTRAR_DESCRIPCIONES && servicio.descripcion ? (
        <p className="col-start-2 col-end-4 -mt-1 text-pequeno text-vino-70">{servicio.descripcion}</p>
      ) : null}
    </li>
  );
}
