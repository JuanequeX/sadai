# PLAN — Implementación del rebranding total de la landing de Sadai

- **Estado:** v1 (fase 2: plan de implementación). Fecha: 2026-11-08.
- **Rama:** `rebranding-total`. No cambiar de rama. Hacer commit **solo si el usuario lo pide**; abajo se sugieren puntos de control.
- **Insumos:** `docs/rebranding/PRD.md` (fuente de verdad del diseño; aquí se cita como "PRD §x") y este plan. `BI/` = `docs/brand-identity/` (local, no se commitea).
- **Antes de tocar fuentes o imágenes** leer `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` y `.../image.md`; las páginas `02-pages/...` son stubs que apuntan a esos. AGENTS.md: esta versión de Next trae cambios.
  - `next/image`: `priority` está **obsoleto desde v16** (image.md §priority) y lo sustituye `preload`. La doc recomienda `fetchPriority="high"` o `loading="eager"` para el LCP.
  - Con `images.unoptimized: true` la imagen "se sirve tal cual desde `src`" (image.md §unoptimized). La optimización con el loader por defecto **no está soportada** en export (`02-guides/static-exports.md` §Unsupported Features).
  - `next/font/local`: `adjustFontFallback` acepta `'Arial' | 'Times New Roman' | false` y `src` es relativo al archivo que llama al loader (font.md §src, §adjustFontFallback).
  - Precarga: si la fuente se declara en el custom App, "se precarga en todas las rutas" (font.md §Preloading). Hay que cargar cada fuente una sola vez, en un módulo de definiciones (font.md, "font definitions file").

## Decisiones abiertas: defaults e intercambio

| # | Decisión | Default implementado | Cómo se intercambia |
|---|---|---|---|
| a | Licencia de Established | Usarla vía `next/font/local` con woff2 subset en `styles/fonts/Established-Regular.woff2`, declarada **solo** en `lib/fonts.ts`; fallback métrico Times New Roman. | Cambiar el cuerpo de `fuenteTitulo` en `lib/fonts.ts` (plan B al final del archivo, comentado: `Instrument_Serif` de `next/font/google`) y borrar el woff2. Nada más importa la fuente. |
| b | ® | Versiones **sin ®**. | Constante `REGISTRADA = false` en `scripts/optimizar-assets.mjs`; ponerla en `true` y correr `pnpm assets logos iconos og` regenera componentes e íconos desde la carpeta "con marca registrada". |
| c | Instagram, nombre, dirección, horarios, duraciones | Valores actuales de `lib/site-config.ts` (`nombre: "Nails by Sadai"`, `instagram: "nailsbysadai"`, TODO de dirección y horarios intactos); `duracionMin: null`. Descripciones del menú = borradores del PRD §7.2 con `// TODO(PRD §12.6)`, visibles mediante `MOSTRAR_DESCRIPCIONES = true`. | Editar `lib/site-config.ts` / `lib/menu-servicios.ts`. Con `MOSTRAR_DESCRIPCIONES = false` se ocultan todas sin dejar hueco. |
| d | Fotografía | Solo el retrato existente, optimizado, en Sobre mí. **Hero sin foto**: panel de degradado a ancho completo (el retrato es un selfie, no encaja como hero cinematográfico). No se usan fotos de modelos. | `Hero` acepta la prop opcional `foto?: FuenteImagen`; al pasarla cambia al layout dividido 50/50 del PRD §6.2 sin más cambios. |

---

## F0 — Preparación del repo

**F0.1 `.gitignore` (primer paso, obligatorio).** Agregar al final:
```
# Brand book y assets fuente de la diseñadora (~450 MB): solo locales
/docs/brand-identity/
```
Verificación: `git status --short` no lista `docs/brand-identity`; `git check-ignore -v docs/brand-identity/Branding` responde con `.gitignore`.

**F0.2 Dependencias de desarrollo.**
`pnpm add -D sharp@0.35.3 svgo`. Se fija la misma versión de sharp que ya trae Next para no duplicar binarios. `pnpm-workspace.yaml` ya lista `sharp` en `ignoredBuiltDependencies`; sharp 0.35 usa binarios precompilados (`@img/sharp-*`), así que no requiere build.
Verificación: `node -e "require('sharp');require('svgo')"` termina sin error.

**F0.3 Mover el retrato original fuera de `public/`.**
`git mv public/sadai-retrato.png assets/fuente/sadai-retrato.png` (crea `assets/fuente/`). Así deja de copiarse a `out/` (1.8 MB). El blob ya está en el historial, de modo que moverlo no añade peso.

**F0.4 Script `package.json`.** Añadir `"assets": "node scripts/optimizar-assets.mjs"`. **No** se engancha a `build`: el CI no tiene `BI/` y las salidas se commitean.

**F0.5 Herramienta de fuentes.** Comprobado: no hay `pyftsubset` ni fontTools en el python del sistema, pero sí `uvx`. Todos los comandos de fuente usan `uvx --from 'fonttools[woff]' …`; el extra `woff` trae brotli, necesario para woff2.

---

## F1 — Pipeline de assets

Todo sale de `scripts/optimizar-assets.mjs` (Node ESM, sharp + svgo), salvo la fuente (F1.1, shell).

Interfaz: `node scripts/optimizar-assets.mjs [logos|recursos|stickers|iconos|imagenes|og|todo]`.

Al inicio, el script valida que existan `docs/brand-identity/Branding` y `assets/fuente/sadai-retrato.png`; si falta algo, termina con un mensaje claro (`process.exit(1)`).

Constantes del script:
```js
const REGISTRADA = false; // decisión (b)
const BI = "docs/brand-identity/Branding";
const COLOR = `${BI}/2. Identidad gráfica/1. Versiones a color/Versiones a color ${REGISTRADA ? "con" : "sin"} marca registrada/SVG`;
const RECURSOS = `${BI}/4. Elementos gráficos de apoyo/1. Elementos gráficos adicionales/SVG`;
const STICKERS = `${BI}/4. Elementos gráficos de apoyo/2. Stickers/SVG`;
const DEGRADADOS = `${BI}/4. Elementos gráficos de apoyo/3. Degradados`;
```
Las comillas tipográficas “ ” de los nombres de archivo van tal cual dentro de strings JS.

### F1.1 Fuente Established (subset woff2)
Ejecutar fuera del repo (el zip no se extrae dentro):
```sh
TMP="$(mktemp -d)"
unzip -q "docs/brand-identity/Branding/3. Sistema tipográfico/established-classy-and-elegant-condensed-serif-2026-04-07-05-53-32-utc.zip" -d "$TMP"
SRC="$(find "$TMP" -path '*OpenType-PS*' -name 'Established.otf' | head -1)"
mkdir -p styles/fonts
uvx --from 'fonttools[woff]' pyftsubset "$SRC" \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0152-0153,U+2018-201A,U+201C-201E,U+2022,U+2026,U+20AC" \
  --layout-features="kern,liga,dlig" \
  --name-IDs="0,1,2,3,4,5,6,7,13,14" \
  --flavor=woff2 \
  --output-file=styles/fonts/Established-Regular.woff2
```
- Fuente: la `.otf` CFF de `OpenType-PS` (el woff2 completo pesa 18 KB; el de TT, 26 KB).
- No incluir "Established Oblique".
- Se conservan los name IDs de copyright y licencia (0, 7, 13, 14).
- La copia previa en `/private/tmp/claude-501/-Users-juanequex-codebase-sumus-sadai/6ce9faa1-4d11-4938-b973-052e4c5662c5/scratchpad/fonts/established/OpenType-PS/Established.otf` sirve igual si sigue existiendo.

Verificación: `ls -l styles/fonts/Established-Regular.woff2`, objetivo ≤ 15 KB (≤ 18 KB aceptable). Revisar la cobertura con:
`uvx --from 'fonttools[woff]' python -c "from fontTools.ttLib import TTFont;f=TTFont('styles/fonts/Express.woff2'.replace('Express','Established-Regular'));c=f.getBestCmap();print(len(c),all(ord(x) in c for x in 'áéíóúñüÁÉÍÓÚÑ“”‘’…\$'))"`
Debe imprimir `True`. Recordatorio (PRD §3.2): **no existen** `¿ ¡ · – —`, y no se agregan.

🛑 **Detenerse:** antes de **fusionar a `main` o publicar** hay que confirmar la licencia web de Established. El repo es público, así que commitear el woff2 equivale a redistribuirlo. En la rama de trabajo se procede con el default.

### F1.2 Logotipos y símbolos → componentes React (`logos`)
Para cada archivo de la tabla:
1. **Bbox exacto.** Renderizar el SVG fuente con sharp a escala 4 (`sharp(buf,{density:288}).trim({threshold:1})`) y leer `info.trimOffsetLeft/Top` y el ancho y alto resultantes. Dividir entre 4 (densidad 288 ⇒ 4 px por unidad) y redondear hacia fuera a 0.5 u. Ese es el `viewBox` recortado.
   - Hacer `trim` sobre el render del archivo **"color primario"**: el fondo es transparente y el `<rect class="cls-2">` es `fill:none`.
   - Comparar con los valores aproximados del PRD §3.3 (±3 u). Si difieren más de 6 u, imprimir aviso.
2. **svgo** con: `preset-default` (con `removeViewBox: false`), `removeDimensions`, `inlineStyles` + `convertStyleToAttrs` y `removeAttrs` de `class|id|data-name|fill`. Quitar el `<rect>` de artboard.
3. **Emitir TSX** con cabecera `/* Generado por scripts/optimizar-assets.mjs — no editar a mano */`. Los `<path d>` se emiten dentro de `<svg viewBox="…" fill="currentColor" width={W} height={H}>`, donde W y H son las dimensiones del viewBox (sirven de ratio intrínseco y evitan CLS).

| Fuente (en `COLOR/`) | Destino | Nombre del componente |
|---|---|---|
| `Logotipo principal - color primario.svg` | `components/marca/Logotipo.tsx` | `Logotipo` |
| `Logotipo con tagline “Nails by” - color primario.svg` | `components/marca/LogotipoNailsBy.tsx` | `LogotipoNailsBy` |
| `Símbolo principal - color primario.svg` | `components/marca/Simbolo.tsx` | `Simbolo` |
| `Símbolo terciario con tagline - color primario.svg` | `components/marca/SimboloArtisticNails.tsx` | `SimboloArtisticNails` |
| `Símbolo secundario - color primario.svg` | solo como insumo de F1.5 (íconos) | — |

API común de los componentes de marca:
```ts
type PropsMarca = {
  className?: string;          // el tamaño se da por CSS: width fijo y height auto
  /** Nombre accesible. Si se omite, el SVG es decorativo (aria-hidden). */
  titulo?: string;             // p. ej. "Sadai"
};
// Con titulo: role="img" + aria-label={titulo} (también <title>).
// Sin titulo: aria-hidden="true" focusable="false".
// Prohibido: props de rotate/skew/filter/drop-shadow (PRD §3.3). Solo color vía currentColor.
```
Verificación: cada TSX pesa < 8 KB; `pnpm lint` limpio. Abrir en dev una página temporal **o** el Hero (F4) y comparar contra `BI/.../PNG` en 220 px: sin recortes en los trazos finos.

### F1.3 Recursos gráficos (`recursos`)
`RECURSOS/Recurso 0{1..5}.svg` → un solo archivo `components/marca/Recurso.tsx` (viewBox ya ajustado; misma limpieza svgo y `currentColor`).
```ts
export type NombreRecurso = "salpicadura" /*01*/ | "mancha" /*02*/ | "espiral" /*03*/ | "una" /*04*/ | "destello" /*05*/;
export default function Recurso(p: { nombre: NombreRecurso; className?: string }): JSX.Element; // siempre aria-hidden
```

### F1.4 Stickers (`stickers`)
`STICKERS/Sticker {04,05,06,07,08,09,10}.svg` → `public/marca/stickers/sticker-XX.svg`.
- svgo `preset-default` (conservar `viewBox`) más `prefixIds` (prefijo `stXX`) y `inlineStyles` + `convertStyleToAttrs`. Los originales usan clases `.cls-1/.cls-2` que chocarían si alguna vez se incrustan inline.
- **Se conservan los colores**; solo aparecen `#440019`, `#ffb3c3` y `#f9f8f4`.
- El script imprime un objeto `{ "04": [w,h], … }` con el viewBox de cada uno; pegarlo en `components/marca/Sticker.tsx` (F2.8).
  - Valores actuales: 04 105.65×118.7 · 05 123.55×149.44 · 06 130.65×157.36 · 07 137.38×135.68 · 08 107×162.58 · 09 121.97×165.58 · 10 109.88×151.94.

### F1.5 Íconos de app y favicon (`iconos`)
Insumo: "Símbolo secundario" ya recortado (F1.2).
- `public/favicon.svg`: `<svg viewBox="0 0 100 100"><title>Sadai</title><rect width="100" height="100" rx="22" fill="#FFB3C3"/><svg x="14" y="14" width="72" height="72" viewBox="{recorte}" preserveAspectRatio="xMidYMid meet"><path fill="#440019" d="…"/></svg></svg>`. La "S" ocupa ≈ 72 % de la caja.
- PNG con sharp, renderizando ese SVG:
  - `public/apple-touch-icon.png`: 180×180, fondo rosa **sin** transparencia ni radio; iOS redondea.
  - `public/icon-192.png` y `public/icon-512.png`: purpose `any`, fondo rosa con radio.
  - `public/icon-maskable-512.png`: fondo rosa a sangre, "S" al 56 % (zona segura del 80 %).
- `public/favicon.ico` (16/32/48) con PNG embebidos. Escritor ICO propio dentro del script (no hay ImageMagick):
```js
function pngsAIco(pngs /* [{size, buf}] */) {
  const cab = Buffer.alloc(6); cab.writeUInt16LE(0,0); cab.writeUInt16LE(1,2); cab.writeUInt16LE(pngs.length,4);
  let off = 6 + 16 * pngs.length; const dir = [], datos = [];
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size,0); e.writeUInt8(size >= 256 ? 0 : size,1);
    e.writeUInt16LE(1,4); e.writeUInt16LE(32,6); e.writeUInt32LE(buf.length,8); e.writeUInt32LE(off,12);
    dir.push(e); datos.push(buf); off += buf.length;
  }
  return Buffer.concat([cab, ...dir, ...datos]);
}
```

### F1.6 Imágenes raster (`imagenes`)
- **Retrato:** `assets/fuente/sadai-retrato.png` (1133×1600) → `public/img/sadai-retrato-{480,800,1133}.{avif,webp}`. `sharp().resize({width}).avif({quality:50,effort:6})` / `.webp({quality:75})`. Objetivo ≤ 120 KB a 800 (AVIF); si se pasa, bajar AVIF a q45. El script imprime los bytes de cada salida.
- **Degradado 03 (opcional, desactivado por defecto):** `DEGRADADOS/Degradado 03.png` → `public/img/degradado-03-{960,1920}.{avif,webp}` (AVIF q45 ≤ 60 KB a 1920). **Solo** se genera con el flag `--con-degradado-03`, si diseño pide la variante "03" (F2.7). Por defecto ningún componente lo usa.
- **Mapa:** no se genera captura (ver F4.6).

### F1.7 Imagen OG (`og`)
`public/og.jpg`, 1200×630, JPG q82 mozjpeg, ≤ 200 KB.
- Fondo: `DEGRADADOS/Degradado 04.png` con `resize(1200,630,{fit:"cover",position:"centre"})`. Es el asset oficial, con su grano real.
- Encima, el `Logotipo` en `#F9F8F4`, 560 px de ancho, centrado (render SVG → PNG con sharp y `composite`).
- Sin texto rasterizado: librsvg no tiene Established; el texto lo aportan `og:title` y `og:description`.

**Verificación F1:** `pnpm assets todo` termina con 0; `ls -l public/img public/marca/stickers public/*.png public/og.jpg`; tamaños dentro de objetivos; `git status` muestra solo salidas esperadas.
**Punto de control sugerido:** commit "Assets de marca optimizados" (si el usuario lo pide).

---

## F2 — Fundaciones (tokens, fuentes, datos, componentes base)

El build debe quedar verde al final de F2. Las secciones viejas siguen compilando gracias a los alias SCSS temporales (F2.2).

### F2.1 `styles/globals.css` (reescritura completa)
```css
@import "tailwindcss";

/* Paleta oficial (PRD §3.1). Espejo en styles/_tokens.scss. Prohibido agregar colores fuera de aquí. */
@theme {
  --color-*: initial; /* elimina la paleta por defecto de Tailwind: ningún color fuera de marca */
  --color-vino: #440019;
  --color-rosa: #ffb3c3;
  --color-marfil: #f9f8f4;
  --color-vino-hover: #5a1e33;
  --color-vino-80: #683245;
  --color-vino-70: #7a4a5b;
  --color-rosa-claro: #ffe1e7;
  --color-marfil-75: #ccbabd;
  --color-rosa-75: #d08698;
  --color-linea: rgb(68 0 25 / 0.35);
  --color-linea-clara: rgb(249 248 244 / 0.4);

  --font-titulo: var(--fuente-titulo), "Times New Roman", Georgia, serif;
  --font-cuerpo: var(--fuente-cuerpo), system-ui, sans-serif;

  /* Escala tipográfica (PRD §3.2) → utilidades text-display, text-h2, … */
  --text-display: clamp(3rem, 1.8rem + 5.6vw, 6.5rem);
  --text-display--line-height: 0.98;
  --text-display--letter-spacing: -0.01em;
  --text-h2: clamp(2.5rem, 1.7rem + 3.6vw, 4.5rem);
  --text-h2--line-height: 1.02;
  --text-h2--letter-spacing: -0.005em;
  --text-h3: clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem);
  --text-h3--line-height: 1.08;
  --text-subtitulo: clamp(1.25rem, 1.05rem + 0.9vw, 1.875rem);
  --text-subtitulo--line-height: 1.15;
  --text-subtitulo--letter-spacing: -0.015em;
  --text-lead: clamp(1.0625rem, 1rem + 0.35vw, 1.25rem);
  --text-lead--line-height: 1.55;
  --text-cuerpo: 1rem;
  --text-cuerpo--line-height: 1.65;
  --text-menu: clamp(1rem, 0.95rem + 0.3vw, 1.125rem);
  --text-menu--line-height: 1.4;
  --text-etiqueta: 0.8125rem;
  --text-etiqueta--line-height: 1.2;
  --text-etiqueta--letter-spacing: 0.02em;
  --text-pequeno: 0.875rem;
  --text-pequeno--line-height: 1.5;
  --text-legal: 0.75rem;
  --text-legal--line-height: 1.5;

  --radius-pill: 999px;
  --radius-tarjeta: 1.5rem;
  --ease-marca: cubic-bezier(0.22, 1, 0.36, 1);
}

@layer base {
  :root {
    /* Navbar: el logotipo mide 220 px de ancho (≈ 76 px de alto, PRD §3.3) + 12 px arriba y abajo.
       Espejo en lib/layout.ts (ALTURA_NAVBAR_PX). */
    --altura-navbar: 6.25rem;
    --espacio-seccion: clamp(4.5rem, 3rem + 6vw, 9rem);
    --gutter: 1rem;

    /* Degradados de marca (PRD §3.4) */
    --grad-01: radial-gradient(ellipse 60% 70% at 12% 88%, #5e1427 0%, transparent 70%), radial-gradient(ellipse 55% 60% at 95% 5%, #d896a3 0%, transparent 70%), linear-gradient(135deg, #7c3647 0%, #9d5a68 55%, #b4717e 100%);
    --grad-02: radial-gradient(ellipse 70% 85% at 98% 45%, #f2b2bf 0%, #d896a5 30%, transparent 65%), radial-gradient(ellipse 120% 40% at 40% 70%, rgb(222 158 171 / 0.35) 0%, transparent 60%), linear-gradient(110deg, #5b1224 0%, #70283b 35%, #a35e6e 62%, #d896a5 100%);
    --grad-04: radial-gradient(ellipse 45% 50% at 48% 52%, #db9ba8 0%, #c58592 35%, transparent 72%), linear-gradient(180deg, #b3737f 0%, #a96773 40%, #7a3146 82%, #63192c 100%);
    --grad-05: linear-gradient(120deg, #914d5e 0%, #b47380 28%, #c98995 48%, #a15c69 68%, #d999a5 100%);
    --grad-aura: radial-gradient(circle at 50% 50%, #f4a9ba 0%, #e8a0b2 16%, #8c3a52 34%, #5a1a2e 46%, transparent 62%), linear-gradient(180deg, #ffb3c3 0%, #f2a9bb 30%, #b8687d 62%, #440019 100%);
    --grano: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  @media (min-width: 40rem) { :root { --gutter: 1.5rem; } }
  @media (min-width: 64rem) { :root { --gutter: 2.5rem; } }

  html { scroll-behavior: smooth; scroll-padding-top: var(--altura-navbar); }
  body { background-color: var(--color-marfil); color: var(--color-vino); font-family: var(--font-cuerpo); font-size: var(--text-cuerpo); line-height: 1.65; -webkit-font-smoothing: antialiased; }
  h1, h2, h3 { font-family: var(--font-titulo); font-weight: 400; font-synthesis: none; text-wrap: balance; }
  ::selection { background-color: var(--color-rosa); color: var(--color-vino); }
  :focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }

  /* Reveal (components/ui/Reveal.tsx): estado inicial y final por CSS */
  [data-reveal] { opacity: 0; transform: translateY(16px); transition: opacity 600ms var(--ease-marca), transform 600ms var(--ease-marca); transition-delay: var(--retraso, 0ms); }
  [data-reveal][data-visible] { opacity: 1; transform: none; }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    [data-reveal] { transform: none; transition-duration: 1ms; transition-delay: 0ms; }
    *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; }
  }
}

@utility contenedor { width: 100%; max-width: 80rem; margin-inline: auto; padding-inline: var(--gutter); }
@utility seccion { padding-block: var(--espacio-seccion); }
/* Grano: ::before con z-index -1 dentro de un contexto aislado → queda sobre el fondo y bajo el contenido */
@utility grano {
  position: relative; isolation: isolate;
  &::before { content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none; opacity: 0.12; mix-blend-mode: overlay; background-image: var(--grano); background-size: 180px; }
}
```
Nota: `--grad-03` no se define (variante por imagen, opcional). Las clases `text-h2` etc. llevan line-height y tracking incluidos.

### F2.2 `styles/_tokens.scss` (reescritura)
```scss
// Espejo de styles/globals.css (@theme). Si cambia un hex aquí, cámbialo allá.
$vino: #440019;  $rosa: #ffb3c3;  $marfil: #f9f8f4;
$vino-hover: #5a1e33;  $vino-80: #683245;  $vino-70: #7a4a5b;
$rosa-claro: #ffe1e7;  $marfil-75: #ccbabd;  $rosa-75: #d08698;
$linea: rgb(68 0 25 / 0.35);  $linea-clara: rgb(249 248 244 / 0.4);
$radio-pill: 999px;  $radio-tarjeta: 1.5rem;
$ease-marca: cubic-bezier(0.22, 1, 0.36, 1);

$bp-sm: 40rem; $bp-md: 48rem; $bp-lg: 64rem; $bp-xl: 80rem;
@mixin sm { @media (min-width: $bp-sm) { @content; } }
@mixin md { @media (min-width: $bp-md) { @content; } }
@mixin lg { @media (min-width: $bp-lg) { @content; } }
@mixin xl { @media (min-width: $bp-xl) { @content; } }
@mixin sin-movimiento { @media (prefers-reduced-motion: reduce) { @content; } }
@mixin con-movimiento { @media (prefers-reduced-motion: no-preference) { @content; } }

// LEGACY — solo para que compilen los módulos viejos durante F2–F5. BORRAR en F7.1.
$cacao: $vino; $cacao-suave: $vino-80; $crema: $marfil; $arena: $rosa-claro;
```

### F2.3 `lib/fonts.ts` (nuevo; único punto de fuentes)
```ts
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";

/** Títulos. Licencia por confirmar (PLAN decisión a). Para sustituirla, cambiar SOLO esta constante. */
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

export const variablesTipografia = `:root{--fuente-titulo:${fuenteTitulo.style.fontFamily};--fuente-cuerpo:${fuenteCuerpo.style.fontFamily};}`;

/* Plan B si no hay licencia web de Established (elegir con diseño):
import { Instrument_Serif } from "next/font/google";
export const fuenteTitulo = Instrument_Serif({ weight: "400", subsets: ["latin"], display: "swap", variable: "--fuente-titulo" });
*/
```
🛑 Si `pnpm build` falla al descargar Google Fonts (sandbox sin red), **no** forzar: cambiar `fuenteCuerpo` a `localFont` con `PlusJakartaSans-VariableFont_wght.ttf` del zip OFL. Convertirlo con `uvx --from 'fonttools[woff]' pyftsubset … --unicodes=U+0020-007E,U+00A0-00FF,U+2018-201F,U+2026,U+20AC --flavor=woff2 --output-file=styles/fonts/PlusJakartaSans-Variable.woff2` y usar `weight: "200 800"`. Commitear también `OFL.txt` como `styles/fonts/OFL-PlusJakartaSans.txt`.

### F2.4 `pages/_app.tsx`
- Quitar las importaciones de `Great_Vibes`, `Jost` y `Playfair_Display`.
- Importar `variablesTipografia` de `@/lib/fonts` y mantener el `<style id="variables-tipografia">` en `:root` (patrón actual, PRD §1.4).
- Mover aquí, una sola vez: `<meta name="viewport" content="width=device-width, initial-scale=1" />`. Quitarlo de `index.tsx` y `datos-bancarios.tsx`.

### F2.5 `pages/_document.tsx`
- `theme-color` → `#440019`.
- Íconos: mantener `favicon.svg` + `.ico` + `apple-touch-icon` + manifest.
- `<noscript>` ampliado:
```
[data-reveal]{opacity:1!important;transform:none!important}
[data-panel-servicios]{visibility:visible!important;position:static!important}
[data-tablist-servicios]{display:none!important}
```
  Sin JS se ven los tres paneles del menú apilados (F4.5).
- `<body className="antialiased">` se mantiene.

### F2.6 Datos
- **`lib/site-config.ts`:**
  - Quitar el `✨` de `mensajeWhatsApp` → `"Hola Sadai, me gustaría agendar una cita"`.
  - Agregar `marca: "Sadai"` (nombre accesible de logotipos) y `url: "https://sadai.mx"`.
  - Agregar `mensajeCotizacion: "Hola Sadai, quiero cotizar un diseño. Te envío mi foto de inspiración y la técnica que me gusta."`.
  - Agregar el helper `crearMensajeServicio = (servicio: string, categoria: string) => \`Hola Sadai, me gustaría agendar: ${servicio} (${categoria}).\``.
  - Agregar `telefonoHref = \`tel:+52${site.telefonoVisible.replace(/\s/g, "")}\`` (hoy está duplicado en el Footer).
  - Mantener todo lo demás y los TODO. Sobre `nombre` agregar `// TODO(PRD §12.5): ¿"Sadai Artistic Nails"?`, y sobre `instagram`, `// TODO(PRD §12.4): mockups usan sadai.artisticnails`.
- **`lib/menu-servicios.ts` (nuevo):** copiar literalmente PRD §7.2 (tipos, `categorias`, `notasMenu`, `formatearPrecio`, `moneda`). Añadir:
  - `export const MOSTRAR_DESCRIPCIONES = true; // TODO(PRD §12.6): borradores sin aprobar`
  - `export const precioAccesible = (p: Precio) => p.tipo === "fijo" ? \`${p.monto} pesos\` : \`de ${p.desde} a ${p.hasta} pesos\``
  - `export const idsCategorias = categorias.map(c => c.id)`
  - `rangoPrecios()`, que devuelve `"$80 – $600"` calculado (para JSON-LD).
- **`lib/layout.ts` (nuevo):** `export const ALTURA_NAVBAR_PX = 100; // espejo de --altura-navbar`.
- **`lib/datos-estructurados.ts` (nuevo):** `crearJsonLdNailSalon()` → objeto `@context: https://schema.org`, `@type: NailSalon`, con:
  - `name: site.nombre`, `url: site.url`, `image` y `logo` absolutos (`/og.jpg`, `/icon-512.png`), `telephone: "+52" + …`.
  - `address` (`PostalAddress`, `addressLocality: "Manzanillo"`, `addressRegion: "Colima"`, `addressCountry: "MX"`, sin calle mientras siga el TODO).
  - `geo` (`GeoCoordinates` desde `site.coords`), `priceRange: rangoPrecios()`, `sameAs: [site.instagramUrl]`.
  - `hasOfferCatalog`: `OfferCatalog` por categoría con `itemListElement: Offer { itemOffered: Service{name}, priceCurrency: "MXN", price }`; para rango, `priceSpecification: { @type: PriceSpecification, minPrice, maxPrice, priceCurrency }`.
  - **Sin** `openingHoursSpecification` mientras los horarios sigan en TODO.

### F2.7 Componentes base (`components/ui/`, `components/marca/`)
| Archivo | Acción | API / notas |
|---|---|---|
| `components/layout/Metadatos.tsx` | nuevo | `{ titulo: string; descripcion: string; ruta?: string; noindex?: boolean }`. Emite `<title>`, description, `robots noindex` si aplica, `canonical` absoluto (`site.url + ruta`) solo si es indexable, OG completo (`og:type website`, `og:locale es_MX`, `og:site_name`, `og:url`, `og:image https://sadai.mx/og.jpg` + `og:image:width 1200`/`height 630`/`alt`) y `twitter:card summary_large_image`. |
| `components/ui/Boton.tsx` | nuevo | `{ href?: string; externo?: boolean; variante: "vino" \| "marfil" \| "contorno-vino" \| "contorno-marfil"; tamano?: "md" \| "sm"; icono?: ReactNode; iconoFinal?: ReactNode; className?; children; onClick?; type? }`. Si hay `href` renderiza `<a>` (con `externo` agrega `target="_blank" rel="noopener noreferrer"` + `<span className="sr-only"> (se abre en otra pestaña)</span>`); si no, `<button>`. Base: `inline-flex items-center justify-center gap-2 min-h-11 rounded-pill px-6 text-etiqueta font-semibold transition-colors duration-200`. Variantes: vino = `bg-vino text-marfil hover:bg-vino-hover`; marfil = `bg-marfil text-vino hover:bg-rosa-claro`; contorno-vino = `border border-vino text-vino hover:bg-vino hover:text-marfil`; contorno-marfil = `border border-marfil text-marfil hover:bg-marfil hover:text-vino`. **Sin mayúsculas sostenidas.** |
| `components/ui/BotonWhatsApp.tsx` | reescribir sobre `Boton` | Mantiene la API `{ children?, variante?, className?, icono?, mensaje? }`; variantes → `"vino" (default) \| "marfil" \| "contorno-vino" \| "contorno-marfil"`; default `children = "Agenda una cita"`; `externo` siempre. |
| `components/ui/Pill.tsx` | nuevo | Etiqueta no interactiva: `{ children; tono?: "claro" \| "oscuro"; as?: "p" \| "span" }` → `inline-flex min-h-8 items-center rounded-pill border px-4 text-etiqueta font-semibold`; claro = `border-linea text-vino`, oscuro = `border-linea-clara text-marfil`. |
| `components/ui/Imagen.tsx` | nuevo | `{ base: string; anchos: number[]; ancho: number; alto: number; alt: string; sizes: string; prioridad?: boolean; className?: string; classNameImg?: string }` → `<picture><source type="image/avif" srcSet="base-480.avif 480w, …"/><source type="image/webp" …/><img src={base-${anchos[1]}.webp} width height alt sizes loading={prioridad?"eager":"lazy"} fetchPriority={prioridad?"high":"auto"} decoding="async"/></picture>`. Lleva `// eslint-disable-next-line @next/next/no-img-element -- export estático con images.unoptimized: las variantes se generan en scripts/optimizar-assets.mjs`. |
| `lib/imagenes.ts` | nuevo | `export const retrato = { base: "/img/sadai-retrato", anchos: [480, 800, 1133], ancho: 1133, alto: 1600 } as const;` |
| `components/marca/Sticker.tsx` | nuevo | `type NumeroLogo = "04" \| "05"; type NumeroLibre = "06" \| "07" \| "08" \| "09" \| "10";` Props en unión discriminada: `{ numero: NumeroLogo; ancho: number; className? }` \| `{ numero: NumeroLibre; ancho: number; rotacion?: number; className? }` (TS impide rotar stickers de logotipo, PRD §3.5). Renderiza `<img src="/marca/stickers/sticker-XX.svg" width={ancho} height={calculado} alt="" aria-hidden loading="lazy" decoding="async">` + el mismo eslint-disable. `rotacion` va en `style.rotate`. Entrada "pop" opcional: clase `.pop` (scale .9→1 + opacity) solo dentro de `@media (prefers-reduced-motion: no-preference)`. |
| `components/ui/Degradado.tsx` + `Degradado.module.scss` | nuevo | `{ variante: "aura" \| "01" \| "02" \| "04" \| "05" \| "03"; grano?: boolean (true); velo?: "ninguno" \| "inferior" \| "superior"; animado?: boolean (false); as?: "div" \| "section"; className?; children?; id?; "aria-labelledby"? }`. Clase por variante = `background-image: var(--grad-XX)` (+ `background-color: $vino` de respaldo). `"03"` usa `image-set(url(/img/degradado-03-1920.avif) type("image/avif"), url(/img/degradado-03-1920.webp) type("image/webp"))` con la variante 960 bajo 64rem, y una declaración previa `url(...webp)` de respaldo; solo funciona si se corrió F1.6 con el flag. `grano` agrega la utilidad `grano`. `velo` agrega `::after` `linear-gradient(to top, rgb(68 0 25 / .45), transparent)` (o `to bottom`). `animado`: `background-size: 140% 140%` + keyframes `background-position` 0%→100% 24 s `alternate`, solo en `con-movimiento`. Nunca animar `filter`. |
| `components/ui/Reveal.tsx` | reescribir **sin motion** | Misma API `{ children, delay?, className?, as? }`. Renderiza `<Componente data-reveal style={{"--retraso": \`${delay*1000}ms\`}}>`. Un **IntersectionObserver compartido** a nivel de módulo (`threshold: 0.2`, `rootMargin: "0px 0px -10% 0px"`) pone `data-visible` y deja de observar. Si `IntersectionObserver` no existe, marca visible de inmediato. `useEffect` + `ref`, sin estado React (cero re-renders). |
| `components/ui/BotonCopiar.tsx` / `.module.scss` | restyle | Lógica intacta. SCSS: `min-height: 2.75rem; border-radius: $radio-pill; font-weight: 600; font-size: .8125rem;` **sin** `text-transform`/`letter-spacing`; sólido `bg $vino / color $marfil / hover $vino-hover`; contorno `border 1px $vino`. Estado copiado: sin cambios de lógica. |
| `components/ui/CampoCopiable.tsx` / `.module.scss` | restyle | Lógica intacta. Tarjeta `background: $marfil; border: 1px solid $linea; border-radius: $radio-tarjeta`; etiqueta Jakarta 600 `.8125rem` `$vino-70`; valor Jakarta 600 `tabular-nums` `$vino`. Estado copiado (F5.2): `[data-copiado] { border-color: $vino }`; añadir la prop `copiado` vía callback `alCopiar` de `BotonCopiar` (prop nueva opcional, sin romper la API). |
| `components/ui/IconoInstagram.tsx` | mantener | `strokeWidth` 1.5 para igualar a lucide (PRD §3.7). |

Íconos lucide: en todo el sitio `strokeWidth={1.5}` y `className="size-5"`.

**Verificación F2:** `pnpm lint` y `pnpm build` limpios (las secciones viejas aún se ven "rotas" visualmente; es esperado). En `out/index.html` hay `<link rel="preload" … as="font">` para Established y Jakarta: `grep -c 'as="font"' out/index.html` ≥ 2. `grep -c "Great Vibes\|Jost\|Playfair" -r out/_next/static/chunks/*.css` = 0.

---

## F3 — Layout

### F3.1 `components/layout/Layout.tsx`
- Skip link "Saltar al contenido": `sr-only focus:not-sr-only … focus:bg-vino focus:text-marfil focus:rounded-pill`, como primer elemento enfocable.
- `<main id="contenido" tabIndex={-1} className="outline-none">`.
- Atributo `inert` en `main` y `footer` cuando el menú móvil está abierto. Se resuelve con un contexto mínimo `MenuMovilContext` en `Layout`, o con un callback `alCambiarMenu` hacia `Navbar` que lo guarde en estado de `Layout`.

### F3.2 `components/layout/Navbar.tsx` + `Navbar.module.scss` (reescritura, sin motion)
- **Se conserva:**
  - La medición con `requestAnimationFrame` (fondo al pasar 40 px; sección activa por `ancla`).
  - `aria-current`, bloqueo de scroll, `Esc`, `aria-expanded`/`aria-controls="menu-movil"`.
  - "Datos bancarios" **solo** en el menú móvil.
  - `LINEA_ACTIVA` pasa a importar `ALTURA_NAVBAR_PX` de `lib/layout.ts`.
- **Tono:** `const sobreOscuro = ["/", "/404"].includes(useRouter().pathname)`.
  - `claro` (texto marfil, fondo transparente) cuando `sobreOscuro && !conFondo`, o cuando el menú está abierto.
  - En los demás casos, `oscuro`: texto vino, `bg-marfil/95 backdrop-blur border-b border-linea`.
  - `/datos-bancarios` arranca en `oscuro`.
- **Estructura:** `<header class="fixed inset-x-0 top-0 z-50 h-[var(--altura-navbar)] transition-colors duration-200">` → `<nav aria-label="Navegación principal" class="contenedor flex h-full items-center justify-between">`.
  - Logo: `<Link href="/" aria-label="Sadai, inicio">` con `<Logotipo className="w-[220px] h-auto" />` decorativo (el nombre lo da el enlace). En `/` y sin `conFondo`, el logo se oculta (`opacity-0 pointer-events-none`, `tabIndex={-1}`, `aria-hidden`) porque el hero ya lo muestra grande, como en el mockup "Presencia digital". Aparece con un fade de 200 ms al pasar 40 px.
  - Enlaces desktop (`hidden lg:flex gap-10`): `text-etiqueta font-semibold`, **sin mayúsculas**; subrayado 1 px `currentColor` con `scaleX` (se conserva la técnica del módulo actual).
  - CTA desktop (`hidden lg:block`): `BotonWhatsApp` variante `contorno-marfil` en tono claro y `vino` en tono oscuro.
  - Hamburguesa (`lg:hidden`): 44×44, tres barras de 1.5 px `currentColor`; animación a X por CSS con `[data-abierto]` (rotate/translate de las barras; esto **no** es el logo, así que se permite).
- **Menú móvil:** siempre montado. `<div id="menu-movil" inert={!abierto} data-abierto={abierto} class="fixed inset-0 z-40 bg-vino text-marfil lg:hidden">`.
  - Cerrado: `opacity-0 invisible`. Abierto: `opacity-100 visible`. Transición de opacidad y `translate-y-2→0` en 300 ms con `var(--ease-marca)`; `visibility` con retraso al cerrar.
  - Contenido (`pt-[var(--altura-navbar)] contenedor flex flex-col`): lista `navLinks` en `font-titulo text-h3`; separador `border-t border-linea-clara`; "Datos bancarios" (`text-etiqueta text-marfil-75`); `BotonWhatsApp variante="marfil"`; enlace `tel:` con `site.telefonoVisible`; `<Simbolo className="w-[150px] text-rosa mt-auto mb-10 self-center" />`.
- **Foco:**
  - Al abrir, foco al primer enlace (`ref`).
  - Con `Esc` o con el botón, cerrar y devolver el foco a la hamburguesa.
  - Al hacer clic en un enlace, cerrar **sin** mover el foco (el navegador lo lleva al ancla).
  - El "atrapado" se logra con `inert` en `main` y `footer` (F3.1).
  - Se usa el patrón *disclosure* (no `role="dialog"`), porque el botón de cierre vive en el header.

### F3.3 `components/layout/Footer.tsx` (reescritura; quitar `next/image`)
- Fondo `bg-vino text-marfil border-t border-linea-clara`, `seccion` con padding inferior reducido y `contenedor`.
- Grid: móvil 1 col; `sm:grid-cols-2`; `lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]`; `gap-12`.
- Col 1: `<LogotipoNailsBy titulo="Sadai" className="w-[260px] text-rosa" />` (área de seguridad: `p-[0.65em]` relativo, sin bordes cerca) y la frase "Tus uñas. Tu forma de decirlo." en `text-subtitulo font-semibold`.
- Col 2 `<nav aria-label="Pie de página">`: título `h2` en Jakarta 600 `text-etiqueta text-rosa`, más `navLinks`.
- Col 3 "Servicios": Manos, Pies y Retiros → `/#servicios-manos`, `/#servicios-pies`, `/#servicios-retiros` (generados desde `categorias`).
- Col 4 "Contacto": dirección (enlace a Maps, externo), teléfono (`telefonoHref`), horarios (`text-marfil-75`). Redes: Instagram y WhatsApp en círculos 44×44 con `border-linea-clara`, `hover:border-rosa hover:text-rosa` y `aria-label`.
- Barra inferior (`border-t border-linea-clara pt-6 text-legal text-marfil-75`, flex en `md`): "© {año} {site.nombre}. Todos los derechos reservados." · "Desde {site.fundado} en Manzanillo, Colima." · `<SimboloArtisticNails className="w-[220px] text-rosa" titulo="Sadai Artistic Nails" />`.
- **No** enlazar `/datos-bancarios`.

**Verificación F3:**
- `pnpm dev`: en 360/768/1280 el navbar sobre el hero es marfil y al hacer scroll pasa a vino con fondo marfil.
- Con teclado: Tab → skip link → logo → … En el menú móvil, Tab no sale a `main`; `Esc` cierra y el foco vuelve al botón.
- `/datos-bancarios` arranca en vino.
- En 360 px no hay scroll horizontal (logo 220 + botón 44 + gutters 32 = 296 ≤ 360).

🛑 Si el navbar de 100 px se ve desproporcionado, **no** bajar el logo de 220 px sin consultar a diseño (PRD §12.11). El único punto de ajuste es `--altura-navbar` + `ALTURA_NAVBAR_PX` + la clase de ancho del logo.

---

## F4 — Home (en orden de página)

### F4.1 `pages/index.tsx`
- Quitar `WaveDivider` y el `<Head>` manual.
- Usar `<Metadatos titulo={\`${site.nombre} | Estudio de uñas en Manzanillo, Colima\`} descripcion="Estudio privado de uñas artísticas en Manzanillo. Diseños personalizados, manicura, pedicura y acrílico. Agenda tu cita por WhatsApp." ruta="/" />` (≤ 60 y ≤ 155 caracteres).
- JSON-LD: `<Head><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crearJsonLdNailSalon()) }} /></Head>`.
- Orden: `Hero`, `Marquee`, `SobreMi`, `Servicios`, `Ubicacion`, `CallToAction`. Las secciones se tocan con cortes rectos.

### F4.2 Hero (`components/sections/Hero.tsx`, `Hero.module.scss`)
- **Default sin foto:** `<Degradado as="section" variante="aura" grano aria-labelledby="hero-titulo" className={styles.hero}>`.
  - Tamaño: `min-h-[88svh] lg:min-h-[100svh]` (mínimo 640 px), `pt-[var(--altura-navbar)]`.
  - Columna centrada `contenedor flex flex-col items-center justify-between text-center gap-8 pb-12`.
  - **Arriba:** `<Logotipo titulo="Sadai" className="w-[min(80vw,640px)] min-w-[280px] text-marfil" />`. Al ser el `h1` visual de marca, va en un `<p>`, no en un heading.
  - **Centro:**
    - `<h1 id="hero-titulo" className="font-titulo text-display text-vino">Tus uñas.<br/>Tu forma<br/>de decirlo.</h1>`
    - `<p className="text-lead text-vino-80 max-w-[28ch]">Estudio privado de uñas artísticas en Manzanillo, Colima.</p>`
  - **Abajo** (sobre la base vino del degradado): `BotonWhatsApp variante="contorno-marfil"` "Agenda una cita" y un enlace de texto "Ver servicios" (`#servicios`, `text-marfil underline-offset-4`); flecha `ArrowDown` opcional hacia `#sobre-mi`, en `text-marfil-75`.
- **Contraste** (decisión técnica; el mockup pone el titular en marfil sobre el centro rosa y daría ≈ 1.6:1):
  - El titular y el lead van en **vino** sobre el centro claro del aura.
  - Ajustar `--grad-aura` **solo para el hero** con una clase local `.hero { background-image: … }` dentro de `Hero.module.scss`: radio del centro claro (≥ `#E19CA9`) en `min(42rem, 90vw)` y anillo vino desplazado hacia abajo, de modo que **todo el bloque h1+lead** quede en zona clara en 360, 768, 1280 y 1920. La base inferior (≥ 75 % del alto) debe ser vino profundo (≤ `#6C2436`), y ahí cae el CTA marfil.
  - El logotipo marfil sobre la franja rosa superior es aplicación oficial del brand book (los logotipos están exentos de WCAG 1.4.3).
- **Entrada CSS** (sin JS, como hoy): keyframes `aparece` aplicados a logo, CTA y flecha (opacity + translateY 24 px, 800 ms, `--ease-marca`, escalonado con `animation-delay`). En el `h1` y el lead **solo** `translateY` (sin `opacity: 0`) para no retrasar el LCP. Con reduced-motion, sin animación.
- **Prop futura:** `foto?: { base: string; anchos: number[]; ancho: number; alto: number; alt: string; posicion?: string }`. Si existe:
  - `lg:grid lg:grid-cols-2`: panel de degradado a la izquierda y `<Imagen prioridad sizes="(min-width:1024px) 50vw, 100vw" …/>` a sangre a la derecha (`object-cover`).
  - En móvil la foto va debajo en 4:5.
  - Hoy **no se pasa**.
- Stickers: ninguno en el hero (máxima limpieza y LCP).

### F4.3 Marquee (`components/ui/Marquee.tsx` + `.module.scss`)
- Quitar el import de `motion/react`: el CSS ya detiene la animación con reduced-motion.
- Nueva prop `separador?: ReactNode`; default `<Recurso nombre="destello" className="size-4 text-rosa" />` en lugar de `.punto`.
- Ítems (en `index.tsx`): "Diseños con identidad", "Arte en cada detalle", "Una experiencia para ti", "Sofisticación sin pretensiones", "Manzanillo, Colima", "Solo con cita".
- Estilo: `background $vino; color $rosa; border-block: 1px solid $linea-clara; min-height: 4.5rem (md 6rem)`; textos `font-family: var(--font-titulo); font-size: var(--text-h3)` (≥ 28 px; nada de mayúsculas ni tracking).
- **Pausa** (WCAG 2.2.2): botón 44×44 al extremo derecho, `aria-pressed`, `aria-label="Pausar animación"`/`"Reanudar animación"`, ícono `Pause`/`Play` de lucide, fondo vino. Pone `data-pausado` en `.banda`; CSS: `.banda[data-pausado] .pista, .banda:hover .pista { animation-play-state: paused }`. Con reduced-motion el botón se oculta (`@include sin-movimiento { display:none }`).
- Se conserva todo el cálculo de copias, el `sr-only` único y `aria-hidden` en las copias.

### F4.4 Sobre mí (`components/sections/SobreMi.tsx`, `SobreMi.module.scss` reescritos)
- `<section id="sobre-mi" aria-labelledby="sobre-mi-titulo" class="seccion bg-marfil relative overflow-hidden">`.
- Decoración de fondo: `<Recurso nombre="mancha" className="absolute -right-24 top-10 w-[28rem] text-vino opacity-[0.08]" />`.
- `contenedor grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:items-center`.
- **Foto** (`lg:col-span-5`): `<Imagen {...retrato} alt="Sadai en su estudio, frente al letrero de neón de la marca" sizes="(min-width:1024px) 40vw, (min-width:640px) 50vw, 100vw" classNameImg="aspect-[4/5] object-cover object-[center_22%] rounded-tarjeta" />`.
  - Encima, `<Sticker numero="05" ancho={140} className="absolute -top-6 -left-4" />` y `<Sticker numero="10" ancho={96} rotacion={-8} className="absolute bottom-16 -right-4" />`.
  - Pill flotante "Desde 2024": `Pill` con fondo marfil, `absolute bottom-4 left-4`, texto `Desde {site.fundado}`.
- **Texto** (`lg:col-span-7`):
  - `<Pill>Sobre mí</Pill>`
  - `h2#sobre-mi-titulo` `text-h2`: "El arte también se lleva en las manos."
  - `<p class="text-subtitulo font-semibold">Diseños con identidad, hechos para ti.</p>`
  - Los dos párrafos del borrador PRD §6.4 en `text-cuerpo text-vino-80 max-w-[65ch]`, interpolando `site.fundado`. Los guiones largos `—` van en Jakarta, que sí los tiene.
- **Propuestas de valor** (debajo, ancho completo, `lg:col-span-12`): `ul` con grid `gap-4 sm:grid-cols-2 xl:grid-cols-4`, réplica de la p. 8 del brand book.
  - Cada `li`: título en caja `rounded-2xl border border-linea px-4 py-2 font-semibold text-menu`, más texto en tarjeta `mt-2 rounded-tarjeta border border-linea p-4 text-cuerpo`. Textos literales de PRD §2.1.
  - Higiene (PRD §12.9): añadir al final del texto de "Una experiencia para ti" la oración `Herramientas esterilizadas en cada cita.` con `// TODO(PRD §12.9)`.
- `Reveal` en bloque de texto y tarjetas (escalonado 0/80/160 ms).

### F4.5 Servicios = menú interactivo (núcleo del rediseño)
**Archivos:**
- `components/sections/Servicios.tsx` (reescrito: cabecera + `MenuServicios` + `TarjetaCotizacion`).
- `components/servicios/MenuServicios.tsx` + `MenuServicios.module.scss`.
- `components/servicios/FilaServicio.tsx`, `components/servicios/NotasMenu.tsx`, `components/servicios/TarjetaCotizacion.tsx`.
- `lib/useCategoriaHash.ts`.
- **Borrar** `components/sections/Servicios.module.scss`.

**Sección:**
- `<section id="servicios" aria-labelledby="servicios-titulo" class="relative bg-rosa">` con una franja superior `<Degradado variante="02" grano className="absolute inset-x-0 top-0 h-[22rem] opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]" />` decorativa, `aria-hidden`.
- Cabecera centrada:
  - `<Pill>Servicios</Pill>`
  - `h2#servicios-titulo` `text-h2`: "Servicios"
  - lead `text-lead text-vino-80`: "Precios base en pesos mexicanos. Los diseños se cotizan aparte."
  - `<Recurso nombre="salpicadura" className="mx-auto size-10 text-vino" />` como acento.

**`useCategoriaHash()`:**
```ts
// Fuente de verdad = location.hash ("#servicios-pies"). Sin setState en efectos.
const EVENTO = "sadai:hash";
const suscribir = (cb: () => void) => { addEventListener("hashchange", cb); addEventListener(EVENTO, cb); return () => { removeEventListener("hashchange", cb); removeEventListener(EVENTO, cb); }; };
export function useCategoriaHash(ids: readonly string[], porDefecto: string) {
  const hash = useSyncExternalStore(suscribir, () => location.hash, () => "");
  const [seleccion, setSeleccion] = useState(porDefecto);
  const desdeHash = hash.startsWith("#servicios-") ? hash.slice(11) : null;
  const activa = desdeHash && ids.includes(desdeHash) ? desdeHash : seleccion;
  const seleccionar = (id: string) => {
    setSeleccion(id);
    // Conservar history.state: el router de Pages guarda ahí su estado (__N); null rompería "atrás".
    history.replaceState(history.state, "", `#servicios-${id}`);
    dispatchEvent(new Event(EVENTO));
  };
  return [activa, seleccionar] as const;
}
```

**`MenuServicios` API:**
`{ categorias: readonly Categoria[]; notas: readonly string[] }`. Layout: `contenedor grid gap-8 lg:grid-cols-12`. Pestañas + paneles en `lg:col-span-8` y notas en `lg:col-span-4`.

- **Tablist:** `<div role="tablist" aria-label="Categorías de servicios" data-tablist-servicios class="grid grid-cols-3 gap-2 sm:flex sm:justify-center lg:justify-start">`. Por categoría:
  - `<button role="tab" id={\`servicios-${c.id}\`} aria-selected aria-controls={\`panel-servicios-${c.id}\`} tabIndex={activa ? 0 : -1}>`.
  - Contenido: `<Recurso nombre={…} className="hidden sm:block size-4"/>` + `{c.nombre}` + `<span aria-hidden="true">({n})</span>` + `<span className="sr-only">, {n} servicios</span>`.
  - Mapa recurso→nombre: `recurso-04`→`una`, `recurso-03`→`espiral`, `recurso-05`→`destello`.
  - Estilos: `min-h-11 rounded-pill border border-vino px-4 text-etiqueta font-semibold`. Inactiva `text-vino hover:bg-rosa-claro`; activa `bg-vino text-rosa` (9.91:1).
  - El `id` del tab es el destino del deep-link (`#servicios-pies`): está siempre visible, así que el navegador hace scroll a él aunque aún no hidrate.
- **Teclado** (APG Tabs, activación automática): ←/→ con vuelta circular, Home/End. `onKeyDown` en el tablist mueve el foco por `refs[]` y llama `seleccionar`. Enter/Espacio no hacen falta (activación automática); el clic llama `seleccionar`.
- **Paneles:** contenedor `.paneles { display: grid }` y cada panel `grid-area: 1 / 1`, de modo que el alto es siempre el del panel más largo y **no hay CLS** al cambiar.
  - Cada `<div role="tabpanel" id={\`panel-servicios-${c.id}\`} aria-labelledby={\`servicios-${c.id}\`} data-panel-servicios>`.
  - Inactivo: `visibility: hidden` (lo saca del árbol de accesibilidad y del foco). Activo: `visible` con fade 200 ms + `translateY(8px)→0` (sin animación con reduced-motion).
  - **SSR:** activo = `"manos"` (el server snapshot del hash es `""`); los tres paneles salen en el HTML para SEO. El `<noscript>` de F2.5 los apila visibles y oculta el tablist.
  - Sin `tabIndex=0` en el panel: contiene enlaces enfocables ("Agendar"), lo que según APG basta. Desviación consciente del PRD §7.3.
  - Dentro: `<h3 className="sr-only">{c.nombre}</h3>` + tarjeta `rounded-tarjeta border border-linea bg-marfil p-4 sm:p-6` + `<ul>` de `FilaServicio`.
- **`FilaServicio`** `{ servicio: Servicio; categoria: Categoria }`:
  - `<li class="relative grid grid-cols-[auto_1fr_auto_auto] items-baseline gap-x-3 py-3 min-h-11 border-b border-linea last:border-0">`.
  - Columnas: `<Recurso nombre="destello" className="size-3 text-vino translate-y-0.5"/>` · nombre (`text-menu`) con guía punteada flexible (`flex` + `<span aria-hidden className="flex-1 border-b border-dotted border-linea mx-2 translate-y-[-0.3em]"/>`) · precio · acción.
  - Precio: `<data value={monto|desde} className="font-semibold tabular-nums"><span aria-hidden="true">{formatearPrecio(p)}</span><span className="sr-only">{precioAccesible(p)}</span></data>`.
  - Acción: `<a href={crearWhatsappHref(crearMensajeServicio(s.nombre, c.nombre))} target="_blank" rel="noopener noreferrer" aria-label={\`Agendar ${s.nombre}, ${c.nombre.toLowerCase()} (se abre en otra pestaña)\`}>`.
    - En `< sm`: solo `ArrowUpRight` (size-5) + `after:absolute after:inset-0` (enlace estirado: toda la fila es el área táctil).
    - En `≥ sm`: pill `contorno-vino` `tamano="sm"` con texto "Agendar" visible siempre (no solo en hover) y `sm:after:hidden`.
  - Descripción (si `MOSTRAR_DESCRIPCIONES && s.descripcion`): `<p class="col-start-2 col-end-4 text-pequeno text-vino-70">`. Con `null` no se renderiza nada (sin hueco).
- **`NotasMenu`** `{ notas: readonly string[] }`:
  - `≥ lg`: `<aside aria-labelledby="notas-titulo" class="hidden lg:block lg:sticky lg:top-[calc(var(--altura-navbar)+1.5rem)] rounded-tarjeta border border-vino p-6">` con `h3#notas-titulo` `text-h3` "Notas importantes" + `ul`, viñeta `Recurso destello`.
  - `< lg`: `<details ref class="lg:hidden rounded-tarjeta border border-vino">` con `<summary class="min-h-11 … font-semibold">Notas importantes</summary>` y la misma lista (`sm:grid sm:grid-cols-2`).
  - Abierto por defecto en tablet: `useEffect(() => { if (matchMedia("(min-width: 40rem)").matches && ref.current) ref.current.open = true }, [])`. Se escribe directo en el DOM (sin estado).
  - Pie del bloque: `<Recurso nombre="una"/>` "Artistic Nails" `<Recurso nombre="espiral"/>`, como el impreso, `aria-hidden`.
- **`TarjetaCotizacion`** (ancho completo bajo el grid):
  - `<Degradado variante="01" grano className="rounded-tarjeta p-8 sm:p-10 text-marfil relative overflow-hidden">`.
  - Contraste: `--grad-01` llega a `#B4717E` en la esquina clara y marfil sobre `#B4717E` da ≈ 3.5:1, así que **velo obligatorio** `velo="superior"`. Si no alcanza 4.5:1, usar `bg-vino` plano.
  - `h3` `text-h3`: "Cuéntame el diseño que imaginas."; texto: "Los diseños se cotizan según la técnica. Envíame tu foto de inspiración y te paso el precio."; `BotonWhatsApp variante="marfil" mensaje={site.mensajeCotizacion}` "Enviar mi inspiración".
  - `<Sticker numero="09" ancho={110} rotacion={10} className="absolute -right-4 -bottom-6 hidden sm:block" />`.

**Layout por breakpoint:**
- `< 640`: tablist en 3 columnas iguales; lista en 1 columna; notas en `<details>` cerrado; tarjeta de cotización al final.
- `640–1023`: pills centradas; lista `max-w-[40rem] mx-auto`; notas abiertas en 2 columnas.
- `≥ 1024`: 8/4 columnas con notas sticky.

**Verificación F4.5:**
- Teclado: Tab llega al tab activo, ←/→/Home/End cambian y activan, y Tab entra al primer "Agendar".
- Ir a `/#servicios-pies` (en dev y en `out/`) abre Pies, y la URL se actualiza al cambiar de pestaña. Después, "Atrás" del navegador sigue funcionando.
- Con JS deshabilitado (DevTools) se ven las tres listas.
- El layout no salta al cambiar de pestaña (Performance → Layout Shift = 0).
- Lector de pantalla: "Manos, 7 servicios, pestaña, seleccionada, 1 de 3".

### F4.6 Ubicación (`components/sections/Ubicacion.tsx`; nuevo `components/ui/MapaFachada.tsx`)
- `<section id="ubicacion" aria-labelledby="ubicacion-titulo" class="seccion bg-vino text-marfil">`, `contenedor grid gap-12 lg:grid-cols-12 lg:items-center`.
- **Texto** (`lg:col-span-5`):
  - `<Pill tono="oscuro">Dónde estamos</Pill>`
  - `h2` "Te espero en el estudio."
  - lead `text-marfil-75`: "Atiendo solo con cita: llegas y es tu turno."
  - Lista Dirección/Horarios/Teléfono: ícono lucide en círculo `size-11 bg-rosa text-vino`; etiqueta `text-etiqueta font-semibold text-marfil-75`; valor `text-cuerpo`. El teléfono es un enlace `telefonoHref`.
  - `Boton variante="contorno-marfil" href={site.mapsUrl} externo icono={<Navigation/>}` "Cómo llegar".
- **Mapa** (`lg:col-span-7`): `MapaFachada` `{ src: string; titulo: string }`.
  - Contenedor `aspect-[4/3] lg:aspect-[16/11] rounded-tarjeta border border-rosa-75 overflow-hidden`.
  - Estado inicial (sin terceros, 0 bytes): `<Degradado variante="02" grano>` con `MapPin` grande en marfil, `site.direccion` y `Boton variante="marfil"` "Ver mapa interactivo".
  - Al clic, `setCargado(true)` en el handler → `<iframe src={mapaEmbedSrc} title={titulo} className="size-full border-0" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />`. Se enfoca el iframe tras cargar.
  - Mismo contenedor, así que no hay CLS.
  - Motivo: evitar las cookies de terceros (Best Practices) y el JS de Maps (Performance), y no depender de capturas de Google (términos de uso).
- Dirección y horarios siguen en TODO (no inventar).

### F4.7 CTA (`components/sections/CallToAction.tsx`, `CallToAction.module.scss` reescritos)
- Quitar el `textPath` y el arco.
- `<Degradado as="section" variante="04" grano velo="inferior" aria-labelledby="cta-titulo" className="seccion text-marfil relative overflow-hidden">`, `contenedor max-w-3xl text-center`.
- Textos:
  - `h2#cta-titulo` `text-h2`: "Tu próxima expresión comienza aquí."
  - `<p class="text-subtitulo font-semibold">Agenda tu cita.</p>`
  - texto `text-lead`: "Escríbeme y encontramos el horario que te acomode. Mira trabajos recientes en Instagram."
- Botones (`flex flex-col sm:flex-row gap-4 justify-center`): `BotonWhatsApp variante="marfil"` "Agenda una cita" y `Boton variante="contorno-marfil" href={site.instagramUrl} externo icono={<IconoInstagram/>}` `@{site.instagram}`.
- **Contraste:** `--grad-04` tiene el centro `#DB9BA8` (claro) y marfil ahí falla. Mover el bloque de texto a la mitad inferior **o** sobrescribir en el módulo el radial para que la elipse clara quede arriba del texto: `radial-gradient(ellipse 45% 40% at 50% 15%, …)` + base `#7A3146→#63192C` bajo el texto. El velo inferior refuerza. Objetivo: el texto queda sobre ≤ `#A35E6E` (≥ 4.5:1).
- Stickers decorativos: `06` (ancho 120, rot -12, arriba-izq), `08` (100, rot 8, abajo-der), `09` (90, rot -6, `hidden md:block`), en `absolute` y sin tapar el texto.

**Verificación F4:** las capturas en 360/390/768/1024/1280/1440/1920 no tienen scroll horizontal. Con el picker de DevTools, contraste ≥ 4.5:1 en h1 y lead del hero, textos del CTA, tarjeta de cotización y Ubicación.

🛑 Si el hero o el CTA no alcanzan 4.5:1 sin desfigurar el degradado, detenerse y consultar antes de inventar colores (PRD §3.1, regla 1; solo tintes de la paleta).

---

## F5 — 404 y `/datos-bancarios`

### F5.1 `pages/404.tsx`
- `<Metadatos titulo={\`Página no encontrada | ${site.nombre}\`} descripcion="…" noindex />`.
- `<Degradado as="section" variante="04" grano className="min-h-[100svh] pt-[var(--altura-navbar)] text-marfil relative overflow-hidden grid place-items-center text-center">`.
- Decoración: `<Recurso nombre="mancha" className="absolute … w-[40rem] text-vino opacity-20" />` o `<Sticker numero="07" ancho={180} rotacion={-10}/>`.
- Contenido: `<p aria-hidden className="font-titulo text-display">404</p>`; `h1` `text-h2`: "Esta página no existe."; texto: "Puede que el enlace haya cambiado. Vuelve al inicio y sigue desde ahí."; `Boton variante="marfil" href="/"` "Volver al inicio" + enlace secundario "Ver servicios" (`/#servicios`).
- Contraste: el mismo ajuste de radial que el CTA (texto sobre zona oscura).
- Firma: `<SimboloArtisticNails className="w-[220px] text-rosa mt-12" />`.

### F5.2 `pages/datos-bancarios.tsx`
- **Toda la lógica intacta:** `agrupar`, `todo`, `CampoCopiable`/`BotonCopiar`, `noindex`, `mensajeComprobante`.
- `<Metadatos titulo={\`Datos para transferencia | ${site.nombre}\`} descripcion={…} noindex />`.
- `<section class="bg-marfil pt-[calc(var(--altura-navbar)+2rem)] pb-[var(--espacio-seccion)]">` y `<div class="mx-auto max-w-[36rem] px-[var(--gutter)]">`.
- Cabecera: `<Pill>Pago</Pill>`; `h1` `text-h2` "Datos para tu transferencia"; lead actual en `text-vino-80`.
- Campos: estilos de F2.7; el botón "Copiar los tres datos" usa la variante contorno a ancho completo.
- Tarjeta de cierre: `rounded-tarjeta bg-rosa p-8 text-center relative`; `h2` `text-h3` "Envíame tu comprobante" (**sin "¿"**); "Mándame la captura y te confirmo en cuanto la vea."; `BotonWhatsApp mensaje={site.mensajeComprobante}` "Enviar comprobante"; `<Sticker numero="10" ancho={80} rotacion={12} className="absolute -top-6 -right-3" />`.

**Verificación F5:**
- `out/404.html` y `out/datos-bancarios.html` contienen `noindex` y **no** `canonical`.
- Copiar cuenta pega 16 dígitos sin espacios; "Copiado" se anuncia (`aria-live`).
- `/datos-bancarios` no aparece enlazado desde `out/index.html`, salvo en el menú móvil: `grep -o 'datos-bancarios' out/index.html | wc -l` = 1.

---

## F6 — SEO y archivos estáticos

- **`public/site.webmanifest`:**
```json
{ "name": "Sadai · Artistic Nails", "short_name": "Sadai", "description": "Estudio privado de uñas artísticas en Manzanillo, Colima.", "lang": "es-MX", "start_url": "/", "display": "standalone", "background_color": "#F9F8F4", "theme_color": "#440019",
  "icons": [ { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" }, { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }, { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" } ] }
```
- **`public/robots.txt`:**
```
User-agent: *
Allow: /
Disallow: /datos-bancarios

Sitemap: https://sadai.mx/sitemap.xml
```
  (`noindex` ya cubre la página; el `Disallow` es defensa extra. Si Lighthouse SEO se queja porque `noindex` + `Disallow` impide leer el meta, quitar la línea `Disallow`.)
- **`public/sitemap.xml`:** un solo `<url><loc>https://sadai.mx/</loc></url>`.
- `public/CNAME` intacto. `.github/workflows/deploy.yml` sin cambios.

---

## F7 — Limpieza de código y assets muertos

| # | Acción | Archivos |
|---|---|---|
| 7.1 | Borrar el bloque LEGACY de `_tokens.scss` y corregir lo que deje de compilar | `styles/_tokens.scss` |
| 7.2 | Borrar | `components/ui/WaveDivider.tsx`, `components/ui/WaveDivider.module.scss` |
| 7.3 | Borrar | `public/logo-sadai.png` (455 KB) |
| 7.4 | Verificar que ya no existe en `public/` (movido en F0.3) | `public/sadai-retrato.png` |
| 7.5 | Quitar la dependencia `motion` (`pnpm remove motion`) una vez que `grep -rn "motion/react" components pages lib` dé vacío | `package.json`, `pnpm-lock.yaml` |
| 7.6 | Quitar `next/image` de todo el código (se usa `Imagen`) | grep `next/image` vacío |
| 7.7 | Borrar módulos SCSS huérfanos (`Servicios.module.scss`; el `.module.scss` de cualquier sección que ya no lo importe) | `components/sections/*.module.scss` |
| 7.8 | Actualizar el `README.md` con una sección breve "Assets de marca" (`pnpm assets`, requiere `docs/brand-identity/` local y `uvx` para la fuente) | `README.md` |

**Greps de aceptación** (todos deben dar 0 coincidencias):
```sh
grep -rnE "cacao|arena|crema|font-firma|fuente-firma|Great_Vibes|Jost|Playfair|WaveDivider|logo-sadai|motion/react|next/image|rosa-claro: #fbe6ed|#f4c9d6|#3e2723|uppercase" components pages lib styles
grep -rnE "#[0-9a-fA-F]{3,8}\b" components pages lib   # hex sueltos: solo permitidos en styles/ y scripts/
grep -rn "✨" lib
```
(`uppercase` queda prohibido por la regla de "sin mayúsculas sostenidas". Si se requiere en algún micro-label, justificarlo.)

---

## F8 — Verificación final (checklist)

**Build y lint**
- [ ] `pnpm install --frozen-lockfile` (con el lock actualizado por F0.2/F7.5), `pnpm lint` (0 errores, 0 warnings), `pnpm build` limpio (`npm run build` es equivalente; el repo usa pnpm).
- [ ] `ls out` contiene: `index.html`, `404.html`, `datos-bancarios.html`, `CNAME`, `robots.txt`, `sitemap.xml`, `og.jpg`, `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `site.webmanifest`, `img/`, `marca/stickers/`. **No** contiene `logo-sadai.png` ni `sadai-retrato.png`.
- [ ] `grep -c 'as="font"' out/index.html` ≥ 2; `grep -o 'https://sadai.mx/og.jpg' out/index.html`; `grep -c 'application/ld+json' out/index.html` = 1; `grep -c 'rel="canonical"' out/index.html` = 1.
- [ ] Presupuesto JS: `for f in out/_next/static/chunks/*.js; do gzip -c "$f" | wc -c; done | awk '{s+=$1} END {print s/1024}'` debe bajar respecto de hoy (≈ 225 KB gz en total; motion fuera). JS de la home ≤ 110 KB gz (DevTools → Network, filtro JS, "transferred").
- [ ] Fuentes en total ≤ 60 KB (Network → Font).
- [ ] Servir el export: `pnpm dlx serve out` (resuelve `/datos-bancarios` → `.html` como GitHub Pages) y probar todas las rutas, anclas `/#sobre-mi`, `/#servicios`, `/#ubicacion`, `/#servicios-retiros`, y una ruta inexistente → 404.

**Visual y responsive** (360, 390, 768, 1024, 1280, 1440, 1920; Safari iOS si es posible)
- [ ] Sin scroll horizontal; reflow a 320 px; zoom 200 % utilizable.
- [ ] Logotipo nunca < 220 px de ancho (salvo íconos), sin deformar, sin sombras ni filtros.
- [ ] Mapa de color por sección = PRD §5 (salvo las desviaciones documentadas: hero sin foto, mapa con fachada).
- [ ] Ningún texto en Established bajo 28 px; títulos sin `¿ ¡ · – —`.

**Accesibilidad**
- [ ] Un `h1` por página; h2/h3 sin saltos; landmarks `header`/`nav` (con `aria-label`)/`main#contenido`/`footer`.
- [ ] Teclado completo: skip link, navbar, menú móvil (foco atrapado, `Esc`, retorno de foco), tabs (←/→/Home/End), pausa del marquee, fachada del mapa, botones copiar. Foco visible en todo.
- [ ] Contraste con DevTools en cada texto sobre degradado (≥ 4.5:1 normal, ≥ 3:1 ≥ 24 px) y en los indicadores no textuales (bordes de pills activas y foco ≥ 3:1).
- [ ] `prefers-reduced-motion` (DevTools → Rendering): marquee quieto, sin reveals ni animación de hero o degradados.
- [ ] VoiceOver: precios leídos como "600 pesos"; enlaces externos anuncian "se abre en otra pestaña"; stickers y recursos ignorados.

**Rendimiento** (base para la fase de Lighthouse)
- [ ] Lighthouse móvil sobre `pnpm dlx serve out`, informativo: Performance ≥ 95, A11y/BP/SEO = 100. LCP = h1 del hero (texto); CLS ≤ 0.02 (Performance → Layout shifts vacío al cargar `/` y `/#servicios-pies`).
- [ ] Ninguna petición a terceros al cargar (el iframe del mapa solo tras el clic).

**Criterios de aceptación globales**
1. Las 10 piezas presentes y funcionales (Navbar, Hero, Marquee, Sobre mí, Servicios-menú, Ubicación, CTA, Footer, 404, `/datos-bancarios`), con anclas, BotonWhatsApp, BotonCopiar/CampoCopiable y noindex intactos.
2. Cero restos de la identidad anterior (greps de F7).
3. Logotipos solo desde SVG oficiales procesados por el script; versiones sin ®.
4. Tokens solo en `styles/globals.css` + espejo `styles/_tokens.scss`; fuentes solo en `lib/fonts.ts`; datos del menú solo en `lib/menu-servicios.ts`.
5. Export estático idéntico en mecánica al actual (`output: "export"`, `images.unoptimized`, sin `basePath`, workflow sin cambios).

---

## Riesgos y puntos de detención (resumen)

| Riesgo | Mitigación | 🛑 Detenerse cuando |
|---|---|---|
| Licencia de Established (repo público) | Aislada en `lib/fonts.ts`; plan B preparado | Antes de fusionar a `main` o publicar sin certificado confirmado |
| Contraste del texto sobre degradados | Ajustes locales de radial + `velo`; texto vino en el centro claro del hero | Si no se llega a 4.5:1 sin colores nuevos |
| Navbar de 100 px por el mínimo de 220 px del logo | Punto único de ajuste | Si se quiere bajar el logo de 220 px |
| `next/font/google` sin red en el build local | Alternativa `localFont` con el zip OFL | Si el CI también falla |
| Regla `react-hooks/set-state-in-effect` (plugin 7.1.1) | `useSyncExternalStore` para el hash; DOM directo en `<details>`; Reveal sin estado | Si lint marca otro patrón: no desactivar la regla sin justificarlo |
| `history.replaceState` y el router de Pages | Pasar siempre `history.state` | Si "Atrás" se rompe |
| Fidelidad de degradados CSS vs PNG | Grano + comparación a ojo en 1440 | Si diseño exige exactitud (usar AVIF, +~50 KB c/u) |
| Copy no aprobado (descripciones, higiene, nombre, Instagram) | TODO con referencia a PRD §12 y banderas | Antes de publicar, confirmar con Sadai |
| `image-set()` con `type()` en Safari antiguo | Declaración previa con `url(...webp)` | — (solo si se activa la variante 03) |

## Puntos de control sugeridos (commit solo si el usuario lo pide)
F0 "Preparar rebranding: ignorar brand book y herramientas de assets" · F1 "Assets de marca optimizados" · F2 "Tokens, fuentes y componentes base de la nueva identidad" · F3 "Navbar y footer con la nueva identidad" · F4 "Home con la nueva identidad y menú de servicios" · F5 "404 y datos bancarios" · F6 "SEO estático" · F7 "Limpieza de la identidad anterior".

