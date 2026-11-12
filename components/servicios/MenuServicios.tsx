import { useRef, type KeyboardEvent } from "react";

import Recurso, { type NombreRecurso } from "@/components/marca/Recurso";
import type { Categoria } from "@/lib/menu-servicios";
import { useCategoriaHash } from "@/lib/useCategoriaHash";

import FilaServicio from "./FilaServicio";
import NotasMenu from "./NotasMenu";
import styles from "./MenuServicios.module.scss";

const RECURSO_CATEGORIA: Record<Categoria["recurso"], NombreRecurso> = {
  "recurso-04": "una",
  "recurso-03": "espiral",
  "recurso-05": "destello",
};

type MenuServiciosProps = {
  categorias: readonly Categoria[];
  notas: readonly string[];
};

/**
 * Menú de servicios con pestañas (WAI-ARIA APG Tabs, activación automática).
 *
 * Los tres paneles salen en el HTML (SEO; sin JS el <noscript> de _document los apila).
 * Solo el panel activo ocupa espacio (alto dinámico, sin huecos). En móvil/tablet las notas
 * van ARRIBA de las pestañas: las clientas deben leerlas antes de elegir. En desktop van en
 * la columna derecha, sticky.
 * El id de cada pestaña (#servicios-pies) es el destino de los enlaces profundos del footer.
 */
export default function MenuServicios({ categorias, notas }: MenuServiciosProps) {
  const ids = categorias.map((c) => c.id);
  const [activa, seleccionar] = useCategoriaHash(ids, ids[0]);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const alPresionar = (e: KeyboardEvent<HTMLDivElement>) => {
    const actual = ids.indexOf(activa);
    let siguiente: number | null = null;
    if (e.key === "ArrowRight") siguiente = (actual + 1) % ids.length;
    else if (e.key === "ArrowLeft") siguiente = (actual - 1 + ids.length) % ids.length;
    else if (e.key === "Home") siguiente = 0;
    else if (e.key === "End") siguiente = ids.length - 1;
    if (siguiente === null) return;
    e.preventDefault();
    seleccionar(ids[siguiente]);
    refs.current[siguiente]?.focus();
  };

  return (
    <div className="contenedor grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      {/* Notas primero en el DOM: en móvil quedan arriba y se leen antes que las pestañas. */}
      {/* lg:self-stretch: la columna mide lo mismo que el menú y deja recorrido al sticky de NotasMenu (con items-start medía lo que las notas y el sticky no se movía). */}
      <div className="mx-auto w-full max-w-[40rem] lg:order-last lg:col-span-4 lg:max-w-none lg:self-stretch">
        <NotasMenu notas={notas} />
      </div>

      <div className="mx-auto w-full max-w-[40rem] lg:col-span-8 lg:max-w-none">
        <div
          role="tablist"
          aria-label="Categorías de servicios"
          data-tablist-servicios
          onKeyDown={alPresionar}
          className="grid grid-cols-3 gap-2 sm:flex sm:justify-center lg:justify-start"
        >
          {categorias.map((c, i) => {
            const seleccionada = c.id === activa;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`servicios-${c.id}`}
                aria-selected={seleccionada}
                aria-controls={`panel-servicios-${c.id}`}
                tabIndex={seleccionada ? 0 : -1}
                onClick={() => seleccionar(c.id)}
                className={`inline-flex min-h-11 min-w-0 flex-wrap items-center justify-center gap-x-1.5 rounded-pill border border-vino px-2 text-center text-etiqueta leading-tight font-semibold transition-colors duration-200 min-[22.5rem]:gap-x-2 min-[22.5rem]:px-4 sm:px-5 ${
                  seleccionada ? "bg-vino text-rosa" : "text-vino hover:bg-rosa-claro"
                }`}
              >
                <Recurso nombre={RECURSO_CATEGORIA[c.recurso]} className="hidden h-4 w-auto sm:block" />
                {c.nombre}
                <span aria-hidden="true">({c.servicios.length})</span>
                <span className="sr-only">, {c.servicios.length} servicios</span>
              </button>
            );
          })}
        </div>

        <div className={`${styles.halo} mt-6`}>
          {categorias.map((c) => (
            <div
              key={c.id}
              role="tabpanel"
              id={`panel-servicios-${c.id}`}
              aria-labelledby={`servicios-${c.id}`}
              data-panel-servicios
              data-activo={c.id === activa || undefined}
              className={styles.panel}
            >
              <h3 className="sr-only">{c.nombre}</h3>
              <div className="rounded-tarjeta border border-vino bg-marfil px-4 py-2 sm:px-6 sm:py-3">
                <ul>
                  {c.servicios.map((s) => (
                    <FilaServicio key={s.id} servicio={s} categoria={c} />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
