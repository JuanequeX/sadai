import { readFileSync } from "node:fs";
import { join } from "node:path";

import { Head, Html, Main, NextScript } from "next/document";

/*
 * CSS de página inline en producción (docs/rebranding/PERFORMANCE-MOVIL.md).
 *
 * - El CSS global (Tailwind, ~9 KB gz) sigue como <link>: se cachea entre páginas y, si se
 *   mete inline, el HTML de la home pasa de ~14 KB gz (una vuelta de TCP) y el FCP simulado
 *   empeora (0.66 → 0.82 s en móvil, medido).
 * - El CSS propio de cada página (CSS modules, 0.7–1.8 KB gz) va como <style> y se ahorra
 *   una petición que bloqueaba el render. `experimental.inlineCss` solo existe en App Router.
 * - `data-n-href` es la marca que usa el router de Pages (next/dist/client/index.js) para
 *   activar/desactivar el CSS de cada página al navegar con next/link; con ella la
 *   navegación del cliente funciona igual que con el <link data-n-p> original.
 * - En dev, o si el archivo no se puede leer, se usa el <link> de siempre.
 */
type ArchivosDocumento = Parameters<Head["getCssLinks"]>[0];

class HeadCssInline extends Head {
  getCssLinks(files: ArchivosDocumento) {
    if (process.env.NODE_ENV !== "production") return super.getCssLinks(files);
    const compartidos = new Set(files.sharedFiles);
    const dePagina = files.allFiles.filter((f) => f.endsWith(".css") && !compartidos.has(f));
    try {
      const estilos = dePagina.map((f) => (
        <style
          key={f}
          data-n-href={`/_next/${f}`}
          dangerouslySetInnerHTML={{
            __html: readFileSync(join(process.cwd(), ".next", f), "utf8").replace(
              /\/\*# sourceMappingURL=.*?\*\//g,
              "",
            ),
          }}
        />
      ));
      const globales =
        super.getCssLinks({ ...files, allFiles: files.allFiles.filter((f) => !dePagina.includes(f)) }) ?? [];
      return [...globales, ...estilos];
    } catch {
      return super.getCssLinks(files);
    }
  }
}

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
      <HeadCssInline>
        {/* SVG para navegadores modernos; .ico como respaldo */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#440019" />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: ESTILOS_SIN_JS }} />
        </noscript>
      </HeadCssInline>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
