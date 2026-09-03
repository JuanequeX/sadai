import Head from "next/head";

import CallToAction from "@/components/sections/CallToAction";
import Hero from "@/components/sections/Hero";
import Servicios from "@/components/sections/Servicios";
import SobreMi from "@/components/sections/SobreMi";
import Ubicacion from "@/components/sections/Ubicacion";
import CurvaFluida from "@/components/ui/CurvaFluida";
import Marquee from "@/components/ui/Marquee";
import { site } from "@/lib/site-config";

const frases = [
  "Estudio privado",
  "Uñas artísticas",
  "Manzanillo, Colima",
  "Solo con cita",
];

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${site.nombre} | Estudio privado de uñas en Manzanillo`}</title>
        <meta name="description" content={site.descripcion} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_MX" />
        <meta property="og:title" content={`${site.nombre} | ${site.tagline}`} />
        <meta property="og:description" content={site.descripcion} />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <Hero />

      {/*
        El marquee entra en periwinkle y no en vino: pegado al hero oscuro,
        una banda vino se fundiría con él y el corte desaparecería. Además es
        el uso correcto de este color — superficie amplia, con el texto en
        vino encima (6.48:1), nunca al revés.
      */}
      <Marquee items={frases} />

      {/* Cada curva lleva el color de la sección de abajo y el fondo de la de arriba */}
      <CurvaFluida fondo="var(--color-periwinkle)" color="var(--color-crema)" />

      <SobreMi />
      <CurvaFluida fondo="var(--color-crema)" color="var(--color-rosa)" flip />

      <Servicios />
      <CurvaFluida fondo="var(--color-rosa)" color="var(--color-crema)" />

      <Ubicacion />
      <CallToAction />
    </>
  );
}
