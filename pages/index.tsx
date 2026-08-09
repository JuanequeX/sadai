import Head from "next/head";

import CallToAction from "@/components/sections/CallToAction";
import Hero from "@/components/sections/Hero";
import Servicios from "@/components/sections/Servicios";
import SobreMi from "@/components/sections/SobreMi";
import Ubicacion from "@/components/sections/Ubicacion";
import Marquee from "@/components/ui/Marquee";
import WaveDivider from "@/components/ui/WaveDivider";
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
        <meta property="og:image" content="/logo-sadai.png" />
      </Head>

      <Hero />

      <Marquee items={frases} />
      {/* Cada ola lleva el color de la sección de abajo y el fondo de la de arriba */}
      <WaveDivider fondo="var(--color-cacao)" color="var(--color-arena)" />

      <SobreMi />
      <WaveDivider fondo="var(--color-arena)" color="var(--color-rosa)" />

      <Servicios />
      <WaveDivider fondo="var(--color-rosa)" color="var(--color-crema)" />

      <Ubicacion />
      <CallToAction />
    </>
  );
}
