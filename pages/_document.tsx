import { Head, Html, Main, NextScript } from "next/document";

/*
 * Sin JS: los reveals salen visibles, los tres paneles del menú se apilan y las
 * pestañas (que no funcionarían) se ocultan.
 */
const ESTILOS_SIN_JS = [
  "[data-reveal]{opacity:1!important;transform:none!important}",
  "[data-panel-servicios]{display:block!important;visibility:visible!important;opacity:1!important;position:static!important;grid-area:auto!important;margin-bottom:1.5rem}",
  "[data-tablist-servicios]{display:none!important}",
  "[data-pausa-marquee]{display:none!important}",
].join("");

export default function Document() {
  return (
    <Html lang="es-MX">
      <Head>
        {/* SVG para navegadores modernos; .ico como respaldo */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#440019" />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: ESTILOS_SIN_JS }} />
        </noscript>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
