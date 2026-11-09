import type { AppProps } from "next/app";
import Head from "next/head";

import Layout from "@/components/layout/Layout";
import { variablesTipografia } from "@/lib/fonts";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/*
          Variables de fuente en :root (ver lib/fonts.ts). Se inyecta como <style> plano en vez
          de styled-jsx: el contenido es estático y así no entra styled-jsx al bundle del cliente.
        */}
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
