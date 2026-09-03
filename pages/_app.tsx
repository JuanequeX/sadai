import type { AppProps } from "next/app";
import Head from "next/head";
import { Plus_Jakarta_Sans, STIX_Two_Text } from "next/font/google";

import Layout from "@/components/layout/Layout";
import "@/styles/globals.css";

// La serif de los titulares de la propuesta de identidad.
const stix = STIX_Two_Text({
  subsets: ["latin"],
  variable: "--fuente-titulo",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--fuente-cuerpo",
  display: "swap",
});

/*
 * Las variables van en :root y no en un div contenedor.
 * Los tokens --font-* de Tailwind se declaran en :root (@theme), así que si
 * --fuente-* viviera más abajo en el árbol esas declaraciones serían inválidas
 * y toda la tipografía caería al default del navegador.
 *
 * Se inyecta como <style> plano en vez de styled-jsx: el contenido es estático
 * y así no hace falta que styled-jsx se resuelva en el bundle del cliente.
 *
 * Ya no hay fuente de firma: la Propuesta 02 sustituye la script tipográfica
 * por el logotipo dibujado, que vive en public/ como imagen.
 */
const variablesTipografia = `:root{--fuente-titulo:${stix.style.fontFamily};--fuente-cuerpo:${jakarta.style.fontFamily};}`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <style
          id="variables-tipografia"
          dangerouslySetInnerHTML={{ __html: variablesTipografia }}
        />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
