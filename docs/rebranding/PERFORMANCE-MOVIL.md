# Performance en móvil (Lighthouse)

- **Fecha:** 2026-11-08 · **Rama:** `rebranding-total` (sin commits).
- **Punto de partida:** el usuario midió **Performance 76** en móvil desde Chrome DevTools contra `localhost`. Los insights eran render-blocking (280 ms), network dependency tree, cache lifetimes (0 KiB), legacy JavaScript (9 KiB), LCP breakdown y 3rd parties.
- **Cómo se midió:**
  - Chrome 156 headless. Emulación móvil por defecto (Moto G Power, 4G lento simulado, CPU 4x), 3 corridas por página y mediana. Más una pasada desktop (`--preset=desktop`).
  - Producción: `pnpm build` en una copia del repo. `out/` se sirvió con el mismo servidor que imita GitHub Pages (`.html` implícito, gzip, `cache-control: max-age=600`).
  - Se midió con **Lighthouse 13.6** (la generación que trae el DevTools de Chrome 156, la herramienta del usuario) y con **12.8.2** (la CLI de `LIGHTHOUSE.md`). La diferencia entre las dos importa; ver abajo.

## 1. El 76 era del servidor de desarrollo, no del sitio

El usuario midió `next dev` en `localhost:3000`. Contra ese mismo servidor (sin detenerlo), con Lighthouse 12.8.2, salen exactamente sus números: **76 / 76 / 76**, Legacy JavaScript **9 KiB** y cache **0 KiB**.

| `/` móvil | Perf | FCP | LCP | TBT | SI | Peso | JS |
|---|---|---|---|---|---|---|---|
| `next dev` (LH 12.8) | **76** | 2.13 s | 5.84 s | 58 ms | 2.56 s | 798 KB | 679 KB |
| `next dev` (LH 13.6, primera medición) | 85 (85/86/72) | 2.02 s | 2.02 s | 481 ms | 3.29 s | | |
| Producción (LH 13.6, antes de este cambio) | **100** | 0.66 s | 0.66 s | 0 ms | 0.66 s | 249 KB | 119 KB |

Por qué dev no sirve para medir:

- **JS sin minificar:** 129 KiB de ahorro posible solo por minificar.
- **Runtime de HMR y React en modo desarrollo:** 389 ms de ejecución de JS contra 71 ms en producción.
- **Chunks de Turbopack de desarrollo y `Cache-Control: no-cache, must-revalidate`.**

Cada insight del usuario tiene su origen en dev:

- **Render-blocking (280 ms):** los dos `.css` de dev (`[root-of-the-server]…css` y `components_…css`).
- **Legacy JS (9 KiB):** el chunk de dev `0-6r_next_dist_….js`.
- **Cache (0 KiB):** en dev nada es cacheable, pero los archivos se sirven desde `localhost` con 0 bytes "ahorrables".
- **CTA que tarda en aparecer en el filmstrip:** el TBT alto de dev retrasa los fotogramas. Además, la animación del CTA terminaba a 1.06 s.

Dev además varía mucho entre corridas: 72–98 según lo "caliente" que esté la compilación. **Para medir el sitio hay que usar `pnpm build` y servir `out/`**. Por ejemplo, `npx serve out` o el servidor de la sección "Cómo se midió". Nunca `pnpm dev`.

### Lighthouse 12 frente a 13

La versión cambia el LCP de producción: 2.4 s con LH 12 y 0.66 s con LH 13.

- **Lighthouse 13 (Lantern nuevo):** cuando el LCP es un texto que se pinta en el mismo fotograma que el FCP (aquí, el h1 del hero), el LCP simulado se toma igual al FCP.
- **Lighthouse 12:** no tiene esa regla. Suma al LCP todo el JS `defer` que terminó de bajar antes del primer pintado (unos 120 KB), y por eso marcaba 98–99.

El sitio es el mismo en los dos casos: en la traza real, FCP y LCP ocurren en el mismo instante. DevTools de Chrome 156 usa la generación 13.

## 2. Causa de cada insight en producción

| Insight | En producción | Causa | Qué se hizo |
|---|---|---|---|
| Render-blocking requests | 290 ms (LH 13) | Dos `<link rel="stylesheet">`: CSS global de Tailwind (9.4 KB gz) y CSS modules de la página (1.8 KB gz en `/`). | El CSS de página va inline; queda 130–150 ms. Inline total y `inlineCss` descartados, ver §3. |
| Network dependency tree | Solo `documento → site.webmanifest` | Las fuentes ya van precargadas y no hay cadenas críticas. Los sprites `/marca/*.svg` cargan en paralelo y no están en la ruta del LCP (el LCP es el h1). | Nada que acortar. Preload del sprite probado y descartado, ver §3. |
| Use efficient cache lifetimes | 150–190 KiB | GitHub Pages sirve todo con `max-age=600` (10 min). | No se puede cambiar desde el repo, ver §5. |
| Legacy JavaScript | 13 KiB (estimado) | `next/dist/build/polyfills/polyfill-module.js` lo importa sin condición `next/dist/client/index.js`. Incluye `Array.prototype.at/flat/flatMap`, `Object.hasOwn/fromEntries`, `trimStart/End`, `Promise.finally`, `Symbol.description` y `URL.canParse`. Pesa **1.4 KB (614 B gz)**; los 13 KiB son la estimación de Lighthouse. | No se toca, ver §3. La browserslist por defecto de Next 16 ya es moderna (Chrome 111, Safari 16.4) y no aporta más polyfills. |
| LCP breakdown | TTFB ~2 ms y render delay ~50 ms (observado) | LCP = h1 "Tus uñas. Tu forma de decirlo." (fuente Established, precargada). | Ya estaba bien: el h1 no anima `opacity`. |
| 3rd parties | Ninguno | | |

## 3. Cambios hechos

1. **`pages/_document.tsx`: el CSS de página va inline en producción.**
   - `HeadCssInline` extiende `Head` y sobrescribe `getCssLinks`. El CSS no compartido (CSS modules de la página: 0.7–1.8 KB gz) se emite como `<style data-n-href="/_next/static/css/….css">`. El CSS global sigue como `<link>`.
   - `data-n-href` es la marca que usa el router de Pages (`next/dist/client/index.js`, `onStart`/`onHeadCommit`) para activar y desactivar el CSS de cada página. Por eso la navegación con `next/link` sigue igual.
   - Se comprobó con Playwright: `/` → `/datos-bancarios` → atrás → `/como-llegar` → `/`, sin errores de consola. El fondo del hero y las fuentes están bien después de cada salto.
   - En dev, o si no se puede leer el archivo, se usa el `<link>` original.
   - Efecto en móvil (LH 13): FCP de `/` 0.66 → 0.63 s y de `/datos-bancarios` 0.65 → 0.60 s. El ahorro estimado de render-blocking baja de 290 a 140–150 ms.
2. **`components/sections/Hero.tsx` y `Hero.module.scss`: entrada del hero más corta.**
   - Retrasos de 0/100/180/260/420 ms a 0/60/120/160/280 ms; duración de 800 a 600 ms.
   - El CTA ("Agenda una cita" / "Ver servicios") termina de aparecer a los **760 ms** en lugar de 1.06 s.
   - Se mantienen el escalonado, el desplazamiento y el fundido del logo, el CTA y la flecha. El h1 y el lead siguen sin `opacity` (no retrasan el LCP). Con reduced-motion no hay animación.
   - En producción no cambia las métricas, porque Speed Index = FCP. Sí se nota en el filmstrip y en dev.

### Probado y descartado

- **Todo el CSS inline (global + página).**
  - Con LH 12 bajaba el FCP (0.90 → 0.78 s), pero con LH 13 lo **empeora**: `/` 0.66 → 0.82 s, `/como-llegar` 0.61 → 0.84 s, y el TBT sube.
  - Causa: el HTML de la home pasa de 11.5 a 21 KB gz y supera la primera ventana de TCP (~14 KB). Se suma una vuelta de red completa (150 ms RTT en 4G simulado) y el CSS global deja de cachearse entre páginas.
- **`experimental.inlineCss`.** Según `node_modules/next/dist/docs/.../inlineCss.md`, y lo confirma el código, solo aplica a App Router (`app-page-runtime`). En Pages Router no hace nada.
- **`experimental.optimizeCss` (critters).** Requiere añadir `critters`, que está deprecado. Además inlinea todas las reglas que coinciden con algún elemento del documento, así que tendría el mismo problema de tamaño.
- **Preload de `/marca/logos.svg`.** Se probó con `as="image"`, `as="fetch"` y `as="fetch" crossorigin`. En los tres casos Chrome **no reutiliza** la precarga para `<use href>`: descarga el sprite dos veces y avisa en consola "preloaded but not used", lo que bajaría Best Practices. Además el sprite no está en la ruta del LCP.
- **Quitar `polyfill-module` con un alias de webpack.**
  - Requiere una función `webpack` en `next.config.ts`. En Next 16, `next dev` (Turbopack por defecto) **sale con error** si hay `webpack` sin `turbopack: {}` (`lib/turbopack-warning.js`).
  - Además reiniciaría el dev server del usuario y choca con los cambios del otro agente en `next.config.ts`.
  - El ahorro real son 614 B gz y no mueve el puntaje: el insight es informativo. No compensa.

## 4. Antes / después (producción, mediana de 3)

Las dos columnas incluyen los cambios del otro agente que estaban en el árbol en cada momento (Best Practices: `Ubicacion.tsx`, source maps).

### Lighthouse 13.6 (la versión de DevTools)

| Página | Disp. | Perf | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|
| `/` | móvil | 100 → 100 | 0.66 → **0.63 s** | 0.66 → **0.63 s** | 0 → 0 ms | 0 → 0 | 0.66 → **0.63 s** |
| `/como-llegar` | móvil | 100 → 100 | 0.63 → **0.60 s** | 0.63 → **0.60 s** | 5 → 0 ms | 0 → 0 | 0.63 → **0.60 s** |
| `/datos-bancarios` | móvil | 100 → 100 | 0.65 → **0.60 s** | 0.65 → **0.60 s** | 24 → 0 ms | 0 → 0 | 0.65 → **0.60 s** |
| `/` | desktop | 100 → 100 | 0.17 → 0.17 s | 0.17 → 0.17 s | 0 → 0 ms | 0 → 0 | 0.17 → 0.17 s |
| `/como-llegar` | desktop | 100 → 100 | 0.17 → 0.17 s | 0.17 → 0.17 s | 0 → 0 ms | 0 → 0 | 0.17 → 0.17 s |
| `/datos-bancarios` | desktop | 100 → 100 | 0.17 → 0.17 s | 0.17 → 0.17 s | 0 → 0 ms | 0 → 0 | 0.17 → 0.17 s |

`/como-llegar` no tiene CSS propio, así que no cambia nada en ella; su diferencia es ruido.

### Lighthouse 12.8.2 (la CLI de `LIGHTHOUSE.md`, solo móvil)

| Página | Perf | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| `/` | 98 → 98 | 0.90 → **0.75 s** | 2.41 → **2.33 s** | 0 → 0 ms | 0 → 0 | 0.90 → **0.75 s** |
| `/como-llegar` | 99 → 99 | 0.75 → 0.75 s | 2.10 → 2.25 s ¹ | 0 → 0 ms | 0 → 0 | 0.75 → 0.75 s |
| `/datos-bancarios` | 99 → 99 | 0.90 → **0.75 s** | 2.18 → 2.18 s | 0 → 0 ms | 0 → 0 | 0.90 → **0.75 s** |

¹ El LCP de LH 12 depende del JS que termina antes del pintado (§1), y entre las dos mediciones cambió el chunk de la home por los cambios del otro agente. En `/como-llegar` este trabajo no tocó nada.

### Servidor de desarrollo (solo referencia, `/` móvil, LH 13.6)

| | Perf | FCP | LCP | TBT | SI |
|---|---|---|---|---|---|
| Primera medición | 85 (85/86/72) | 2.02 s | 2.02 s | 481 ms | 3.29 s |
| Después (dev ya compilado, hero nuevo) | 98 | 1.98 s | 1.98 s | 49 ms | 2.49 s |

La mayor parte de esa mejora es que dev estaba ya compilado: el TBT cae de 481 a 49 ms. El Speed Index sí refleja la entrada más corta del hero. Aun así, dev no sirve para medir: ver §1.

## 5. Lo que no depende de nosotros

- **Cache lifetimes.** GitHub Pages fija `Cache-Control: max-age=600` para todo, incluso `/_next/static/*` (que tiene hash y podría ser `immutable`). No se configura desde el repo. Las alternativas son poner una CDN delante (por ejemplo Cloudflare, con regla de caché larga para `/_next/static/*`) o cambiar de hosting.
- **Legacy JavaScript.** Es el `polyfill-module` que Next mete siempre en `main` (ver §3). Desaparecerá cuando Next lo condicione a la browserslist.
- **Render-blocking restante (130–150 ms estimados).** Es el CSS global (9.4 KB gz). Ponerlo inline empeora el resultado (§3). La estimación de Lighthouse no tiene en cuenta el coste de agrandar el HTML.
- **Variación de dev y de Lighthouse en DevTools.** El puntaje de DevTools depende de la CPU de la máquina, las extensiones y el estado de compilación de `next dev`. Para comparar, usar siempre un build de producción y 3 corridas.

## Archivos tocados

- `pages/_document.tsx`: `HeadCssInline` (CSS de página inline en producción).
- `components/sections/Hero.tsx`: retrasos de entrada más cortos y comentario.
- `components/sections/Hero.module.scss`: duración de 800 a 600 ms.
- `docs/rebranding/PERFORMANCE-MOVIL.md` (nuevo).

No se tocaron `next.config.ts`, `package.json`, `Ubicacion.tsx`, `Croquis.tsx`, `LIGHTHOUSE.md` ni `BEST-PRACTICES.md`. `pnpm lint` sale limpio y `pnpm build` (en la copia del scratchpad) también, sin errores ni avisos.
