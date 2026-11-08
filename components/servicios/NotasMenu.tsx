import { Plus } from "lucide-react";

import Recurso from "@/components/marca/Recurso";

function ListaNotas({ notas, className = "" }: { notas: readonly string[]; className?: string }) {
  return (
    <ul className={`space-y-3 text-pequeno ${className}`}>
      {notas.map((nota) => (
        <li key={nota} className="flex gap-3">
          <Recurso nombre="destello" className="mt-1 size-3 shrink-0 text-vino" />
          <span>{nota}</span>
        </li>
      ))}
    </ul>
  );
}

function Firma() {
  return (
    <p aria-hidden="true" className="mt-6 flex items-center justify-center gap-3 text-etiqueta font-semibold">
      <Recurso nombre="una" className="h-6 w-auto text-vino" />
      Artistic Nails
      <Recurso nombre="espiral" className="h-6 w-auto text-vino" />
    </p>
  );
}

/**
 * "Notas importantes": columna lateral sticky en desktop; en móvil/tablet va arriba de las
 * pestañas, abierta por defecto (se puede plegar) para que se lea antes de elegir servicio.
 */
export default function NotasMenu({ notas }: { notas: readonly string[] }) {
  return (
    <>
      <aside
        aria-labelledby="notas-titulo"
        className="hidden rounded-tarjeta border border-vino p-6 lg:sticky lg:top-[calc(var(--altura-navbar)+1.5rem)] lg:block"
      >
        <h3 id="notas-titulo" className="text-h3">
          Notas importantes
        </h3>
        <ListaNotas notas={notas} className="mt-5" />
        <Firma />
      </aside>

      <details open className="group rounded-tarjeta border border-vino lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-semibold [&::-webkit-details-marker]:hidden">
          Notas importantes
          {/* Ícono SVG en caja cuadrada: gira sobre su centro (el glifo "+" de texto se
              descuadraba porque su centro visual no coincide con el de su caja de línea). */}
          <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center">
            <Plus
              className="size-5 origin-center transition-transform duration-200 ease-out group-open:rotate-45 motion-reduce:transition-none"
              strokeWidth={2}
            />
          </span>
        </summary>
        <div className="px-5 pb-5">
          <ListaNotas notas={notas} className="sm:grid sm:grid-cols-2 sm:gap-x-8 sm:space-y-0 sm:gap-y-3" />
          <Firma />
        </div>
      </details>
    </>
  );
}
