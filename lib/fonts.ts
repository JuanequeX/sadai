/**
 * Único punto de definición de fuentes (PLAN F2.3). Nada más importa next/font.
 * Se cargan una sola vez aquí y se consumen en pages/_app.tsx como variables CSS en :root.
 */
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";

/**
 * Títulos: Established Regular (subset latin + latin-1, ver README "Assets de marca").
 *
 * Licencia: el cliente confirmó (2026-11-08) que cuenta con licencia de uso web de Established,
 * así que el woff2 subset se sirve desde el repo. El plan B de abajo queda solo como referencia.
 *
 * Glifos ausentes en la fuente: ¿ ¡ · – — … → no usarlos en títulos (el stack cae a Times New Roman).
 */
export const fuenteTitulo = localFont({
  src: "../styles/fonts/Established-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: true,
  adjustFontFallback: "Times New Roman",
  fallback: ["Times New Roman", "Georgia", "serif"],
  variable: "--fuente-titulo",
});

/** Subtítulos y cuerpo: variable (un solo archivo latin cubre 400 y 600). */
export const fuenteCuerpo = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  variable: "--fuente-cuerpo",
});

/*
 * Las variables van en :root y no en un div contenedor: los tokens --font-* de Tailwind se
 * declaran en :root (@theme), así que si --fuente-* viviera más abajo en el árbol esas
 * declaraciones serían inválidas y toda la tipografía caería al default del navegador.
 */
export const variablesTipografia = `:root{--fuente-titulo:${fuenteTitulo.style.fontFamily};--fuente-cuerpo:${fuenteCuerpo.style.fontFamily};}`;

/* Plan B (solo referencia; no se usa): serif OFL si algún día hubiera que sustituir Established.
import { Instrument_Serif } from "next/font/google";
export const fuenteTitulo = Instrument_Serif({ weight: "400", subsets: ["latin"], display: "swap", variable: "--fuente-titulo" });
*/
