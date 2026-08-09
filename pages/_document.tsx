import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es-MX">
      <Head>
        {/* SVG para navegadores modernos; .ico como respaldo */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#F4C9D6" />
        {/*
          Las secciones aparecen con motion al entrar en pantalla, así que
          salen del servidor en opacity:0. Sin JS nunca se revelarían.
        */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "[data-reveal]{opacity:1!important;transform:none!important}",
            }}
          />
        </noscript>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
