import Head from "next/head";
import Link from "next/link";

import Isotipo from "@/components/ui/Isotipo";
import { site } from "@/lib/site-config";

export default function NoEncontrada() {
  return (
    <>
      <Head>
        <title>{`Página no encontrada | ${site.nombre}`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      {/*
        Fondo vino y no crema: el "404" grande pide el periwinkle, y ese color
        sólo alcanza contraste suficiente sobre el vino (6.48:1). Sobre crema se
        quedaría en 2.24:1.
      */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-vino px-6 text-center">
        <Isotipo className="pointer-events-none absolute -right-[18%] top-1/2 h-[70%] w-auto -translate-y-1/2 text-periwinkle opacity-15" />

        <p className="relative font-titulo text-7xl text-periwinkle md:text-8xl">
          404
        </p>
        <h1 className="relative mt-4 text-3xl text-rosa md:text-4xl">
          Esta página no existe
        </h1>
        <p className="relative mt-4 max-w-sm text-base text-rosa/80">
          Puede que el enlace haya cambiado. Vuelve al inicio y sigue desde ahí.
        </p>
        <Link
          href="/"
          className="relative mt-9 inline-flex rounded-full bg-rosa px-7 py-3.5 text-sm font-medium tracking-wide text-vino uppercase transition-colors duration-300 hover:bg-rosa-palido"
        >
          Volver al inicio
        </Link>
      </section>
    </>
  );
}
