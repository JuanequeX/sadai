import Head from "next/head";
import Link from "next/link";

import { site } from "@/lib/site-config";

export default function NoEncontrada() {
  return (
    <>
      <Head>
        <title>{`Página no encontrada | ${site.nombre}`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <section className="flex min-h-[100svh] flex-col items-center justify-center bg-arena px-6 text-center">
        <p className="font-titulo text-7xl italic text-vino-suave md:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-3xl text-vino md:text-4xl">
          Esta página no existe
        </h1>
        <p className="mt-4 max-w-sm text-base text-vino-suave">
          Puede que el enlace haya cambiado. Vuelve al inicio y sigue desde ahí.
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex rounded-full bg-vino px-7 py-3.5 text-sm font-medium tracking-wide text-crema uppercase transition-colors duration-300 hover:bg-vino-suave"
        >
          Volver al inicio
        </Link>
      </section>
    </>
  );
}
