# Sobre mí con el Degradado 03

La dueña pidió quitar el fondo marfil y la mancha gris enorme de "Sobre mí" ("no van con mi
personalidad") y usar el **Degradado 03** del brand book (la espiral rosa/vino).

## Decisiones

- **La imagen va como fondo CSS con `image-set()` AVIF/WebP**, mediante `Degradado variante="03"`
  (`as="section"`). Antes había una `url()` WebP de respaldo para navegadores sin `image-set()`.
  Es decorativa, así que no lleva `<img>`.
- **La imagen se suaviza y el grano lo pone CSS.** El PNG original (1920×1080, 5,9 MB) trae grano
  fino. Codificado así, pesa cientos de KB, y ampliado por `cover` se ve como manchas. El script lo
  reduce a 640 px, aplica `blur(2.5)` y lo reescala. El grano vuelve con la utilidad `.grano`, que
  ya existía: es un SVG de 180 px, nítido a cualquier DPR, y además tapa el banding del AVIF de 8 bits.
- **Hay dos recortes: vertical en móvil y horizontal desde `md`.** En móvil la sección mide
  unos 360×2000. Con la imagen horizontal a `cover` se vería una franja del 8 % del ancho, ampliada
  unas 5 veces. Por eso el móvil usa la imagen girada 90°: rosa arriba, la espiral en medio y vino
  abajo.
- **El velo es moderado y solo cubre la zona del texto.** Un velo de `#310913` al 50 % deja
  cualquier píxel del Degradado 03 con contraste ≥ 5:1 frente al marfil, así que no hace falta
  tapar el fondo y la espiral se sigue viendo a través del velo. En `md+`, el desvanecido del velo
  cae detrás del retrato, que es opaco, y así no se ve un corte vertical.
- **El texto pasa a marfil** (`text-marfil`): título, subtítulo, cuerpo, la pill "Sobre mí"
  (`tono="oscuro"`) y las tarjetas.
- **Las tarjetas de propuesta son de "vidrio vino"**: `rgb(49 9 19 / .62)` con borde
  `linea-clara`. Así el contraste no depende del trozo de espiral que les toque. No usan
  `backdrop-filter`, que es caro en móvil.
- **El retrato lleva una sombra vino** para separarse del rosa. Los stickers 07 y 10 y la pill
  "Desde 2024" (marfil sobre la foto) siguen igual y se leen bien: el contorno vino de los stickers
  destaca sobre el rosa, y su relleno rosa sobre el vino.
- **El color de respaldo es `#310913`**, el tono más oscuro muestreado del degradado. Se usa
  mientras carga la imagen y debajo de ella en móvil, así que el corte con la imagen no se nota.
- **Se quitó la mancha** (`<Recurso nombre="mancha">`) de Sobre mí. El componente `Recurso` y la
  mancha se mantienen porque los usa `pages/404.tsx`.

## Encuadres (`--d03-size` / `--d03-pos` en `SobreMi.module.scss`)

| Breakpoint | Imagen | Tamaño | Posición | Resultado |
|---|---|---|---|---|
| < 768 px | `degradado-03-vertical-720` | `max(100%, 48rem) auto` | `35% 0%` | Retrato sobre el rosa, núcleo de la espiral bajo título y texto, vino bajo las tarjetas (fondo sólido `#310913` al terminar la imagen) |
| 768–1023 | `degradado-03-1280` | `cover` | `40% 50%` | Rosa tras el retrato y espiral bajo la columna de texto |
| 1024–1279 | `degradado-03-1280` | `cover` | `0% 50%` | Ídem en el layout de 5/7 columnas |
| ≥ 1280 | `degradado-03-1920` | `cover` | `0% 50%` | Ídem |

Velo (`.velo`, z −2, debajo del grano):
- **Móvil:** transparente hasta el final del retrato, que se calcula con `--espacio-seccion` y el
  ancho del retrato en 4:5. Desde ahí hasta el final, `rgb(49 9 19 / .5)`.
- **`md`:** `to left`, 50 % del ancho sin cambios y desvanecido al 80 %.
- **`lg`:** 58 % del ancho y desvanecido al 76 %.

## Pesos (`pnpm assets imagenes --con-degradado-03`)

| Archivo | AVIF (q60) | WebP (q80) |
|---|---|---|
| `degradado-03-vertical-720` (720×1280) | 6,8 KB | 7,0 KB |
| `degradado-03-1280` (1280×720) | 6,8 KB | 7,2 KB |
| `degradado-03-1920` (1920×1080) | 11,2 KB | 13,6 KB |

Cada viewport baja una sola imagen, comprobado con contextos limpios de Playwright: 360 baja la
vertical-720, 1440 la de 1920. Está muy por debajo del objetivo de ≤ 80 KB.
- **LCP:** sin cambios. El LCP sigue siendo el hero: H1 en desktop y la capa del hero en móvil.
  El fondo es CSS en una sección bajo el pliegue y no es candidato.
- **CLS:** 0, porque el fondo no participa en el layout.
- **Animación:** no hay, así que no aplica `prefers-reduced-motion`.

## Contraste medido (build de producción, píxeles renderizados)

Método (`scratchpad/sobremi/tools/contraste.cjs`):
1. Se oculta el texto de la sección (color y bordes transparentes).
2. Se captura la sección completa.
3. Para cada caja de contenido (sin padding) se calcula el ratio por píxel contra el color del
   texto y se toma el **percentil 2 del ratio**, que equivale al percentil 98 de la luminancia del
   fondo.

| Viewport | h2 (≥3) | subtítulo (≥3) | cuerpo (≥4,5) | pill "Sobre mí" | tarjetas h3 / p (mín.) |
|---|---|---|---|---|---|
| 320 | 9,76 | 8,64 | 6,28 | 13,32 | 16,02 / 16,69 |
| 360 | 9,37 | 8,13 | 6,10 | 12,43 | 15,80 / 16,54 |
| 768 | 5,06 | 5,80 | 6,58 | 4,99 | 12,27 / 11,97 |
| 1024 | 5,02 | 5,19 | 5,46 | 5,05 | 6,54 / 6,55 |
| 1440 | 5,32 | 6,03 | 6,43 | 4,99 | 6,58 / 6,55 |
| 1920 | 5,40 | 5,94 | 6,34 | 5,21 | 6,97 / 6,87 |

Todo pasa AA. El caso más justo es la pill (texto pequeño), con 4,99:1. Las tarjetas más claras
son las que caen sobre el rosa a la izquierda.

## Verificación

- Capturas a 320, 360, 768, 1024, 1440 y 1920 px, revisadas a ojo. A 390 px @3x no hay pixelado
  y el grano se ve nítido. No hay scroll horizontal en ningún ancho.
- `pnpm lint` limpio.
- `pnpm build` (export estático) correcto en una copia aparte.

## Archivos tocados

- `components/sections/SobreMi.tsx`: usa `Degradado` 03, añade el velo, quita la mancha y cambia
  los colores a marfil.
- `components/sections/SobreMi.module.scss` (nuevo): encuadre, velo, sombra del retrato y tarjetas.
- `components/ui/Degradado.module.scss`: `.v03` responsive (vertical, 1280 y 1920), con encuadre
  por `--d03-size` y `--d03-pos`.
- `components/ui/Degradado.tsx`: solo el comentario.
- `scripts/optimizar-assets.mjs`: `--con-degradado-03` suaviza la imagen y genera
  vertical-720, 1280 y 1920. Las variantes 960 y 1920 anteriores nunca se habían publicado.
- `public/img/degradado-03-{vertical-720,1280,1920}.{avif,webp}` (nuevos).
