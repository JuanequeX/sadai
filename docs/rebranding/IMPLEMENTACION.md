# Implementación del rebranding total (fase 3)

- **Fecha:** 2026-11-08 · **Rama:** `rebranding-total` (sin commits ni push; nada tocado en `main`).
- **Insumos:** `docs/rebranding/PLAN.md` (F0–F8) y `docs/rebranding/PRD.md`.
- **Resultado:** `pnpm lint` 0 errores y 0 warnings; `pnpm build` limpio (export estático en `out/`).
  Verificación visual con capturas de Chrome headless en 360, 768, 1440 y 1920 px, más el contraste
  medido sobre píxeles reales.

## Decisiones aplicadas

| Decisión | Estado |
|---|---|
| a. Fuente Established | **Licencia web confirmada por el cliente** (aviso a mitad de la tarea). Se usa como fuente definitiva vía `next/font/local` (`styles/fonts/Established-Regular.woff2`, 16.6 KB). `lib/fonts.ts` lo deja anotado; el plan B (Instrument Serif) queda comentado solo como referencia. |
| b. ® | Versiones **sin ®** (`REGISTRADA = false`). |
| c. Datos | Valores actuales de `lib/site-config.ts` (nombre "Nails by Sadai", `nailsbysadai`, dirección y horarios con TODO). Descripciones del menú = borradores del PRD con `TODO(PRD §12.6)`, `MOSTRAR_DESCRIPCIONES = true`. Sin duraciones (`duracionMin: null`). |
| d. Fotografía | Solo el retrato existente, optimizado, en Sobre mí. Hero sin foto (panel de degradado), con la prop `foto?` lista para el layout 50/50. |

## Qué se hizo por fase

**F0 — Preparación**
- `.gitignore` ignora `/docs/brand-identity/` (comprobado con `git check-ignore`).
- `pnpm add -D sharp@0.35.3 svgo` (svgo 4.1.0).
- `git mv public/sadai-retrato.png assets/fuente/sadai-retrato.png`.
- Script `"assets": "node scripts/optimizar-assets.mjs"` en `package.json`.

**F1 — Pipeline de assets** (`scripts/optimizar-assets.mjs`, tareas `logos|recursos|stickers|iconos|imagenes|og|todo`)
- Fuente: subset woff2 con `uvx pyftsubset`, 16.6 KB (dentro del rango aceptable ≤ 18 KB). La cobertura en español es completa salvo `…`, que **tampoco existe en la .otf original**.
- Logos → `components/marca/{Logotipo,LogotipoNailsBy,Simbolo,SimboloArtisticNails}.tsx`, todos < 8 KB:
  - el viewBox se recorta midiendo el bbox real con sharp;
  - color por `currentColor`;
  - nombre accesible opcional (`titulo`).
  - Los bbox medidos coinciden con el PRD (±2 u).
- Recursos 01–05 → `components/marca/Recurso.tsx` (`salpicadura|mancha|espiral|una|destello`).
- Stickers → `public/marca/stickers/sticker-{06..10}.svg` (ver desviaciones: 04/05 no se publican).
- Íconos:
  - `favicon.svg` y `favicon.ico` (16/32/48, con un escritor ICO propio);
  - `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` e `icon-maskable-512.png`, con la "S" vino sobre rosa.
- Retrato → `public/img/sadai-retrato-{480,800,1133}.{avif,webp}` (AVIF de 800 px: 34.9 KB; objetivo ≤ 120 KB).
- `public/og.jpg`: 1200×630, 84.5 KB, Degradado 04 oficial con el logotipo marfil.

**F2 — Fundaciones**
- `styles/globals.css` reescrito: paleta oficial con `--color-*: initial`, escala tipográfica, degradados, grano y utilidades `contenedor`, `seccion` y `grano`.
- `styles/_tokens.scss` es el espejo SCSS de esos tokens.
- `lib/fonts.ts` es el único punto de fuentes. `pages/_app.tsx` y `pages/_document.tsx` actualizados:
  - el viewport se declara una sola vez;
  - `theme-color` es `#440019`;
  - el `<noscript>` se amplió.
- Datos:
  - `lib/site-config.ts`: sin ✨; se añaden `marca`, `url`, `mensajeCotizacion`, `crearMensajeServicio`, `telefonoHref` y los TODO.
  - Archivos nuevos: `lib/menu-servicios.ts`, `lib/datos-estructurados.ts` (JSON-LD NailSalon + OfferCatalog), `lib/layout.ts`, `lib/imagenes.ts`.
- Componentes base:
  - nuevos: `Metadatos`, `Boton`, `Pill`, `Imagen` (`<picture>` AVIF/WebP), `Degradado`, `marca/Sticker`;
  - reescritos: `BotonWhatsApp` (sobre `Boton`) y `Reveal` (sin motion, con un IntersectionObserver compartido y sin estado React);
  - restyle sin cambiar la lógica: `BotonCopiar` y `CampoCopiable` (prop nueva opcional `alCopiar` para el borde del estado "copiado").

**F3 — Layout**
- `Layout`: skip link, `main#contenido` e `inert` en `main` y `footer` con el menú móvil abierto.
- `Navbar` reescrito sin motion. Conserva:
  - la medición por frame;
  - `aria-current`;
  - el bloqueo de scroll;
  - el cierre con `Esc` y la devolución del foco a la hamburguesa;
  - "Datos bancarios" solo en el menú móvil.

  Novedades:
  - logotipo de 220 px;
  - hamburguesa animada por CSS;
  - menú móvil vino, siempre montado, con `inert`;
  - foco al primer enlace al abrir.
- `Footer` reescrito:
  - logotipo "Nails by" rosa y firma "Artistic (S) Nails";
  - enlaces profundos `/#servicios-{manos,pies,retiros}`;
  - no enlaza `/datos-bancarios`.

**F4 — Home**
- `index.tsx`: `Metadatos` + JSON-LD, sin `WaveDivider`.
- Hero: aura con grano, logotipo marfil, h1 de 3 líneas en vino, CTA contorno marfil sobre la base vino. La entrada se anima por CSS; el h1 solo se desplaza, sin `opacity: 0`.
- Marquee:
  - sin motion;
  - destello de marca como separador;
  - Established en tamaño `h3`;
  - botón de pausa con `aria-pressed`, que se oculta con reduced-motion y sin JS.
- Sobre mí:
  - retrato optimizado con radio de 24 px;
  - stickers 07 y 10;
  - pill "Desde 2024";
  - 4 propuestas de valor textuales;
  - higiene marcada con TODO.
- Servicios = menú interactivo (`components/servicios/*`, `lib/useCategoriaHash.ts`):
  - pestañas APG con ←/→/Home/End y vuelta circular;
  - hash deep-link con `replaceState(history.state)`;
  - paneles superpuestos (sin CLS);
  - filas con precio accesible ("600 pesos") y "Agendar" por WhatsApp;
  - "Notas importantes" sticky en desktop y en `<details>` en móvil/tablet;
  - tarjeta de cotización.
- Ubicación: `MapaFachada`. No hay ninguna petición a Google hasta hacer clic en "Ver mapa interactivo".
- CTA: `--grad-04` ajustado, con velo, grano y stickers 06/08/09.

**F5 — 404 y `/datos-bancarios`**
- 404: degradado vino con grano, "404" en Established, la mancha de fondo y la firma.
- `/datos-bancarios`: toda la lógica intacta (`agrupar`, copiar, copiar los tres datos, `aria-live`, noindex). La tarjeta de cierre es rosa y se titula "Envíame tu comprobante", sin "¿".

**F6 — SEO estático**
- `site.webmanifest` nuevo, con maskable.
- `robots.txt` con `Disallow: /datos-bancarios` y la ruta del sitemap.
- `sitemap.xml` solo con `/`.
- `CNAME` y workflow sin cambios.

**F7 — Limpieza**
- Bloque LEGACY de `_tokens.scss` borrado.
- `WaveDivider`, `logo-sadai.png`, `Servicios.module.scss` y `SobreMi.module.scss` borrados.
- `pnpm remove motion`. `next/image` ya no se usa.
- README con la sección "Assets de marca".

## Archivos

**Creados**
- `scripts/optimizar-assets.mjs`
- `assets/fuente/sadai-retrato.png` (movido)
- `styles/fonts/Established-Regular.woff2`
- `styles/pagina-404.module.scss`
- `lib/`: `fonts.ts`, `layout.ts`, `imagenes.ts`, `menu-servicios.ts`, `datos-estructurados.ts`, `useCategoriaHash.ts`
- `components/marca/`: `tipos.ts`, `Logotipo.tsx`, `LogotipoNailsBy.tsx`, `Simbolo.tsx`, `SimboloArtisticNails.tsx`, `Recurso.tsx`, `Sticker.tsx`, `Sticker.module.scss`
- `components/ui/`: `Boton.tsx`, `Pill.tsx`, `Imagen.tsx`, `Degradado.tsx`, `Degradado.module.scss`, `MapaFachada.tsx`
- `components/layout/Metadatos.tsx`
- `components/servicios/`: `MenuServicios.tsx`, `MenuServicios.module.scss`, `FilaServicio.tsx`, `NotasMenu.tsx`, `TarjetaCotizacion.tsx`
- `public/`: `img/*` (6), `marca/stickers/*` (5), `og.jpg`, `icon-maskable-512.png`, `robots.txt`, `sitemap.xml`
- `docs/rebranding/IMPLEMENTACION.md`

**Modificados**
- Raíz: `.gitignore`, `README.md`, `package.json`, `pnpm-lock.yaml`
- `styles/`: `globals.css`, `_tokens.scss`
- `pages/`: `_app.tsx`, `_document.tsx`, `index.tsx`, `404.tsx`, `datos-bancarios.tsx`
- `lib/site-config.ts`
- `components/layout/`: `Layout.tsx`, `Navbar.tsx` (+ `.module.scss`), `Footer.tsx`
- `components/sections/`: `Hero`, `SobreMi`, `Servicios`, `Ubicacion` y `CallToAction` (+ los `.module.scss` que siguen en uso)
- `components/ui/`: `BotonCopiar` y `CampoCopiable` (+ `.module.scss`), `BotonWhatsApp`, `IconoInstagram`, `Marquee` (+ `.module.scss`), `Reveal`
- `public/`: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`

**Borrados**
- `components/ui/WaveDivider.tsx` y `components/ui/WaveDivider.module.scss`
- `components/sections/Servicios.module.scss`
- `components/sections/SobreMi.module.scss`
- `public/logo-sadai.png`
- `public/sadai-retrato.png` (movido a `assets/fuente/`)

Nota de git: `git mv` y `git rm` dejaron esos movimientos y borrados en el índice (staged). No hay commits.

## Desviaciones del plan y por qué

1. **Stickers 04 y 05 no se publican.** Traen el ® integrado en la silueta y no hay versión sin ® de los stickers. Quitarlo exigiría editar la geometría del arte de marca.
   - En Sobre mí se usa el sticker 07 (mancha) en lugar del 05.
   - `Sticker.tsx` solo admite 06–10 y explica cómo reactivar 04/05 si `REGISTRADA = true`.
2. **Navbar sobre el hero en vino, no en marfil.** La franja superior del hero es rosa y el marfil sobre rosa da 1.58:1 (prohibido en PRD §3.1).
   - En `/`, arriba del todo: transparente con texto vino (≥ 7.7:1 medido) y CTA `contorno-vino`.
   - En `/404`: marfil sobre vino.
   - Al hacer scroll: fondo marfil con texto vino, como en el plan.
3. **Contraste del hero.** No se alcanzaba de forma robusta con radiales en %. Ahora el degradado base usa paradas en rem medidas desde abajo:
   - zona del CTA ≤ `#5A1A2E`;
   - h1 y lead sobre ≥ `#E19CA9`.

   Los márgenes de `.cta` y `.titular` garantizan esa separación a cualquier alto de viewport. Contraste medido en px reales (360/768/1440/1920):

   | Texto | Mínimo medido |
   |---|---|
   | h1 | ≥ 7.1:1 |
   | lead (en vino, no vino-80, por margen) | ≥ 6.1:1 |
   | CTA marfil | ≥ 10.5:1 |

4. **Ajustes locales de degradado (hero, CTA, cotización, 404) como tokens.** Se definen en `globals.css` (`--grad-hero-*`, `--grad-cta`, `--grad-cotizacion`) para que no haya hex en componentes. Solo usan tonos muestreados de los degradados oficiales.
   - CTA marfil: ≥ 10.3:1.
   - Cotización: ≥ 7.4:1 (con `--grad-01` oscurecido además del velo).
   - 404: ≥ 10.2:1 (el resplandor rosado va abajo a la derecha).
5. **Posición del componente `Degradado`.** Su módulo SCSS, al no estar en capa, le ganaba a `absolute` de Tailwind. Se quitó `position` del módulo y de la utilidad `grano`; el componente añade `relative` salvo que el llamador ya lo posicione. Los overrides locales usan doble clase (`.panel.panel`) para no depender del orden del CSS.
6. **svgo 4.** Ya no acepta `removeViewBox` dentro de `preset-default` (conserva el viewBox por defecto). Se usa el preset sin override.
7. **Estilos de la 404 en `styles/pagina-404.module.scss`.** Así no viven dentro de `pages/`.
8. **Detalles menores:**
   - Stickers algo más chicos en móvil.
   - CTA del hero en fila desde `sm`.
   - Sticker 09 del CTA solo desde `xl`, para no rozar el texto en tablet.
   - `overflow-x-clip` en `/datos-bancarios`: el sticker rotado desbordaba 7 px en 360.
   - El botón de pausa del marquee se oculta sin JS.
   - `notasMenu` lleva `TODO(PRD §12.7)` sobre "color liso #1 y 2".
9. **Build en copia limpia.** Durante la sesión había un `next dev` del usuario corriendo en el repo (no se detuvo): reescribe `.next/dev` y hace fallar el typecheck de `pnpm build` en el repo ("Duplicate identifier PagesPageConfig").
   - El build se verificó en una copia idéntica en el scratchpad: `pnpm install --frozen-lockfile` + `pnpm build`.
   - Con el dev server detenido, `pnpm build` en el repo debería pasar igual.

## Resultados

- `pnpm lint`: limpio (0 errores, 0 warnings).
- `pnpm build`: limpio. Rutas `/`, `/404` y `/datos-bancarios`, todas estáticas. Google Fonts se descargó sin problemas, así que no hizo falta el plan B local de Jakarta.
- Contenido de `out/`:
  - `index.html`, `404.html`, `datos-bancarios.html`;
  - `CNAME`, `robots.txt`, `sitemap.xml`, `og.jpg`;
  - `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `site.webmanifest`;
  - `img/` y `marca/stickers/`.
  - Sin `logo-sadai.png` ni el retrato original.
  - Tamaño total: **1.5 MB** (antes 3.7 MB).
- Comprobaciones en `out/index.html`:
  - `as="font"` = 2 (Established + Jakarta);
  - `og:image` = `https://sadai.mx/og.jpg`;
  - 1 JSON-LD (`priceRange "$80 – $600"`);
  - 1 canonical y 1 `h1`.
- Noindex: `404.html` y `datos-bancarios.html` llevan `noindex` y no llevan canonical. En `index.html`, `href="/datos-bancarios"` aparece 1 vez (menú móvil).
- JS gzip:

  | | Antes (`main`) | Ahora |
  |---|---|---|
  | Total | 224.7 KB | 190.6 KB |
  | Home | 180.8 KB | 143.9 KB |

  La meta de ≤ 110 KB de la home **no se alcanza todavía**: react-dom pesa ~66 KB y el path data de los logos inline va en el JS. Queda para la fase de Lighthouse.
- Fuentes precargadas: ~44 KB (Established 16.6 + Jakarta latin 27.3). Meta ≤ 60 KB.
- Servido con `pnpm dlx serve out`:
  - `/`, `/datos-bancarios`, assets, robots y sitemap responden 200; una ruta inexistente da 404;
  - `/#servicios-retiros` abre Retiros.
- Pruebas de comportamiento en Chrome headless:
  - ←/→/Home/End en las pestañas: mueven el foco, activan la pestaña y actualizan el hash.
  - La pausa del marquee funciona.
  - Al abrir el menú móvil, el foco va a "Sobre mí".
  - Reduced-motion: marquee sin animación, botón de pausa oculto, hero sin keyframes.
  - Sin JS: tres paneles visibles, tablist oculto y reveals visibles.
- Responsive: sin scroll horizontal (`scrollWidth == clientWidth`) en `/` a 360, 768, 1440 y 1920, y en `/404` y `/datos-bancarios` a 360. Capturas revisadas a ojo en 360, 768 y 1440.

## Checklist de aceptación (PLAN F8)

| Punto | Estado |
|---|---|
| `pnpm install --frozen-lockfile`, lint y build limpios | ✅ (build en copia limpia; ver desviación 9) |
| `ls out` con todos los archivos esperados, sin `logo-sadai.png` ni retrato original | ✅ |
| `as="font"` ≥ 2, og absoluto, 1 JSON-LD, 1 canonical | ✅ |
| Presupuesto JS: baja respecto de hoy | ✅ (225 → 191 KB gz) |
| Presupuesto JS: home ≤ 110 KB gz | ❌ 144 KB (pendiente, fase Lighthouse) |
| Fuentes ≤ 60 KB | ✅ ~44 KB |
| Servir `out/`, rutas, anclas, `#servicios-retiros`, 404 | ✅ |
| Sin scroll horizontal (360/768/1440/1920) | ✅ |
| Reflow a 320 px y zoom al 200 % | ⚠️ no verificado |
| Logotipo ≥ 220 px, sin deformar ni filtros | ✅ (navbar 220, hero 280–640, footer 260, firma 220) |
| Mapa de color por sección = PRD §5, con las desviaciones documentadas | ✅ |
| Established solo ≥ 28 px; títulos sin `¿ ¡ · – — …` | ✅ |
| Un `h1` por página; landmarks; nav con `aria-label` | ✅ |
| Teclado: tabs, pausa, menú (foco inicial, `Esc`, `inert`) | ✅ |
| Teclado: skip link y fachada del mapa | ✅ por código |
| Teclado: copiar | ✅ lógica intacta (el portapapeles no se probó en headless) |
| Contraste ≥ 4.5:1 en textos sobre degradado (medido) | ✅ |
| `prefers-reduced-motion` | ✅ |
| VoiceOver (lectura de precios, "se abre en otra pestaña") | ⚠️ no probado con lector real (el marcado `sr-only` está en su sitio) |
| Lighthouse | ⚠️ no ejecutado (siguiente fase) |
| Ninguna petición a terceros al cargar (mapa con fachada) | ✅ |
| Las 10 piezas presentes y funcionales | ✅ |
| Greps de F7 sin restos | ✅ (los hex que quedan en componentes están en comentarios, más `theme-color` en `_document`, que exige el plan) |
| Logos solo desde SVG oficiales, sin ® | ✅ |
| Tokens / fuentes / menú en su único lugar | ✅ |
| Mecánica de export idéntica | ✅ |
| "Atrás" del navegador tras cambiar de pestaña | ⚠️ no probado manualmente (se conserva `history.state`) |
| Safari iOS | ⚠️ no probado |

## TODOs pendientes para el usuario

1. **Copy por confirmar con Sadai.**
   - Nombre comercial (`site.nombre`, PRD §12.5).
   - Handle de Instagram (`nailsbysadai` vs `sadai.artisticnails`, §12.4).
   - Descripciones del menú (§12.6; `MOSTRAR_DESCRIPCIONES` las oculta todas).
   - Duraciones.
   - "Color liso #1 y 2" (§12.7).
   - Mensaje de higiene en Sobre mí (§12.9).
   - Dirección exacta y horarios reales (TODO en `site-config`).
2. **®.** Cuando IMPI confirme el registro, poner `REGISTRADA = true` en el script, correr `pnpm assets logos iconos og stickers` y añadir los stickers 04/05 a `Sticker.tsx`.
3. **Fotografía con licencia** para el hero (prop `foto` de `Hero`) y, si se quiere, más fotos de trabajos.
4. **Navbar de 100 px.** El logotipo mínimo es de 220 px; si se ve alto, consultarlo con diseño (PRD §12.11). Se ajusta en `--altura-navbar` + `ALTURA_NAVBAR_PX` + el ancho del logo.
5. **Fase Lighthouse.**
   - Bajar el JS de la home a ≤ 110 KB gz (p. ej. logos como sprite/`<img>` en vez de JSX inline; hoy el Logotipo se duplica en el chunk de `_app` y en el de la página).
   - Medir LCP/CLS.
   - Revisar si Lighthouse SEO se queja del `Disallow` + `noindex` de `/datos-bancarios`.
6. **Pruebas manuales pendientes:** VoiceOver, Safari iOS, zoom al 200 % y reflow a 320 px, botón "Atrás" tras cambiar de pestaña.
7. **Commits.** Ninguno hecho; los puntos de control sugeridos están en PLAN.md. El usuario decide.
