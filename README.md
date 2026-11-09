# Sadai — sitio web

Landing de Sadai, estudio de uñas artísticas en Manzanillo, Colima. Next.js 16 (Pages Router),
React 19, Tailwind v4 + SCSS modules. Se publica como export estático en GitHub Pages
(`output: "export"`, `public/CNAME` = `sadai.mx`; ver `.github/workflows/deploy.yml`).

## Desarrollo

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm lint
pnpm build   # genera out/ (con webpack; ver nota abajo)
pnpm dlx serve out   # sirve el export como GitHub Pages
```

`pnpm dev` usa Turbopack (el default de Next 16) y `pnpm build` usa webpack (`next build --webpack`,
opción documentada por Next). Con Pages Router, Turbopack duplica React y su runtime entre el chunk
de `_app` y el de cada página; webpack los deduplica y la home baja ~16 KB gzip de JS. Detalle y
mediciones en `docs/rebranding/LIGHTHOUSE.md`.

## Identidad y datos

- Tokens de color, tipografía y degradados: `styles/globals.css` (`@theme` y `:root`), con espejo
  SCSS en `styles/_tokens.scss`. No se agregan colores fuera de la paleta del brand book.
- Fuentes: solo en `lib/fonts.ts` (Established local + Plus Jakarta Sans vía `next/font/google`).
- Datos del negocio: `lib/site-config.ts`. Menú de servicios y precios: `lib/menu-servicios.ts`.
- Diseño de referencia: `docs/rebranding/PRD.md`.

## Assets de marca

Los logotipos, recursos, stickers, íconos, imágenes y la imagen OG se generan desde el brand book
con `scripts/optimizar-assets.mjs` (sharp + svgo). Las salidas se commitean; el brand book no.

Requisitos: `docs/brand-identity/` presente en local (≈ 450 MB, ignorado por git) y el retrato
original en `assets/fuente/sadai-retrato.png`.

```bash
pnpm assets todo                 # o: logos | recursos | stickers | iconos | imagenes | og
pnpm assets imagenes --con-degradado-03   # opcional: variante por imagen del Degradado 03
```

- `REGISTRADA` (al inicio del script) elige versiones con o sin ®. Hoy `false`: sin ®, y por eso
  no se publican los stickers 04/05, que traen el ® integrado.
- Los componentes de `components/marca/` llevan la cabecera "Generado por…": no editarlos a mano.

La fuente de títulos (Established, licencia web confirmada por el cliente) se recorta aparte con
fontTools vía `uvx` (el zip se extrae fuera del repo):

```bash
uvx --from 'fonttools[woff]' pyftsubset /ruta/a/OpenType-PS/Established.otf \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0152-0153,U+2018-201A,U+201C-201E,U+2022,U+2026,U+20AC" \
  --layout-features="kern,liga,dlig" --name-IDs="0,1,2,3,4,5,6,7,13,14" \
  --flavor=woff2 --output-file=styles/fonts/Established-Regular.woff2
```

Established no tiene `¿ ¡ · – — …`: evitarlos en títulos.
