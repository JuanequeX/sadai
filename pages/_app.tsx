import type { AppProps } from "next/app";
import Head from "next/head";
import { Great_Vibes, Jost, Playfair_Display } from "next/font/google";

import Layout from "@/components/layout/Layout";
import "@/styles/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--fuente-titulo",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--fuente-cuerpo",
  display: "swap",
});

// La firma que imita el wordmark del logo. Solo existe en weight 400.
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--fuente-firma",
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
 */
const variablesTipografia = `:root{--fuente-titulo:${playfair.style.fontFamily};--fuente-cuerpo:${jost.style.fontFamily};--fuente-firma:${greatVibes.style.fontFamily};}`;

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
