import Link from "next/link";

import Metadatos from "@/components/layout/Metadatos";
import Recurso from "@/components/marca/Recurso";
import SimboloArtisticNails from "@/components/marca/SimboloArtisticNails";
import Boton from "@/components/ui/Boton";
import Degradado from "@/components/ui/Degradado";
import { site } from "@/lib/site-config";

import styles from "@/styles/pagina-404.module.scss";

export default function NoEncontrada() {
  return (
    <>
      <Metadatos
        titulo={`Página no encontrada | ${site.nombre}`}
        descripcion="Esta página no existe. Vuelve al inicio de Sadai, estudio de uñas artísticas en Manzanillo, Colima."
        noindex
      />

      <Degradado
        as="section"
        variante="04"
        grano
        aria-labelledby="titulo-404"
        className={`${styles.pagina} relative grid min-h-[100svh] place-items-center overflow-hidden pt-[calc(var(--altura-navbar)+1.5rem)] pb-16 text-center text-marfil`}
      >
        <Recurso
          nombre="mancha"
          className="pointer-events-none absolute -top-16 -left-24 w-[26rem] text-vino opacity-20 sm:w-[40rem]"
        />

        <div className="contenedor relative flex flex-col items-center">
          <p aria-hidden="true" className="font-titulo text-display">
            404
          </p>
          <h1 id="titulo-404" className="mt-2 text-h2">
            Esta página no existe.
          </h1>
          <p className="mt-4 max-w-[36ch] text-lead">
            Puede que el enlace haya cambiado. Vuelve al inicio y sigue desde ahí.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <Boton href="/" variante="marfil">
              Volver al inicio
            </Boton>
            <Link
              href="/#servicios"
              className="inline-flex min-h-11 items-center px-2 text-etiqueta font-semibold underline underline-offset-4 hover:no-underline"
            >
              Ver servicios
            </Link>
          </div>
          <SimboloArtisticNails className="mt-12 h-auto w-[220px] text-rosa" />
        </div>
      </Degradado>
    </>
  );
}
