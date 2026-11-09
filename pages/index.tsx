import Head from "next/head";

import Metadatos from "@/components/layout/Metadatos";
import CallToAction from "@/components/sections/CallToAction";
import Hero from "@/components/sections/Hero";
import Servicios from "@/components/sections/Servicios";
import SobreMi from "@/components/sections/SobreMi";
import Ubicacion from "@/components/sections/Ubicacion";
import Marquee from "@/components/ui/Marquee";
import { crearJsonLdNailSalon } from "@/lib/datos-estructurados";
import { site } from "@/lib/site-config";

const frases = [
  "Diseños con identidad",
  "Arte en cada detalle",
  "Una experiencia para ti",
  "Sofisticación sin pretensiones",
  "Manzanillo, Colima",
  "Solo con cita",
];

export default function Home() {
  return (
    <>
      <Metadatos
        titulo={`${site.nombre} | Estudio de uñas en Manzanillo, Colima`}
        descripcion="Estudio privado de uñas artísticas en Manzanillo. Diseños personalizados, manicura, pedicura y acrílico. Agenda tu cita por WhatsApp."
        ruta="/"
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(crearJsonLdNailSalon()) }}
        />
      </Head>

      <Hero />
      <Marquee items={frases} />
      <SobreMi />
      <Servicios />
      <Ubicacion />
      <CallToAction />
    </>
  );
}
