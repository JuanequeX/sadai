import type { AppProps } from "next/app";
import Head from "next/head";
import { DM_Sans, Noto_Serif_Display } from "next/font/google";

import Layout from "@/components/layout/Layout";
import "@/styles/globals.css";

/*
 * La serif de alto contraste de la propuesta. Se carga también la itálica
 * porque los titulares de la identidad van en cursiva, no en redonda: es el
 * rasgo que define su voz.
 */
const notoSerif = Noto_Serif_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--fuente-titulo",
  display: "swap",
});

const dmSans = DM_Sans({
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
 * Ya no hay fuente de firma: la identidad sustituye la script tipográfica por
 * el logotipo dibujado, que vive en public/ como imagen.
 */
const variablesTipografia = `:root{--fuente-titulo:${notoSerif.style.fontFamily};--fuente-cuerpo:${dmSans.style.fontFamily};}`;

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
