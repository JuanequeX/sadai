# Servicios con el Degradado 02

Antes, Servicios era `bg-rosa` plano con el Degradado 02 al 25 % solo en una franja superior.
Ahora el **Degradado 02** es el fondo de toda la sección, reencuadrado por zonas. Es CSS puro
(0 bytes) y lleva el grano de marca.

## Por qué el 02

| Degradado | Descartado / elegido | Motivo |
|---|---|---|
| 05 | Descartado | Ya es la base del hero ("seda" malva). |
| 03 | Descartado | Es Sobre mí, la sección inmediatamente anterior. |
| 01 | Descartado | Todo el 01 son tonos medios (#5e1427–#c47a8a). No deja zona clara: el texto vino y el marfil quedarían en ~3–4:1, y la sección se fundiría con el malva del hero y con el vino de Ubicación. |
| 04 | Descartado | Tiene un solo brillo central y la base vino. En una sección de 2000 px el brillo queda tapado por la tarjeta, y la base vino se pega a Ubicación (vino). |
| **02** | **Elegido** | Es el que tiene el **rosa más claro** de la serie (#f4abbb) y además un **vino profundo** (#48091c) con pliegues de satén. Así Servicios es la sección *clara* entre dos oscuras: Sobre mí termina en vino #310913 (móvil) o en vino y rosa (desktop), y Ubicación es vino. Las dos transiciones se ven con claridad y mantienen la misma familia de color. El satén del 02 es rosa y diagonal, distinto del malva apagado del hero. |

## Composición (tokens en `styles/globals.css`)

Todos los colores están muestreados del PNG oficial (`Degradado 02.png`, rejilla de 16×9).
Los vinos son #48091c, #5a172b, #702c3e, #803c4c y #8e4959. Los rosas son #c37a8a, #d18796,
#dd92a2, #e99dad, #f0a6b6 y #f4abbb.

**Anclas por zonas.** El fondo no depende de un alto fijo, así que se ve bien con Manos, Pies o
Retiros:
- **Zona superior**, en rem desde el borde de arriba: encabezado, notas y pestañas. Es rosa claro
  y opaco, así que el texto vino siempre tiene buen contraste.
- **Zona inferior**, en rem desde el borde de abajo: la tarjeta de cotización y el paso a
  Ubicación. Es rosa medio.
- **Entre las dos zonas** está el **satén vino del 02**, detrás de la tarjeta marfil. Hace que la
  tarjeta resalte y asoma en los márgenes y huecos. Con pestañas cortas (Pies, Retiros) asoma
  como una banda bajo la tarjeta.

| Breakpoint | Token | Encuadre |
|---|---|---|
| < 1024 px (columna única) | `--grad-servicios` | Rosa #eda3b3→#cd8494 opaco hasta 53rem, que se funde a transparente en 62rem (las pestañas acaban como mucho en 52,1rem a 320 px). Abajo, #dd92a2→#c98090 opaco hasta 24rem y transparente en 33rem. Debajo, la base vino del 02 a 200° con un pliegue claro a 158°. Esquina superior izquierda en #c37a8a (guiño al vino superior izquierdo del 02) y brillo #f7b4c4 a la derecha, junto a las notas. |
| ≥ 1024 px | `--grad-servicios-lg` + `--grad-servicios-lg-size` | El 02 en horizontal: vino a la izquierda, en la columna de la tarjeta, con un pliegue de satén en arco, y brillo rosa #f7b4c4 a la derecha, en la columna de notas. La capa vino mide `min(64%, 50% + 12rem)` de ancho, así que su borde curvo termina en el hueco entre tarjeta y notas a cualquier ancho (1024 a 1920). Franja superior rosa opaca hasta 32rem (pestañas) y franja inferior opaca hasta 26rem (cotización). |

- La capa vino de desktop va dimensionada con `background-size` porque Chrome **no acepta**
  `calc(% + rem)`/`min()` como tamaño de un `radial-gradient()`: invalida toda la declaración.
  Lo comprobé en la consola.
- **Grano:** la utilidad `.grano` (SVG de 180 px, overlay al 12 %) llega a través de
  `Degradado grano`.
- **Respaldo:** `background-color: #d18796` (rosa medio del 02). Si fallan los degradados, el
  texto vino sigue por encima de 5:1.

## Cambios de color para el contraste

- **Lead:** `text-vino-80` → `text-vino`. Sobre #e99dad, el vino-80 daba unos 4:1.
- **Tarjeta marfil:** borde `border-linea` → `border-vino`. Sobre rosa claro, el contorno lo pone
  el borde vino; sobre el satén vino, lo pone el relleno marfil.
- **Tarjeta de cotización:** se añade `border-vino` y un anillo exterior marfil al 55 %
  (`shadow-[0_0_0_1px_…]`). Sobre rosa destaca el borde vino y sobre vino destaca el anillo. Con
  el anillo `linea-clara` (40 %) solo, la esquina superior izquierda en desktop quedaba en 2,4:1.
- Siguen igual: h2 (vino), pill (`tono="claro"`), pestañas (borde vino; la activa en
  `bg-vino text-rosa`), notas (borde, viñetas y firma en vino). Todo se mantiene vino porque
  queda siempre sobre la zona rosa clara. No hizo falta añadir velos.

## Contraste medido (build de producción, píxeles renderizados)

Script: `scratchpad/servgrad/contraste.cjs`. Ajustes de la medición: Playwright con Chrome,
`reducedMotion`, la barra de navegación oculta y las tres pestañas en cada ancho.

**Texto:**
1. Se ocultan texto y bordes y se captura la sección.
2. Por cada línea de texto (`Range.getClientRects()`) se toma el **percentil 2 del ratio** por
   píxel, que equivale al p98 del fondo más desfavorable.

**Contornos:** se mide en cada punto del perímetro, fuera de las esquinas redondeadas. Se compara
el fondo a 4 px por fuera con el anillo exterior, con el borde y con el relleno, y vale el par
con más contraste. De todos los puntos se toma el p2.

Mínimo de las tres pestañas (Manos/Pies/Retiros):

| Elemento (umbral) | 320 | 360 | 768 | 1024 | 1440 | 1920 |
|---|---|---|---|---|---|---|
| h2 (≥3) | 6,52 | 6,57 | 6,78 | 7,20 | 7,04 | 6,99 |
| Lead (≥4,5) | 6,44 | 6,44 | 6,65 | 6,81 | 6,62 | 6,57 |
| Pill: texto (≥4,5) | 6,75 | 6,76 | 6,86 | 7,65 | 7,51 | 7,48 |
| Pestaña inactiva: texto (≥4,5) | 5,34 | 5,36 | 5,56 | 5,98 | 5,74 | 5,63 |
| Pestaña inactiva: borde (≥3) | 5,28 | 5,34 | 5,54 | 5,83 | 5,62 | 5,49 |
| Pestaña activa: relleno vs fondo (≥3) | 5,28 | 5,34 | 5,54 | 5,83 | 5,62 | 5,53 |
| Pestaña activa: texto rosa/vino (≥4,5) | 9,91 | 9,91 | 9,91 | 9,91 | 9,91 | 9,91 |
| Notas: borde (≥3) | 5,54 | 5,58 | 5,79 | 5,31 | 5,74 | 5,74 |
| Notas: título (≥4,5) | 6,50 | 6,49 | 6,30 | 5,56 | 5,56 | 5,56 |
| Notas: texto (≥4,5) | 5,68 | 5,70 | 5,93 | 6,42 | 6,30 | 6,40 |
| Notas: viñetas (≥3) | 5,77 | 5,79 | 6,08 | 6,37 | 6,22 | 6,25 |
| Notas: "+" (móvil, ≥3) | 7,98 | 8,00 | 8,18 | — | — | — |
| Firma "Artistic Nails" (≥4,5) | 5,56 | 5,63 | 6,25 | 5,98 | 7,88 | 7,94 |
| Firma: íconos (≥3) | 5,54 | 5,57 | 6,10 | 5,96 | 7,78 | 7,78 |
| Salpicadura (≥3) | 7,17 | 7,17 | 7,18 | 6,47 | 6,32 | 6,25 |
| Contorno de la tarjeta marfil (≥3) | 4,11 | 4,09 | 4,02 | 4,29 | 4,11 | 4,13 |
| Contorno de la cotización (≥3)* | 3,59 | 5,02 | 5,08 | 5,38 | 3,92 | 3,56 |

\* No es obligatorio por WCAG (es un contenedor, no un control), pero se cuidó para que la tarjeta
no se funda con el satén vino. El texto interior no cambia: su fondo es el mismo `--grad-cotizacion`.

Todo pasa AA, con 0 fallos en 18 combinaciones de ancho y pestaña. El borde de la pill
(`linea`, decorativo) mide ≥6,7:1. En desktop las notas no se desplazan: el contenedor de la
grilla es `items-start` y el sticky no tiene recorrido. Aun así, la columna derecha es rosa en
toda su altura.

## Rendimiento y responsive

- **0 bytes**: no se descarga ninguna imagen.
- **CLS**: 0,0000 a 360 y a 1440, recorriendo la página y cambiando de pestaña.
- **LCP**: sin cambios. Sigue siendo la capa del hero en móvil y el H1 en desktop.
- **Responsive**: sin scroll horizontal a 320, 360, 768, 1024, 1440 ni 1920, en las tres
  pestañas. La sección mide de 1324 a 2245 px de alto según el ancho y la pestaña.
- **Animación**: no hay, así que `prefers-reduced-motion` no aplica.
- **Funcionalidad intacta**: pestañas WAI-ARIA, alto dinámico, notas arriba en móvil, botones
  Agendar e `id`s `#servicios-*`. El `<section id="servicios">` lo renderiza ahora
  `Degradado as="section"`, con los mismos `id` y `aria-labelledby`.

## Verificación

- Capturas de producción revisadas a ojo a 320, 360, 768, 1024, 1440 y 1920 px en las tres
  pestañas (`scratchpad/servgrad/shots/final-*`). Cada captura incluye 300 px de Sobre mí y el
  inicio de Ubicación para ver las transiciones.
- `pnpm lint` limpio.
- `pnpm build` (export estático) correcto en una copia aparte.

## Archivos tocados

- `components/sections/Servicios.tsx`: la sección pasa a `Degradado as="section" variante="02"
  grano` con la clase `styles.servicios`. Se quita la franja del 02 al 25 % y el lead pasa a
  `text-vino`.
- `components/sections/Servicios.module.scss` (nuevo): `section.servicios` con el respaldo
  #d18796, `--grad-servicios` y, en lg+, `--grad-servicios-lg` y su `background-size`.
- `styles/globals.css`: solo se añaden `--grad-servicios`, `--grad-servicios-lg` y
  `--grad-servicios-lg-size`. Los demás tokens no cambian.
- `components/servicios/MenuServicios.tsx`: la tarjeta marfil pasa a `border-vino`.
- `components/servicios/TarjetaCotizacion.tsx`: se añade `border-vino` y el anillo marfil al
  55 %, más el comentario.

## Ajuste: satén vino anclado a la tarjeta (2026-11-09)

Con categorías cortas (Pies, Retiros) la sección baja de alto y la elipse vino —medida en % del
alto de la sección y recortada por las bandas rosas en rem— quedaba aplastada en una franja con
borde duro. Ahora el vino es un `::before` de la caja de paneles (`.halo` en
`components/servicios/MenuServicios.module.scss`) con `radial-gradient(closest-side, …)`
(token `--grad-servicios-halo`): su tamaño sigue al de la tarjeta activa, así que conserva la
forma con 3 o 7 servicios. Se quitaron las capas vino de `--grad-servicios` y
`--grad-servicios-lg` (y `--grad-servicios-lg-size`). El halo arranca 1.5rem bajo el borde
superior de la tarjeta (no toca las pestañas) y termina antes de la columna de notas.
