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
        La página es clara de principio a fin, como la propuesta. El marquee y
        el cierre son las dos únicas franjas en vino: sirven de respiro y de
        anclaje, no de tono dominante.
      */}
      <Marquee items={frases} />

      {/* Cada curva lleva el color de la sección de abajo y el fondo de la de arriba */}
      <CurvaFluida fondo="var(--color-vino)" color="var(--color-crema)" />

      <SobreMi />
      <CurvaFluida fondo="var(--color-crema)" color="var(--color-rosa)" flip />

      <Servicios />
      <CurvaFluida fondo="var(--color-rosa)" color="var(--color-arena)" />

      <Ubicacion />
      <CallToAction />
    </>
  );
}
