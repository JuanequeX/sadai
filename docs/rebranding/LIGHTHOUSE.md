# Fase 4: Lighthouse y responsive

- **Fecha:** 2026-11-08 · **Rama:** `rebranding-total` (sin commits ni push; los cambios staged de la fase 3 siguen igual).
- **Cómo se midió:**
  - Lighthouse 12.8.2 (CLI) con Chrome 156 headless.
  - Móvil: emulación por defecto (Moto G Power, 4G lento simulado, CPU 4x). Desktop: `--preset=desktop`.
  - Build: `pnpm build` en una copia del repo en el scratchpad (el `next dev` del usuario seguía corriendo en el repo).
  - `out/` se sirvió con un servidor propio que imita a GitHub Pages: `.html` implícito, `404.html` con estado 404, gzip y `cache-control: max-age=600`. Esos encabezados se comprobaron con `curl` contra sadai.mx.
- **Ruta del 404:** se midió `/404.html`. Lighthouse no audita respuestas con estado 404 (`ERRORED_DOCUMENT_REQUEST`), que es lo que GitHub Pages devuelve en cualquier ruta inexistente.
- **Variación:** los puntajes de una sola corrida varían ±1–2 puntos. La comparación de bundlers se hizo con 3 corridas por variante.

## Antes / después

Base: el estado de la fase 3 (Turbopack, logos inline), servido con gzip.

| Página | Disp. | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | móvil | 95 → **98** | 100 → 100 | 100 → 100 | 100 → 100 | 1.6 → **0.9 s** | 2.8 → **2.4 s** | 30 → 10 ms | 0 → 0 | 1.6 → **0.9 s** |
| `/` | desktop | 100 → 100 | 100 → 100 | 100 → 100 | 100 → 100 | 0.3 → 0.3 s | 0.6 → 0.5 s | 0 → 0 ms | 0 → 0 | 0.4 → 0.3 s |
| `/datos-bancarios` | móvil | 95 → **99** | 100 → 100 | 100 → 100 | 63 → 63 ¹ | 0.9 → 0.9 s | 2.9 → **2.2 s** | 0 → 10 ms | 0 → 0 | 0.9 → 0.9 s |
| `/datos-bancarios` | desktop | 100 → 100 | 100 → 100 | 100 → 100 | 63 → 63 ¹ | 0.2 → 0.2 s | 0.7 → 0.5 s | 0 → 0 ms | 0 → 0 | 0.2 → 0.2 s |
| `/404` | móvil | 98 → **99** | 100 → 100 | 100 → 100 | 63 → 63 ¹ | 0.9 → 0.9 s | 2.4 → 2.3 s | 0 → 20 ms | 0 → 0 | 0.9 → 0.9 s |
| `/404` | desktop | 100 → 100 | 100 → 100 | 100 → 100 | 63 → 63 ¹ | 0.2 → 0.2 s | 0.5 → 0.5 s | 0 → 0 ms | 0 → 0 | 0.2 → 0.2 s |

¹ El SEO de 63 viene **solo** de `is-crawlable`: esas páginas llevan `noindex` a propósito. El resto de las auditorías de SEO pasan. Ver "Lo que no se alcanzó".

Accesibilidad: la auditoría `label-content-name-mismatch` (WCAG 2.5.3) fallaba en `/datos-bancarios` sin restar puntos y ya pasa.

### Peso transferido (móvil, gzip, según Lighthouse)

| Página | JS | HTML | CSS | Fuentes | Imágenes | Total | Peticiones |
|---|---|---|---|---|---|---|---|
| `/` | 161.3 → **118.2 KB** | 23.9 → **10.9 KB** | 10.9 → 10.6 | 43.2 | 37.9 → 33.6 | 286 → **237 KB** | 29 → 25 |
| `/datos-bancarios` | 161.3 → **111.9 KB** | 10.5 → 4.6 | 10.9 → 9.7 | 43.2 | 1.6 | 237 → **196 KB** | 26 → 21 |
| `/404` | 181.2 → **110.9 KB** | 10.6 → 4.2 | 10.9 → 9.7 | 43.2 | 0 | 255 → **200 KB** | 29 → 24 |

El JS de "antes" incluye el prefetch de `next/link` de los chunks de otras páginas.

JS de la home medido sobre los chunks del HTML (gzip -9):

| | KB gz |
|---|---|
| Fase 3 | 143.7 |
| Ahora | **115.9** |
| Meta del plan | ≤ 110 |

En "ahora" no se cuenta `polyfills.js`, que es `nomodule` y los navegadores modernos no lo descargan.

Desglose de esos 115.9 KB:

| Chunk | KB gz | Contenido |
|---|---|---|
| framework | 58.3 | react-dom y react |
| main | 39.2 | router y cliente de Next |
| `_app` | 8.5 | |
| index | 9.0 | |
| runtime | 0.8 | |

## Cambios y por qué

1. **Logos y recursos de marca como sprite SVG estático, no como JSX**
   - Era la mayor causa de peso evitable. El path data de `Logotipo`, `LogotipoNailsBy`, `Simbolo`, `SimboloArtisticNails` y `Recurso` viajaba en el bundle (duplicado entre `_app` y la página) y además inline en el HTML; el destello del menú se repetía en cada fila.
   - Ahora `scripts/optimizar-assets.mjs` genera dos sprites:
     - `public/marca/logos.svg` (17 KB, ~7 KB gz);
     - `public/marca/recursos.svg` (6 KB).
   - Los componentes emiten `<svg viewBox><use href="/marca/….svg?v=<hash>#id"/></svg>`. Conservan:
     - `currentColor` (los cambios de color del navbar al hacer scroll siguen funcionando);
     - `title` y `aria-label`;
     - el viewBox medido.
   - El `?v=<hash>` del contenido evita servir arte viejo, porque GitHub Pages no permite caché inmutable.
   - Funciona sin JS (comprobado).
   - Efecto en la home: HTML de 23.9 a 10.9 KB gz, y FCP de 1.6 a 0.9 s.
2. **`pnpm build` usa webpack (`next build --webpack`) y `pnpm dev` sigue con Turbopack**
   - Es la combinación que documenta Next 16 ("Opting out of Turbopack").
   - Con Pages Router, Turbopack metía en el chunk de `_app` y en el de cada página, a la vez:
     - React (16.8 KB fuente);
     - `next/head`;
     - `lib/menu-servicios` y `lib/site-config`;
     - su runtime, dos veces.
   - Webpack deduplica (`framework`/`main`/`_app`/página): son −16.6 KB gz en la home.
   - A/B con 3 corridas en móvil:

     | Página | Turbopack | Webpack |
     |---|---|---|
     | `/` (LCP) | 2.5 s | 2.35 s |
     | `/datos-bancarios` (Perf) | 95 | 97 |

   - El workflow de deploy no cambia (sigue corriendo `pnpm build`). Está anotado en el README.
3. **`/datos-bancarios`: el contenido above the fold ya no espera a la hidratación**
   - El LCP (el lead) estaba dentro de un `Reveal`, que arranca en `opacity: 0` hasta que el IntersectionObserver lo marca. El LCP quedaba atado a descargar y ejecutar todo el JS.
   - `Reveal` admite ahora `inmediato`: emite `data-entrada` y entra por keyframes de CSS (`globals.css`), solo con desplazamiento, sin opacidad 0 y sin observer. Con reduced-motion no anima.
   - Se usa en el título, los datos y "Copiar los tres datos". La tarjeta rosa del final sigue con reveal normal.
   - Efecto: LCP en móvil de 2.9 a 2.2 s.
4. **Retrato con `sizes` real y variantes ajustadas**
   - Se midió el ancho renderizado de 320 a 1920 px; el máximo es 464 px CSS.
   - `sizes`:

     ```
     (min-width:1280px) 464px, (min-width:1024px) calc(42vw - 72px), (min-width:768px) calc(50vw - 3rem), min(calc(100vw - 2rem), 28rem)
     ```

     El anterior (`40vw`/`50vw`/`100vw`) servía 800 px en desktop 1x.
   - Variantes: `480/720/960/1133` (antes `480/800/1133`). 720 cubre el móvil a 1.75x y 960 el desktop a 2x.
   - Efecto: `uses-responsive-images` pasa.
   - Queda el insight informativo `image-delivery-insight` (21 KB): compara contra el tamaño a 1x, sin DPR, y no afecta al puntaje.
5. **Accesibilidad, WCAG 2.5.3 (label in name)**
   - El botón "Copiar los tres datos" tenía `aria-label="Copiar todos los datos"`.
   - `BotonCopiar` solo pone `aria-label` cuando el texto visible es el genérico "Copiar". Con un texto propio, el nombre accesible es el texto visible.
6. **Target táctil**: el teléfono en Ubicación medía 21 px de alto. Con `inline-block py-1` pasa a 29 px (WCAG 2.5.8 pide ≥ 24).
7. **Responsive, reflow a 320 px**
   - Pestañas del menú de servicios: "Retiros (3)" se salía 16 px del contenedor y la tarjeta del menú medía 329 px en un viewport de 320. Causa: el grid exterior tenía una columna implícita `auto` y las filas usaban `1fr` (= `minmax(auto, 1fr)`), así que "semipermanente" imponía su min-content.
   - Arreglos:
     - `grid-cols-1` en el contenedor;
     - `minmax(0,1fr)` y `min-w-0` en la fila;
     - nombres con `hyphens-auto` y `overflow-wrap: anywhere`;
     - pestañas con `px-2` debajo de 360 px;
     - la línea de puntos del menú se oculta debajo de 360 px para dejar espacio al nombre.
   - En `/404` el "404" quedaba pegado al logotipo del navbar en horizontal (740×360): se añadió `+1.5rem` al padding superior.

### Probado y descartado

- **Cambiar `next/link` por `<a>`:** ahorraba 3.1 KB gz con Turbopack y 2.1 KB con webpack. No compensa desactivar la regla `@next/next/no-html-link-for-pages` ni perder la navegación del cliente. Se revirtió.

## Archivos tocados

**Modificados**
- `scripts/optimizar-assets.mjs`: genera los sprites; los componentes usan `<use>`; variantes del retrato 480/720/960/1133; se quitó `interiorJsx`.
- `components/marca/`: `Logotipo.tsx`, `LogotipoNailsBy.tsx`, `Simbolo.tsx`, `SimboloArtisticNails.tsx` y `Recurso.tsx`. Todos regenerados por el script.
- `components/ui/`:
  - `Reveal.tsx`: prop `inmediato`;
  - `BotonCopiar.tsx`: `aria-label` condicional.
- `components/sections/`:
  - `SobreMi.tsx`: `sizes`;
  - `Ubicacion.tsx`: target del teléfono.
- `components/servicios/`:
  - `MenuServicios.tsx`: `grid-cols-1` y pestañas;
  - `FilaServicio.tsx`: `minmax(0,1fr)`, guiones y la línea de puntos debajo de 360 px.
- `pages/`:
  - `datos-bancarios.tsx`: `Reveal inmediato` arriba;
  - `404.tsx`: padding superior.
- Otros:
  - `styles/globals.css`: `[data-entrada]` y `@keyframes entrada`;
  - `lib/imagenes.ts`: anchos;
  - `package.json`: `build` pasa a `next build --webpack`;
  - `README.md`: nota sobre el bundler.

**Nuevos**
- `public/marca/logos.svg` y `public/marca/recursos.svg`
- `public/img/sadai-retrato-{720,960}.{avif,webp}` (480 y 1133 regenerados)
- `docs/rebranding/LIGHTHOUSE.md`

**Borrados**
- `public/img/sadai-retrato-800.{avif,webp}`: nunca se commitearon, eran de la fase 3.

`IMPLEMENTACION.md` y `PLAN.md` aún citan `480,800,1133`. Es histórico y no se tocó.

## Verificación

- `pnpm lint`: 0 errores y 0 warnings.
- `pnpm build` (webpack): limpio, con `/`, `/404` y `/datos-bancarios` estáticas. Ambos se corrieron en la copia del scratchpad.
- **Responsive.** Capturas de página completa de `/`, `/datos-bancarios` y `/404.html`:
  - Tamaños: 320×640, 360×740, 390×844, 414×896, 768×1024, 1024×768, 1280×800, 1440×900 y 1920×1080.
  - Horizontal móvil: 740×360 y 844×390.
  - 640×400, que equivale a 1280×800 con zoom al 200 %.
  - En todas: `scrollWidth == clientWidth` y ningún elemento en flujo se sale del viewport (chequeo automático por elemento). Targets interactivos ≥ 24 px (el único < 24 es el skip link oculto, que mide 1×1 hasta recibir foco).
  - Revisadas a ojo: hero 360 y 740×360, menú de servicios en 320 y 1024, Sobre mí y Servicios en 1440, `/datos-bancarios` en 320, `/404` en 740×360, menú móvil abierto en 360×740, 740×360 y 320×640, y la home sin JS en 390.
- **Funcional** (Playwright con el Chrome del sistema):
  - `/#servicios-retiros` abre Retiros.
  - Pestañas: → circular y End mueven el foco y actualizan el hash.
  - La pausa del marquee pone `aria-pressed=true`.
  - Menú móvil: el foco va a "Sobre mí", `Esc` lo devuelve a la hamburguesa y el menú hace scroll en horizontal (786 px de contenido en 360 de alto).
  - **0** peticiones a terceros antes de abrir el mapa.
  - `/datos-bancarios`: `noindex`, y "Copiar los tres datos" copia el texto esperado.
  - Sin JS: los 3 paneles se ven y los logos del sprite se renderizan.
  - Reduced-motion: `[data-entrada]` sin animación.
  - Los dos sprites se cargan y el logotipo del hero renderiza a 639×220.

## Lo que no se alcanzó y por qué

- **SEO 63 en `/datos-bancarios` y `/404`.**
  - `is-crawlable` falla con cualquier `noindex`, y también con un `Disallow` en `robots.txt`.
  - En `/datos-bancarios` el `noindex` es un requisito: lleva datos personales.
  - En la 404, GitHub Pages ya responde con estado 404, así que el `noindex` es redundante pero inocuo; se mantuvo como buena práctica. Si se quiere el 100 de laboratorio en `/404.html`, basta con quitar `noindex` de `pages/404.tsx`; el estado 404 sigue impidiendo la indexación de rutas rotas.
- **`uses-long-cache-ttl` / `cache-insight`.** GitHub Pages fija `cache-control: max-age=600` a todo y no permite encabezados propios. Los chunks de `_next/static` tienen hash y aguantarían `immutable`. No resta puntaje directo. Solo se arreglaría con un CDN delante (Cloudflare con reglas de caché) o con otro hosting (Netlify, Vercel o Cloudflare Pages, con un archivo `_headers`).
- **`legacy-javascript` (12 KB) y `unused-javascript` (24–48 KB).**
  - Son polyfills internos de Next (`Array.prototype.at`, `Object.hasOwn`, …) dentro de `main`, más las partes de react-dom y del router que una landing no usa.
  - No se pueden configurar en Pages Router y no restan puntaje (son oportunidades).
- **JS de la home ≤ 110 KB gz: 115.9 KB.** Framework y cliente de Next suman 98.4 KB fijos con Pages Router. El código propio ya es de 17.5 KB.
- **LCP móvil de la home: 2.4 s** (el objetivo de "bueno" es ≤ 2.5 s).
  - El LCP es el h1 y en la traza real pinta a los ~140 ms.
  - El modelo simulado de Lighthouse cuenta en el camino crítico los scripts pedidos antes de ese paint. Prueba: con el mismo HTML sin scripts, el LCP simulado baja a 1.6 s.
  - Bajar más exige quitar JS del framework (ver recomendaciones).

## Recomendaciones

1. **Medir en producción** cuando esto se publique: PageSpeed Insights contra https://sadai.mx y los datos de campo (CrUX) cuando haya tráfico. En GitHub Pages el HTTP/2 y el CDN Fastly deberían dar números iguales o mejores que el servidor local HTTP/1.1.
2. Si algún día se quiere **≤ 110 KB y LCP < 2 s en móvil simulado**, hay dos caminos:
   - pasar a App Router con Server Components (el menú, el footer y casi todo dejarían de hidratarse);
   - o mantener Pages Router y sacar el JSON-LD a `_document`, que solo corre en el servidor (unos 1–2 KB).

   El primero es el único con impacto grande.
3. **Caché.** Si se mueve el dominio a Cloudflare (proxy) se puede poner `Cache-Control: public, max-age=31536000, immutable` en `/_next/static/*` y en `/marca/*.svg?v=*`.
4. Al regenerar arte con `pnpm assets logos recursos`, el hash de `?v=` cambia solo. No editar a mano los sprites ni los componentes de `components/marca/`.
5. Queda pendiente de la fase 3 probar con dispositivos reales: VoiceOver, Safari iOS (`<use>` externo funciona desde iOS 12, mismo origen) y zoom real del navegador.

## Evidencia (scratchpad)

Base: `/private/tmp/claude-501/-Users-juanequex-codebase-sumus-sadai/6ce9faa1-4d11-4938-b973-052e4c5662c5/scratchpad/lh/`

- Reportes JSON y HTML:
  - `reports/antes/`
  - `reports/paso1/` (sprites + retrato)
  - `reports/paso2/` (+ webpack + `inmediato`)
  - `reports/despues/` (final)
  - `reports/ab/` (A/B de bundlers y experimentos sin scripts o sin preload)
- Capturas:
  - `shots/v1/` (las primeras, con el desborde de pestañas a 320)
  - `shots/v3/` (recortes revisados y menú móvil)
  - `shots/final/` (barrido completo final, más `sinjs-390.png`)
- Herramientas: `tools/` (`serve.mjs` imita GitHub Pages; `lh.sh`, `capturas.cjs`, `func.cjs`, `mapas.mjs` hace el desglose de chunks por source map).

## Medición 2 (babfdbe)

- **Fecha:** 2026-11-08 · **Commit:** `babfdbe` (rama `rebranding-total`). Solo se midió: no se tocó código.
- **Cómo:** mismo método que arriba.
  - Copia en el scratchpad, `pnpm build` (webpack) y `out/` servido como GitHub Pages (gzip, `max-age=600`).
  - Lighthouse 12.8.2 con Chrome 156.
  - **3 corridas por caso; se reporta la mediana.** Entre paréntesis, las tres corridas de Performance.

### Puntajes (mediana de 3)

| Página | Disp. | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | móvil | 98 (97/98/98) | 100 | 100 | 100 | 0.9 s | 2.4 s | 18 ms | 0 | 0.9 s |
| `/` | desktop | 100 | 100 | 100 | 100 | 0.3 s | 0.5 s | 0 ms | 0 | 0.3 s |
| `/como-llegar` (nueva) | móvil | 99 (98/99/99) | 100 | 100 | 100 | 0.8 s | 2.1 s | 17 ms | 0 | 0.8 s |
| `/como-llegar` (nueva) | desktop | 100 | 100 | 100 | 100 | 0.2 s | 0.5 s | 0 ms | 0 | 0.2 s |
| `/datos-bancarios` | móvil | 99 (98/99/99) | 100 | 100 | 63 ¹ | 0.9 s | 2.2 s | 9 ms | 0 | 0.9 s |
| `/datos-bancarios` | desktop | 100 | 100 | 100 | 63 ¹ | 0.2 s | 0.5 s | 0 ms | 0 | 0.2 s |
| `/404` (`/404.html`) | móvil | 99 (99/99/99) | 100 | 100 | 63 ¹ | 0.9 s | 2.3 s | 18 ms | 0 | 0.9 s |
| `/404` (`/404.html`) | desktop | 100 | 100 | 100 | 63 ¹ | 0.2 s | 0.5 s | 0 ms | 0 | 0.2 s |

¹ Solo falla `is-crawlable`, por el `noindex` intencional. Es igual que en la medición 1.

**Comparación con la medición 1:** no hay regresiones de puntaje en ninguna página ni dispositivo. Las diferencias de métricas están dentro del ruido (±0.1 s; TBT +8–18 ms en móvil). Las auditorías que fallan son las mismas que antes:

- caché de GitHub Pages;
- `legacy-javascript` y `unused-javascript` de Next;
- `image-delivery-insight` del retrato;
- `is-crawlable` en las dos páginas con `noindex`.

### Peso transferido (móvil, corrida 2)

| Página | JS | HTML | CSS | Fuentes | Imágenes | Total | Peticiones | Terceros |
|---|---|---|---|---|---|---|---|---|
| `/` | 118.6 KB (+0.4) | 11.2 KB (+0.3) | 10.9 | 43.2 | 33.6 | 239 KB | 25 | 0 |
| `/como-llegar` | 113.3 KB | 6.2 KB | 9.1 | 43.2 | 0 | 202 KB | 21 | 0 |
| `/datos-bancarios` | 112.1 KB | 4.6 KB | 10.1 | 43.2 | 1.6 | 198 KB | 21 | 0 |
| `/404` | 111.2 KB | 4.2 KB | 10.0 | 43.2 | 0 | 202 KB | 24 | 0 |

### Hallazgos por tema

- **iframe de Google Maps (Ubicación)**
  - Con `loading="lazy"` y fuera del primer pantallazo, Lighthouse **no lo carga**: 0 peticiones a terceros, así que el BP de 100 en la home se mide sin el mapa.
  - Prueba forzando `loading="eager"` (en una copia de `out/`, no en el repo):
    - sigue en **BP 100**: no aparecen `third-party-cookies`, `inspector-issues` ni errores de consola en Chrome 156;
    - Perf: 98 en móvil y 100 en desktop;
    - pero el mapa trae **17 peticiones y unos 470–510 KB** de Google;
    - en desktop, `max-potential-fid` sube a 160 ms y `forced-reflow-insight` a 120 ms.
  - Los usuarios reales que bajan hasta Ubicación pagan ese peso. Además, se pierde el "0 peticiones a terceros" de la fase 3 y Google ya recibe la visita al hacer scroll.
  - En navegadores que no bloquean cookies de terceros, el embed puede poner cookies de Google. Esto no se ve en la puntuación del Chrome actual.
- **Hero "seda" con texto marfil**
  - **LCP:** sigue siendo el h1 ("Tus uñas. Tu forma de decirlo."), con 2.4 s en móvil. El 82 % es render delay del JS simulado; no es una regresión.
  - **CLS:** 0.
  - **Contraste medido en píxeles reales** (texto oculto, fondo capturado bajo cada caja, con reduced-motion):

    | Texto | Mínimo | Viewports |
    |---|---|---|
    | h1 | ≥ 5.55:1 | 320–1920 y 740×360 |
    | lead | ≥ 5.55:1 | 320–1920 (en 740×360 queda fuera del viewport) |
    | "Ver servicios" | ≥ 8.37:1 | 320–1920 (en 740×360 queda fuera del viewport) |

    Todo pasa AA. Hay menos margen que con el h1 vino de la fase 3 (≥ 7.1:1), pero es suficiente.
- **Croquis inline de `/como-llegar`**
  - El SVG mayor pesa ~5.3 KB sin comprimir. El HTML de la página es de 26.8 KB (6.1 KB gz) y el chunk de la página de 11 KB (4.0 KB gz).
  - Impacto despreciable. El LCP de esa página es el texto del paso 1 (2.1 s en móvil).
  - El chequeo automático marca trazos del croquis "fuera del viewport" en 320–390 px. Es un falso positivo: es geometría recortada por el viewBox, y la captura a 320 se ve completa, sin scroll horizontal.
- **Responsive y targets.** Barrido de las 4 páginas en 320, 360, 390, 414, 768, 1024, 1280, 1440 y 1920 px, más 740×360, 844×390 y 640×400:
  - sin scroll horizontal en ningún caso;
  - ningún target interactivo < 24 px, salvo el skip link oculto.

  La captura de `/datos-bancarios` en 740×360 falló por timeout del screenshot (incidencia de la herramienta, no de la página); el resto del barrido de esa página está limpio.
- **Navbar de 72 px, ® en la S, horarios y JSON-LD.** Ninguna auditoría nueva falla. SEO es de 100 en `/` y en `/como-llegar`.

### Correcciones propuestas (priorizadas, sin aplicar)

1. **Volver a una fachada para el mapa de Ubicación**, o cargar el iframe solo tras una interacción o cuando el usuario esté por llegar a la sección.
   - Ahorra unos 500 KB y 17 peticiones de terceros a quien baje hasta Ubicación, y evita mandar la visita y cookies a Google sin consentimiento.
   - El enlace "Abrir en Google Maps" y `/como-llegar` ya cubren la necesidad.
   - Si se mantiene el iframe directo, al menos documentarlo como decisión de privacidad.
2. **Revisar el texto pequeño del croquis** ("Plaza Don Pedro" y nombres de calles, unos 10–11 px a 320). Axe no evalúa texto dentro de SVG. Subirlo a ≥ 12 px o confiar en la lista de pasos, que ya repite la información.
3. **Margen de contraste del hero.** 5.55:1 pasa AA. Si la "seda" se ajusta más adelante, volver a medir sobre píxeles: el texto marfil tiene poco margen en la zona clara.
4. Lo de la medición 1 sigue vigente:
   - `noindex` opcional en la 404 para el 100 de laboratorio;
   - caché inmutable solo con un CDN delante;
   - App Router si se quiere bajar del piso de JS del framework.

Evidencia: `/private/tmp/claude-501/-Users-juanequex-codebase-sumus-sadai/6ce9faa1-4d11-4938-b973-052e4c5662c5/scratchpad/lh/reports/medicion2/` tiene las 48 corridas en JSON/HTML más `exp-mapa-eager-{mobile,desktop}.json`. Las capturas están en `…/scratchpad/lh/shots/m2/`.
