# PRD — Rebranding total de la landing de Sadai

- **Estado:** Borrador v1 (fase 1: exploración + PRD)
- **Fecha:** 2026-11-08
- **Rama:** `rebranding-total` (desde `main`)
- **Fuente de verdad:** `docs/brand-identity/` (brand book oficial + assets). Las ramas
  `identidad-propuesta-01/02` (paleta burdeos/periwinkle, STIX Two Text, isotipo "S" propio)
  quedan **obsoletas**: no reutilizar su paleta, fuentes ni isotipo.
- **Documento relacionado:** `docs/prd-motor-de-citas.md` (futuro `/reserva-una-cita`; fuera de alcance aquí).

> Este documento es autosuficiente: el agente que implemente **no necesita volver a leer el
> brand book**. Todas las rutas de assets son relativas a la raíz del repo.
> Abreviatura: `BI/` = `docs/brand-identity/`.

---

## 0. Resumen ejecutivo

1. La identidad cambia por completo: **Vino Sadai `#440019`**, **Rosa Pétalo `#FFB3C3`**,
   **Marfil Seda `#F9F8F4`**; títulos en **Established Regular** (serif condensada),
   subtítulos **Plus Jakarta Sans SemiBold**, cuerpo **Plus Jakarta Sans Regular**.
2. Logotipo: wordmark caligráfico "Sadai" + símbolo "S" dentro de óvalo + "S" sola. Hay SVG
   oficiales de todas las versiones (con y sin ®). Mínimo digital del logotipo: **220 px**.
3. Lenguaje visual: **degradados vino↔rosa con grano**, fotografía cinematográfica de manos,
   **pills con contorno fino** (categorías, etiquetas, botones), recursos gráficos orgánicos
   (destello, salpicadura, espiral, uña) y stickers.
4. Las 10 secciones/páginas actuales se mantienen. **Servicios** pasa a ser el **menú de
   servicios interactivo** (13 servicios en 3 categorías + 4 notas) con precios reales.
5. Bloqueantes a confirmar: licencia web de *Established* (repo público), derechos de la
   fotografía del brand book, uso del ®, handle de Instagram. Ver §12.

---

## 1. Objetivo y alcance

### 1.1 Objetivo
Rebranding **total** y profesionalización de `sadai.mx`: aplicar la identidad oficial del brand
book de forma fiel, con un sitio editorial, sofisticado y rápido que convierta visitas en citas
por WhatsApp.

### 1.2 En alcance
- Sustituir por completo tokens de color, tipografía, logotipos, favicon/manifest, OG image,
  elementos decorativos y copy de todas las secciones.
- Mantener **todas** las secciones y páginas: Navbar, Hero, Marquee, Sobre mí, Servicios,
  Ubicación, CTA, Footer, `/404`, `/datos-bancarios` (noindex, `BotonCopiar` / `CampoCopiable`).
- Rediseñar **Servicios** como menú de servicios web interactivo y accesible (§7).
- Full responsive (360 px → 1920 px+).
- Metas Lighthouse (móvil, build de producción): **Performance ≥ 95, Accesibilidad 100,
  Best Practices 100, SEO 100**.
- Seguir publicando como **export estático en GitHub Pages** (`output: "export"`,
  `images.unoptimized`, `public/CNAME = sadai.mx`, sin `basePath`).

### 1.3 Fuera de alcance
- Motor de citas / formulario `/reserva-una-cita` (PRD aparte).
- Gift cards digitales (hay plantilla Canva en `BI/Gift Card digital/`; posible fase futura).
- Blog, galería con CMS, pagos en línea, multi-idioma.

### 1.4 Funcionalidad que debe conservarse (inventario actual)
| Pieza | Comportamiento actual a mantener |
|---|---|
| `lib/site-config.ts` | Única fuente de verdad: nombre, tagline, WhatsApp `523141434680`, teléfono visible `314 143 4680`, mensajes WhatsApp, Instagram, `mapsUrl`, `coords {19.1113967, -104.3359845}`, dirección/horarios (con TODO), `fundado: 2024`, `datosBancarios` (BBVA, titular, cuenta de 16 dígitos), `crearWhatsappHref`, `whatsappHref`, `mapaEmbedSrc`, `navLinks` (`ancla` + `href` con `/` delante), `comprobanteHref`. |
| Navbar | Fijo; transparente arriba y con fondo al pasar 40 px; resalta la sección activa (`aria-current`) midiendo una vez por frame; menú móvil a pantalla completa con bloqueo de scroll, `Esc`, `aria-expanded/controls`; enlace a `/datos-bancarios` **solo** en menú móvil; CTA WhatsApp en desktop. |
| Marquee | Banda en bucle sin huecos (copias calculadas con `ResizeObserver`), respeta `prefers-reduced-motion`. |
| Reveal | Aparición al entrar en viewport; `<noscript>` en `_document` fuerza `[data-reveal]` visible sin JS. |
| Hero | Animación de entrada por CSS (no JS) para que el above-the-fold sea visible sin JS. |
| Ubicación | iframe de Google Maps sin API key, `loading="lazy"`, botón "Cómo llegar". |
| `/datos-bancarios` | `noindex`; campos copiables (cuenta agrupada de 4 en 4, se copia sin espacios); "Copiar los tres datos"; botón WhatsApp para enviar comprobante. |
| `/404` | `noindex`, enlace a inicio. |
| `_app.tsx` | Variables de fuente inyectadas en `:root` (no en un div) para que los tokens `--font-*` de Tailwind v4 resuelvan. Mantener este patrón. |

Stack: Next 16.3 (Pages Router), React 19.2, Tailwind v4 (`@theme` en `styles/globals.css`),
SCSS modules con espejo de tokens en `styles/_tokens.scss`, `motion` 13, `lucide-react`.
Antes de tocar fuentes/imágenes leer `node_modules/next/dist/docs/02-pages/01-getting-started/05-fonts.md`
y `04-images.md` (AGENTS.md: esta versión de Next tiene cambios).

> Bug menor detectado: `site.mensajeWhatsApp` termina en "✨" aunque el comentario dice "sin
> emoji: WhatsApp lo corrompe". Quitar el emoji en el rebranding.

---

## 2. Contexto de marca (identidad verbal)

### 2.1 Esencia
- **Brand positioning statement:** *"El arte de expresar quién eres."* SADAI es un estudio de
  uñas artísticas que transforma el cuidado personal en una experiencia de expresión individual:
  creatividad, precisión y atención al detalle; diseños personalizados que reflejan identidad,
  estilo y personalidad.
- **Posicionamiento:** *"De un servicio de uñas a una experiencia de expresión personal."*
  Estudio **privado** de uñas artísticas donde técnica, diseño y cuidado se encuentran. Espacio
  de creatividad, tranquilidad y sofisticación. Tres atributos diferenciales:
  **Personalización** (diseños que reflejan identidad), **Precisión** (técnica, calidad,
  detalle), **Experiencia** (entorno íntimo, cuidado y cercano).
- **Concepto rector:** ***Beauty as Self-Expression.*** La belleza no se define por estándares
  sino por la libertad de expresar quiénes somos. Territorio conceptual:
  **detalle + identidad + actitud**.
- **Propuestas de valor** (usar textualmente en "Sobre mí"):
  1. **Diseños con identidad** — Cada diseño nace de la personalidad y las preferencias de quien
     lo lleva, creando resultados auténticos y personalizados.
  2. **Arte en cada detalle** — La combinación de técnicas, precisión y creatividad transforma
     cada aplicación en una propuesta estética cuidadosamente ejecutada.
  3. **Una experiencia para ti** — Un espacio privado y cercano que prioriza la tranquilidad, la
     comodidad y la atención personalizada en cada visita.
  4. **Sofisticación sin pretensiones** — Una experiencia premium que combina calidad, estética
     contemporánea y profesionalismo con una personalidad fresca y auténtica.

### 2.2 Personalidad
Creativa, segura y auténtica; equilibra sofisticación y frescura; confianza sin distancia.
Seis rasgos: **Artística** (creativa, detallista, expresiva) · **Auténtica** (personal, segura,
sin pretensiones) · **Contemporánea** (fresca, actual, abierta a explorar) · **Sofisticada**
(elegante, cuidada, con criterio estético) · **Cercana** (cálida, natural, accesible) ·
**Femenina** (delicada, con carácter y sin estereotipos).

### 2.3 Voz y tono
Expresiva, segura, cercana y sofisticada. Mensajes **breves, directos y memorables**; habla de
arte, diseño y belleza sin exageraciones ni clichés.

| SÍ comunica | NO comunica |
|---|---|
| Con seguridad y naturalidad | Con frases genéricas de salón |
| Desde el arte y la expresión | Con clichés de belleza |
| Con elegancia y cercanía | Con frialdad o superioridad |
| Con mensajes breves y claros | Con textos saturados |
| Inspirando la individualidad | Imponiendo estándares de belleza |
| Destacando la experiencia | Recurriendo a la promoción excesiva |

Comparativo oficial ("En lugar de" → "SADAI dice"):
- ¡Luce unas uñas hermosas y perfectas! → **El arte también se lleva en las manos.**
- Tenemos diseños increíbles para todas. → **Tus uñas. Tu forma de decirlo.**
- ¡Ven y consiéntete con nuestro servicio! → **Un momento para ti. Un diseño que habla de ti.**
- ¡Agenda ya! ¡No te quedes sin lugar! → **Tu próxima expresión comienza aquí. Agenda tu cita.**

Banco de frases aprobadas (aparecen en brand book y plantillas de redes):
"Tus uñas. Tu forma de decirlo." · "El arte también se lleva en las manos." · "El arte no tiene
límites. Tus uñas tampoco." · "Expresión sin límites." · "El detalle también es una forma de
arte." · "Tu personalidad también se lleva en las manos." · "Hay algo detrás de cada trazo." ·
"Un momento para ti y tus uñas." (gift card) · "Agenda una cita" / "Agenda tu cita" (CTA) ·
"En Sadai, cada diseño es una oportunidad para llevar tu estilo, tu personalidad y aquello que
te hace única."

Reglas de copy para la web: tuteo; sin signos de exclamación; sin "¡Agenda ya!", "precios
increíbles", "consiéntete"; nada de mayúsculas sostenidas en frases largas.

### 2.4 Público
Mujeres de Manzanillo, Colima (y visitantes) que buscan diseño de uñas personalizado y una
experiencia privada, tranquila y cuidada; valoran estética contemporánea y atención uno a uno.
Llegan mayoritariamente desde Instagram/WhatsApp en **móvil** → diseño mobile-first.

### 2.5 Nombre
El brand book usa **"Sadai"/"SADAI"** con taglines **"Artistic Nails"** y **"Nails by"**. El
sitio hoy usa `nombre: "Nails by Sadai"`. Propuesta: `nombre: "Sadai"`,
`tagline: "Artistic Nails"`, y en textos largos "Sadai Artistic Nails" (pendiente §12).
En copy corrido escribir "Sadai" (capitalizado); "SADAI" solo si se quiere énfasis.

---

## 3. Sistema visual

### 3.1 Color

#### Paleta oficial (brand book p. 22)
| Token propuesto | Nombre de marca | HEX | RGB | Impresos | Rol |
|---|---|---|---|---|---|
| `--color-vino` | Vino Sadai (primario) | `#440019` | 68 0 25 | PANTONE 4102 C · CMYK 48 96 53 74 | Texto principal sobre claros; fondos oscuros; logotipo. |
| `--color-rosa` | Rosa Pétalo (secundario) | `#FFB3C3` | 255 179 195 | PANTONE 1767 C · CMYK 0 41 10 0 | Fondos de sección; logotipo/acentos sobre vino. |
| `--color-marfil` | Marfil Seda (terciario) | `#F9F8F4` | 249 248 245* | CMYK 3 2 5 0 | Fondo neutro, tarjetas, texto sobre vino/fotos. |

\* El brand book da RGB 249 248 245 (= `#F9F8F5`) y HEX `#F9F8F4`; los SVG oficiales usan
`#f9f8f4`. **Usar `#F9F8F4`.**

**Jerarquía cromática oficial: 45 % vino · 45 % rosa · 10 % marfil.** (El texto del brand book
menciona "naranja, café oscuro y beige": es un residuo de plantilla; ignorarlo.) Agregar colores
nuevos requiere aprobación del director creativo → los derivados de abajo son **solo tintes de
la paleta** para estados y texto secundario, nunca colores nuevos de marca.

#### Derivados funcionales (mezclas de la paleta)
| Token | HEX | Construcción | Uso |
|---|---|---|---|
| `--color-vino-hover` | `#5A1E33` | vino 88 % + marfil | Hover de botones vino. |
| `--color-vino-80` | `#683245` | vino 80 % + marfil | Texto secundario sobre marfil o rosa. |
| `--color-vino-70` | `#7A4A5B` | vino 70 % + marfil | Texto terciario/metadatos **solo sobre marfil** (o rosa-claro). |
| `--color-rosa-claro` | `#FFE1E7` | rosa 40 % + blanco | Superficies suaves (filas hover del menú, tarjetas sobre rosa). |
| `--color-marfil-75` | `#CCBABD` | marfil 75 % + vino | Texto secundario sobre vino. |
| `--color-rosa-75` | `#D08698` | rosa 75 % + vino | Solo decorativo/bordes sobre vino (no texto < 18 px). |
| `--color-linea` | `rgb(68 0 25 / 0.35)` | vino 35 % | Contorno de pills y tarjetas sobre claros. |
| `--color-linea-clara` | `rgb(249 248 244 / 0.4)` | marfil 40 % | Contorno de pills sobre vino/degradados. |

`theme-color` y `manifest.theme_color`: `#440019`; `background_color`: `#F9F8F4`.
`::selection`: fondo rosa, texto vino. Puro blanco `#FFFFFF` y negro solo para logotipo
positivo/negativo sobre foto (§3.3).

#### Contrastes WCAG 2.x verificados (calculados)
| Texto / Fondo | Ratio | Normal (AA 4.5) | Grande ≥ 24 px o 18.66 px bold (AA 3) |
|---|---|---|---|
| vino `#440019` / marfil `#F9F8F4` | **15.69** | AAA | AAA |
| vino / blanco | 16.67 | AAA | AAA |
| vino / rosa `#FFB3C3` | **9.91** | AAA | AAA |
| rosa / vino | **9.91** | AAA | AAA |
| marfil / vino | **15.69** | AAA | AAA |
| vino / rosa-claro `#FFE1E7` | 13.63 | AAA | AAA |
| vino-80 `#683245` / marfil | 9.27 | AAA | AAA |
| vino-80 / rosa | 5.86 | AA | AAA |
| vino-70 `#7A4A5B` / marfil | 6.68 | AA | AAA |
| vino-70 / rosa | 4.22 | **falla** | AA |
| vino-70 / rosa-claro | 5.81 | AA | AAA |
| marfil-75 `#CCBABD` / vino | 8.99 | AAA | AAA |
| rosa-75 `#D08698` / vino | 5.99 | AA | AAA |
| marfil / vino-hover `#5A1E33` | 11.85 | AAA | AAA |
| **rosa / marfil** | **1.58** | **prohibido** | **prohibido** |
| marfil / tono medio de degradado `#A35E6E` | 4.51 | AA (justo) | AA |
| marfil / tono rosado de degradado `#C8838F` | **2.78** | falla | **falla** |
| vino / tono medio de degradado `#A35E6E` | **3.48** | falla | AA |
| vino / tono claro de degradado `#E19CA9` | 7.56 | AAA | AAA |
| marfil / tono oscuro de degradado `#6C2436` | 10.17 | AAA | AAA |
| rosa / tono medio de degradado | 2.85 | falla | falla |

Reglas derivadas:
1. Texto sobre **degradados**: solo marfil sobre zonas con luminancia ≤ `#A35E6E` (ideal: zonas
   vino) **o** vino sobre zonas ≥ `#E19CA9`. Nunca texto de cuerpo sobre la zona media
   (`#B0..#C8`). Si el texto cae en zona media, añadir velo (`linear-gradient` vino 0→45 %
   detrás del bloque de texto). Verificar con capturas en 360/768/1280.
2. Rosa **nunca** como color de texto o borde funcional sobre marfil/blanco (1.58:1).
3. Indicadores no textuales (bordes de input, foco, pills activas) ≥ 3:1: usar vino sobre
   claros y marfil/rosa sobre vino.

### 3.2 Tipografía

| Rol | Familia | Peso | Fuente del archivo |
|---|---|---|---|
| Títulos (h1–h3, números grandes, 404) | **Established** | Regular 400 (única) | `BI/Branding/3. Sistema tipográfico/established-classy-and-elegant-condensed-serif-2026-04-07-05-53-32-utc.zip` → `Web-PS/Established.woff2` (18 KB) o `Web-TT/Established.woff2` (26 KB) |
| Subtítulos, etiquetas, botones, precios en menú | **Plus Jakarta Sans** | SemiBold 600 | `BI/.../Plus_Jakarta_Sans.zip` (OFL 1.1) o Google Fonts |
| Cuerpo | **Plus Jakarta Sans** | Regular 400 | idem |

Notas de Established (inspeccionada con fontTools):
- Typia Nesia Std., v1.000, 211 glifos, `fsType = 4` (Preview & Print), features `liga`, `dlig`.
  Métricas: UPM 1000, ascender 801, descender −249, x-height 540, cap-height 750.
- Serif **condensada de alto contraste**: astas finas → usar solo ≥ 28 px; nunca para cuerpo.
- **No tiene `¿ ¡ · – —`.** Cubre el resto de español (á é í ó ú ñ ü, comillas tipográficas,
  €, $). Consecuencias: evitar títulos con `¿`/`¡` (la voz de marca no usa exclamaciones;
  reformular preguntas) y poner fallback serif en el stack para que el navegador sustituya
  el glifo: `font-family: var(--fuente-titulo), "Times New Roman", Georgia, serif`.
- Una sola variante: aplicar `font-synthesis: none` en títulos (nada de negritas/itálicas falsas).
  El zip trae "Established Oblique" pero el brand book no la usa → no cargarla.
- Cómo servirla: **`next/font/local`** desde `styles/fonts/Established-Regular.woff2`
  (subset latin + latin-1 con `pyftsubset`, objetivo ≤ 15 KB), `display: "swap"`,
  `preload: true`, `adjustFontFallback: "Times New Roman"`, `variable: "--fuente-titulo"`.
  Extraer el zip **fuera del repo** (ya hay una copia en
  `/private/tmp/claude-501/-Users-juanequex-codebase-sumus-sadai/6ce9faa1-4d11-4938-b973-052e4c5662c5/scratchpad/fonts/established/`).
- **Licencia — bloqueante (§12):** el nombre del zip es el patrón de **Envato Elements**; no
  incluye archivo de licencia. Hace falta el certificado de licencia registrado para el
  proyecto "Sadai" (web incluida) antes de **commitear el woff2 en un repo público**
  (`JuanequeX/sadai`). Plan B si no hay licencia web: comprar la licencia web directamente o
  sustituir por una serif de alto contraste con licencia OFL elegida **con diseño** (ninguna
  libre es idéntica; evaluar candidatas condensadas en Google Fonts). Decisión de producto.

Plus Jakarta Sans: usar **`next/font/google`** (`Plus_Jakarta_Sans`, `subsets: ["latin"]`,
`weight: ["400","600"]` o variable, `display: "swap"`, `variable: "--fuente-cuerpo"`). next/font
la autoaloja en build, sin peticiones a Google en runtime; compatible con export estático.
(Alternativa equivalente: `next/font/local` con `PlusJakartaSans-VariableFont_wght.ttf` del zip,
convertido a woff2.) Eliminar Playfair Display, Jost y Great Vibes.

Mantener el patrón actual de `_app.tsx`: inyectar
`:root{--fuente-titulo:…;--fuente-cuerpo:…}` y en `@theme`:
`--font-titulo: var(--fuente-titulo), "Times New Roman", Georgia, serif;`
`--font-cuerpo: var(--fuente-cuerpo), system-ui, sans-serif;` (eliminar `--font-firma`).

#### Escala tipográfica (fluida, base 16 px)
Proporciones del brand book (p. 26): título ≈ 3.5× cuerpo, subtítulo ≈ 1.75× cuerpo; títulos
con interlineado cerrado, subtítulos en dos líneas cortas, cuerpo con interlineado amplio.

| Token | Familia / peso | Tamaño (`clamp`) | line-height | tracking | Uso |
|---|---|---|---|---|---|
| `display` | Established 400 | `clamp(3rem, 1.8rem + 5.6vw, 6.5rem)` | 0.98 | -0.01em | h1 hero, "404" |
| `h2` | Established 400 | `clamp(2.5rem, 1.7rem + 3.6vw, 4.5rem)` | 1.02 | -0.005em | Títulos de sección |
| `h3` | Established 400 | `clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem)` | 1.08 | 0 | Subsecciones, "Notas importantes" |
| `subtitulo` | Jakarta 600 | `clamp(1.25rem, 1.05rem + 0.9vw, 1.875rem)` | 1.15 | -0.015em | Frases de apoyo ("Tus uñas. / Tu forma de decirlo.") |
| `lead` | Jakarta 400 | `clamp(1.0625rem, 1rem + 0.35vw, 1.25rem)` | 1.55 | 0 | Párrafo introductorio |
| `cuerpo` | Jakarta 400 | `1rem` | 1.65 | 0 | Texto corrido (máx. 65ch) |
| `menu-item` | Jakarta 400 | `clamp(1rem, 0.95rem + 0.3vw, 1.125rem)` | 1.4 | 0 | Nombre de servicio |
| `precio` | Jakarta 600 + `font-variant-numeric: tabular-nums` | idem `menu-item` | 1.4 | 0 | Precio |
| `etiqueta` | Jakarta 600 | `0.8125rem` | 1.2 | 0.02em | Texto de pills, botones (sin mayúsculas sostenidas) |
| `pequeño` | Jakarta 400 | `0.875rem` | 1.5 | 0 | Notas, footer |

Mínimo absoluto de texto: 14 px (12 px solo en legales del footer).

### 3.3 Logotipo

Elementos identificadores (únicas versiones permitidas): **Logotipo principal** (wordmark
caligráfico "Sadai"), **Logotipo con tagline "Artistic Nails"** (texto a la derecha),
**Logotipo con tagline "Nails by"** (texto arriba-izquierda), **Símbolo principal** ("S" dentro
de óvalo), **Símbolo secundario** ("S" sola), **Símbolo terciario con tagline**
("Artistic (S) Nails").

Usos recomendados por el brand book: logotipo principal en espacios amplios; "Artistic Nails"
para patrocinios/eventos; "Nails by" y símbolo terciario como **firma de marca**; símbolos para
reducciones mínimas.

**Reducción mínima digital:** logotipo principal **220 px** de ancho · símbolo principal
**150 px** · símbolo secundario **60 px**. (Impreso: 35 mm / 35 mm / 15 mm.)

**Área de seguridad:** margen libre alrededor del logotipo ≈ **0.65 × la altura del
logotipo** (medido en el brand book: caja 217×71 → margen 46). Símbolos: ≈ 0.65 × su ancho.
En CSS: `padding` del contenedor del logo ≥ `0.65em` relativo a su altura; nada de texto ni
bordes dentro de esa zona.

**Uso correcto (fondos):** vino sobre rosa (color primario) · rosa sobre vino (color
secundario) · negro sobre blanco (positivo) · blanco sobre negro (negativo) · negro/vino sobre
foto clara · blanco/marfil sobre foto oscura. El marfil sobre vino/degradado también aparece en
el brand book (portada, presencia digital).

**Usos incorrectos:** deformar/distorsionar · sombras o efectos · comprimir/expandir ·
colores no aprobados · girar o inclinar · alterar colores del tagline · contornos/outline ·
modificar la estructura (p. ej. mover "Nails by") · modificar el símbolo. → En web: nada de
`filter`, `drop-shadow`, `rotate`, `skew`, `scaleX≠scaleY`, ni animaciones que deformen; solo
fades/translate.

#### Archivos fuente (SVG, preferidos)
Base: `BI/Branding/2. Identidad gráfica/`. Estructura:
`{1. Versiones a color|2. Versiones en negativo|3. Versiones en positivo}/Versiones … {con|sin} marca registrada/{SVG|PNG|JPG|PDF|EPS|AI}/<nombre>.svg`

Convención de nombres: "color primario" = trazo **vino** (fondo transparente); "color
secundario" = trazo **rosa**; "fondo color primario" = rect vino + trazo rosa; "fondo color
secundario" = rect rosa + trazo vino. "Negativo" = blanco `#fff`; "Positivo" = negro (sin
`fill`, por defecto).

Los SVG tienen el **artboard completo** como `viewBox` (1200×650 o 650×650) y, en las
versiones "fondo", un `<rect>` de fondo. Para web hay que: quitar `<rect>`, recortar `viewBox`
a la forma, y cambiar `fill` a `currentColor` para colorear por CSS. ViewBox recortados medidos
(±3 u):

| Versión | Archivo fuente (sin ®) | viewBox recortado aprox. | Proporción |
|---|---|---|---|
| Logotipo principal | `1. Versiones a color/Versiones a color sin marca registrada/SVG/Logotipo principal - color primario.svg` | `220 200 727 250` | 2.91 : 1 |
| Logotipo principal con ® | `…/Versiones a color con marca registrada/SVG/Logotipo principal - color primario.svg` | `220 200 761 250` | 3.05 : 1 |
| Logotipo "Nails by" | `…sin marca registrada/SVG/Logotipo con tagline “Nails by” - color primario.svg` | `220 150 727 349` | 2.08 : 1 |
| Logotipo "Artistic Nails" | `…sin marca registrada/SVG/Logotipo con tagline “Artistic Nails” - color primario.svg` | `139 200 951 250` | 3.81 : 1 |
| Símbolo principal (óvalo) | `…sin marca registrada/SVG/Símbolo principal - color primario.svg` | `200 168 249 313` | 0.80 : 1 |
| Símbolo secundario ("S") | `…sin marca registrada/SVG/Símbolo secundario - color primario.svg` | `202 191 213 268` | 0.79 : 1 |
| Símbolo terciario "Artistic (S) Nails" | `…sin marca registrada/SVG/Símbolo terciario con tagline - color primario.svg` | `218 163 763 325` | 2.35 : 1 |

(Las comillas del nombre de archivo son tipográficas “ ”; usar comillas en shell.)

Anomalías de los entregables: "Símbolo principal con tagline - fondo color primario" y
"Símbolo secundario con tagline - fondo color primario" **no llevan tagline** (nombre erróneo);
falta el SVG "Símbolo terciario con tagline - color secundario" (solo PNG/JPG, con un espacio
extra antes de `.png`). No afectan si se usa `currentColor`.

#### Logo por contexto
| Contexto | Versión | Color | Tamaño |
|---|---|---|---|
| Navbar (sobre hero) | Logotipo principal | marfil (`currentColor`) | 220 px ancho (≈ 76 px alto) — ver nota |
| Navbar (con fondo marfil al hacer scroll) | Logotipo principal | vino | 220 px |
| Hero (panel degradado) | Logotipo principal | marfil | 60–80 % del panel; 280–640 px |
| Menú móvil abierto (fondo vino) | Símbolo principal | rosa | 150 px |
| Sobre mí | Sticker 05 (símbolo) como acento | — | 120–160 px |
| Footer | Logotipo con tagline "Nails by" | rosa | 240–300 px |
| Firma final footer / 404 | Símbolo terciario "Artistic (S) Nails" | rosa o vino | ≥ 220 px ancho |
| Favicon / app icons | Símbolo secundario "S" sobre rosa (o principal) | vino sobre rosa | 16–512 px (excepción técnica al mínimo) |
| OG image | Logotipo principal | marfil sobre degradado | ≥ 520 px en 1200×630 |

Nota sobre mínimos: si "220 px" se interpreta en px CSS, el logo del navbar mide ≈ 76 px de
alto y el navbar ≈ 96–104 px. Cabe en 360 px de ancho (360 − 2×16 gutter − 44 botón = 284).
Implementar así; si se juzga demasiado alto, consultar a diseño (§12) antes de bajar del
mínimo. `alt`/`aria-label`: "Sadai" (el logotipo es el nombre).

**®:** usar versiones **sin ®** hasta confirmar el registro ante IMPI (§12); en México usar
"marca registrada"/® sin registro es infracción. Cambiar después es trivial (otro SVG).

### 3.4 Degradados y texturas

Origen: `BI/Branding/4. Elementos gráficos de apoyo/3. Degradados/Degradado 0{1..5}.png`
(1920×1080, ~5.5 MB c/u, con **grano** visible). El brand book los llama "Texturas y fondos"
(solo se permiten los aprobados). Todos son vino ↔ rosa con desenfoque tipo seda/aura.
Muestreo de color en rejilla 7×5 (promedio de bloques) → valores de abajo.

| # | Descripción | Colores clave (muestreados) | Dirección / forma |
|---|---|---|---|
| 01 | Seda malva **de bajo contraste**; pliegue curvo; esquina inferior-izq más oscura, superior-der más clara | `#61162A` (inf-izq) · `#863F50` · `#9D5A68` (medio) · `#CB8A96` (sup-der) | Diagonal 45° de inf-izq (oscuro) a sup-der (claro), con curva en "C" |
| 02 | Seda con **barrido diagonal**: vino profundo arriba-izq, rosa luminoso a la derecha, pliegue claro que cruza | `#5B1224` (sup-izq) · `#70283B` · `#A35E6E` · `#DE9EAB` · `#F2B2BF` (der-centro) | ~110°: izquierda oscura → derecha clara |
| 03 | **Más contrastado**: rosa plano a la izquierda, espiral/donut vino desenfocado al centro-abajo, lateral derecho vino casi negro | `#FAC4D0` (izq) · `#E19CA9` · `#7B3749`/`#5E1F2E` (espiral) · `#3E0F18` (der) | Horizontal izq claro → der oscuro + espiral central |
| 04 | **Aura/viñeta**: resplandor rosa al centro, malva alrededor, banda vino abajo (el más usado: portadas del brand book, menú, posts) | `#DB9BA8` (centro) · `#C58592` · `#A96773` · `#7A3146` · `#63192C` (borde inf) | Radial centrado (≈ 48 % 55 %) + oscurecimiento vertical hacia abajo |
| 05 | Seda malva clara, pliegues diagonales suaves, **bajo contraste** | `#914D5E` · `#B47380` · `#C98995` · `#8C4758` (pliegue) · `#D999A5` (inf-der) | Diagonal ~120° con bandas |
| Aura "Presencia digital" (derivado del mockup web y post 1) | Rosa en bordes superiores, **anillo vino desenfocado** alrededor de un centro rosa, base vino | `#F4A9BA` · `#E8A0B2` · `#6B2236` · `#440019` | Radial en anillo + base oscura |

CSS propuesto (aproximación; validar a ojo contra el PNG en 1440 px):

```css
:root {
  --grad-01:
    radial-gradient(ellipse 60% 70% at 12% 88%, #5E1427 0%, transparent 70%),
    radial-gradient(ellipse 55% 60% at 95% 5%, #D896A3 0%, transparent 70%),
    linear-gradient(135deg, #7C3647 0%, #9D5A68 55%, #B4717E 100%);

  --grad-02:
    radial-gradient(ellipse 70% 85% at 98% 45%, #F2B2BF 0%, #D896A5 30%, transparent 65%),
    radial-gradient(ellipse 120% 40% at 40% 70%, rgb(222 158 171 / 0.35) 0%, transparent 60%),
    linear-gradient(110deg, #5B1224 0%, #70283B 35%, #A35E6E 62%, #D896A5 100%);

  --grad-03:
    radial-gradient(circle at 42% 70%, #5E1F2E 0%, #7B3749 14%, rgb(225 156 169 / 0) 34%),
    linear-gradient(90deg, #FAC4D0 0%, #F7BCC8 42%, #C88392 62%, #4D1421 78%, #3E0F18 100%);

  --grad-04:
    radial-gradient(ellipse 45% 50% at 48% 52%, #DB9BA8 0%, #C58592 35%, transparent 72%),
    linear-gradient(180deg, #B3737F 0%, #A96773 40%, #7A3146 82%, #63192C 100%);

  --grad-05:
    linear-gradient(120deg, #914D5E 0%, #B47380 28%, #C98995 48%, #A15C69 68%, #D999A5 100%);

  /* Aura del mockup "Presencia digital": hero y CTA */
  --grad-aura:
    radial-gradient(circle at 50% 50%, #F4A9BA 0%, #E8A0B2 16%, #8C3A52 34%, #5A1A2E 46%, transparent 62%),
    linear-gradient(180deg, #FFB3C3 0%, #F2A9BB 30%, #B8687D 62%, #440019 100%);
}
```

**Grano** (indispensable: da la textura del brand book y evita *banding*): capa
`::after` con SVG `feTurbulence` inline en data-URI (< 1 KB), `opacity: .10–.14`,
`mix-blend-mode: overlay` (o `soft-light`), `pointer-events: none`, `background-size: 180px`.

```css
.grano::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.12;mix-blend-mode:overlay;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
```

Recomendación CSS vs imagen:
- **CSS** para 01, 02, 04, 05 y aura (0 bytes, escalan a cualquier proporción, no afectan LCP).
- **Imagen optimizada** solo para **03** (la espiral no se reproduce bien en CSS) si se usa
  en el CTA o la 404: exportar AVIF 1920 px (q≈45, objetivo ≤ 60 KB) + WebP fallback y una
  variante 960 px para móvil; usar como `background-image` con `image-set()` o `<picture>`
  absoluto `object-fit: cover`, `loading="lazy"`, `decoding="async"`, `alt=""`.
- Opcional: animación lenta del degradado (desplazar `background-position` 0→100 % en 20–30 s,
  `alternate`) solo con `prefers-reduced-motion: no-preference`; nunca animar `filter: blur`.

### 3.5 Elementos gráficos de apoyo

**Recursos adicionales** (`BI/Branding/4. Elementos gráficos de apoyo/1. Elementos gráficos adicionales/SVG/`),
todos monocromos `fill:#440019`, viewBox ya ajustado (convertir a `currentColor`):

| Archivo | Forma | Uso web propuesto |
|---|---|---|
| `Recurso 01.svg` (140.79×174.91) | Salpicadura/asterisco orgánico con gota | Acento en Marquee y cabecera de Servicios (como en postal/menú) |
| `Recurso 02.svg` (157.37×158.57) | Mancha floral con gota | Decoración grande de fondo (Sobre mí, 404), opacidad 8–15 % |
| `Recurso 03.svg` (83.49×161.08) | Espiral dentro de uña + media luna | Ícono de categoría "Retiros"/acento del menú; loader |
| `Recurso 04.svg` (95.97×177.96) | Uña con patrón radial | Ícono de categoría "Manos"/"Pies"; firma del menú |
| `Recurso 05.svg` (139.23×165.47) — estrella de 4 puntas + destello pequeño | Destello | **Viñeta de lista** (el menú impreso usa ✦), separador del Marquee, favicon alternativo |

Se permiten recursos nuevos **solo si siguen el mismo estilo** (formas orgánicas rellenas,
sin trazo). Usar como componentes React inline (`components/marca/Recurso*.tsx`) o
`<svg><use href="/marca/recursos.svg#destello"/></svg>`; siempre `aria-hidden="true"`.

**Stickers** (`BI/Branding/4. Elementos gráficos de apoyo/2. Stickers/SVG/`): bicolores con borde
grueso tipo troquel. Mapa (por imagen): 01 logotipo rosa con borde vino · 02 logotipo "Artistic
Nails" vino sobre rosa · 03 logotipo "Nails by" marfil con borde vino · 04 "S" marfil con borde
vino · 05 símbolo principal vino sobre marfil · 06 salpicadura rosa/marfil · 07 mancha vino con
borde rosa · 08 espiral rosa/marfil · 09 uña radial rosa/marfil · 10 destello rosa con borde vino.
Uso: acentos "pegados" sobre fotos o tarjetas (Sobre mí, CTA, 404, datos bancarios), 1–3 por
vista, 80–180 px, con leve rotación permitida **solo en stickers no-logotipo** (06–10); los
stickers de logotipo (01–05) sin rotar. Con `motion` pueden entrar con un pequeño "pop"
(scale .9→1, opacity) si no hay reduced-motion.

### 3.6 Fotografía

Estilo oficial: femenino, elegante, artístico, **cinematográfico**: iluminación suave y
favorecedora (en redes: dramática, sombras profundas), primeros planos de manos y diseños,
texturas y acabados nítidos, color fiel; fondos y props en la paleta (terciopelo vino, rosa,
marfil). La foto debe reconocerse como Sadai aun sin logo.

Disponibilidad real:
- El brand book y las plantillas de redes usan fotografía de modelos **de origen desconocido**
  (posible stock/IA del estudio de diseño). Solo vienen **incrustadas** en mockups/plantillas:
  `BI/Branding/5. Aplicaciones de la marca/Presencia digital.jpg` (8000×4500; foto del hero en
  x≈4000–6690, y≈900–3920), `BI/Plantillas redes sociales/Posts e stories/Post Sadai - {1,2,3}.jpg`
  y `Storie Sadai - {1,2,3}.jpg` (4500×5625 / 4500×8000, con texto encima),
  `Teaser post - Sadai.jpg` (manos con diseño vino y símbolos — el más "propio").
- Foto propia existente: `public/sadai-retrato.png` (1133×1600, 1.8 MB, Sadai frente al neón).

Requerimiento: pedir a la diseñadora las **fotos originales sin texto y con licencia de uso web**
(§12). Mientras tanto: hero con foto recortada de "Presencia digital.jpg" **solo si se confirma
el derecho de uso**; si no, hero con panel de degradado a ancho completo + retrato propio en
Sobre mí. Tratamiento: sin filtros que alteren el color; `object-fit: cover`; focal point en
manos/rostro (`object-position`).

### 3.7 Iconografía funcional
`lucide-react` (ya instalado) para íconos utilitarios: MapPin, Clock, Phone, Navigation, Copy,
Check, ArrowRight, ChevronDown, X/Menu. Trazo 1.5, 20 px, color heredado. Instagram:
`components/ui/IconoInstagram.tsx` existente. Los íconos decorativos de lista (`ShieldCheck`,
`Sparkles`, `HeartHandshake`) se sustituyen por recursos de marca (§3.5).

### 3.8 Forma, espaciado, retícula, motion

- **Pills** (firma visual del brand book: categorías del menú, rasgos de personalidad, CTA
  "Agenda una cita"): `border-radius: 999px`, borde 1 px (`--color-linea` sobre claros /
  `--color-linea-clara` sobre oscuros), altura mínima 44 px, padding `0.75rem 1.5rem`.
- **Tarjetas**: radio `1.5rem` (24 px), borde 1 px `--color-linea`, sin sombras pesadas (máx.
  `0 1px 2px rgb(68 0 25 / .06)`). Media/fotos: radio `0` o `1.5rem` (consistente por sección).
- **Espaciado** base 4 px. Tokens: `--espacio-seccion: clamp(4.5rem, 3rem + 6vw, 9rem)` vertical;
  gutter `1rem` (≤ 639 px), `1.5rem` (640–1023), `2.5rem` (≥ 1024). Contenedor `max-width: 80rem`
  definido **una sola vez** (`.contenedor`) y consumido por todas las secciones (lección de la
  propuesta 02).
- **Retícula**: el brand book fija 4 columnas × 8 filas para piezas. Web: 4 col (móvil), 8 col
  (tablet), 12 col (desktop), gap 16/24/32 px.
- **Motion**: sobrio. Duraciones 200 ms (hover), 400–600 ms (reveal); easing
  `cubic-bezier(0.22, 1, 0.36, 1)`; reveal = fade + `translateY(16px)`; sin parallax pesado;
  todo condicionado a `prefers-reduced-motion`. Nada de animar el logotipo más allá de fade.
- **Divisores**: retirar `WaveDivider` (las olas no pertenecen a la nueva identidad). Las
  transiciones entre secciones son cortes rectos o fundidos de degradado.

---

## 4. Tokens para implementar (resumen)

```css
@theme {
  --color-vino: #440019;
  --color-rosa: #FFB3C3;
  --color-marfil: #F9F8F4;
  --color-vino-hover: #5A1E33;
  --color-vino-80: #683245;
  --color-vino-70: #7A4A5B;
  --color-rosa-claro: #FFE1E7;
  --color-marfil-75: #CCBABD;
  --color-rosa-75: #D08698;

  --font-titulo: var(--fuente-titulo), "Times New Roman", Georgia, serif;
  --font-cuerpo: var(--fuente-cuerpo), system-ui, sans-serif;

  --radius-pill: 999px;
  --radius-tarjeta: 1.5rem;
  --ease-marca: cubic-bezier(0.22, 1, 0.36, 1);
}
```
Espejar en `styles/_tokens.scss` (como hoy) y eliminar `rosa #f4c9d6`, `cacao`, `arena`,
`crema`, `rosa-claro #fbe6ed`, `cacao-suave` y todas sus clases (`text-cacao`, `bg-arena`…).
`body`: fondo marfil, texto vino, Jakarta 400. `h1–h3`: Established 400, `font-synthesis: none`.
`:focus-visible`: `outline: 2px solid currentColor; outline-offset: 3px` (vino en claros,
marfil/rosa en oscuros).

---

## 5. Mapa de color por sección (cumple ~45/45/10)

| Sección | Fondo | Texto | Acentos |
|---|---|---|---|
| Navbar | transparente → marfil 95 % + blur al hacer scroll | marfil → vino | pill CTA |
| Hero | `--grad-aura` (panel) + foto | marfil | logotipo marfil, pill marfil |
| Marquee | vino | rosa | destello rosa |
| Sobre mí | marfil | vino / vino-80 | stickers, recursos vino 10 % |
| Servicios (menú) | rosa (+ `--grad-02` muy sutil opcional en cabecera) | vino | tarjeta marfil, pills vino |
| Ubicación | vino | marfil / marfil-75 | íconos rosa, mapa con borde rosa-75 |
| CTA | `--grad-04` o imagen 03 + grano | marfil (en zona oscura) | stickers |
| Footer | vino (borde superior `--color-linea-clara`) | marfil / marfil-75 | logotipo "Nails by" rosa |
| 404 | `--grad-04` + grano | marfil | recurso 02 |
| /datos-bancarios | marfil | vino | tarjeta de cierre rosa |

---

## 6. Requerimientos por sección

Breakpoints: móvil < 640, tablet 640–1023, desktop ≥ 1024, wide ≥ 1440 (Tailwind `sm 640`,
`md 768`, `lg 1024`, `xl 1280`, `2xl 1536`). Probar en 360, 390, 768, 1024, 1280, 1440, 1920.

### 6.1 Navbar
- **Contenido:** logotipo principal (enlace a `/`, `aria-label="Sadai, inicio"`); enlaces
  `navLinks` (Sobre mí, Servicios, Ubicación); CTA pill "Agenda una cita" (WhatsApp).
  Menú móvil: mismos enlaces en Established grande, separador, "Datos bancarios" (solo aquí),
  CTA WhatsApp, teléfono visible, símbolo principal rosa al pie.
- **Comportamiento:** conservar toda la lógica actual (fondo al pasar 40 px, sección activa con
  `aria-current`, bloqueo de scroll, `Esc`, `aria-expanded/controls`). Añadir: **foco atrapado**
  en el menú móvil y retorno del foco al botón al cerrar; enlace "Saltar al contenido" como
  primer elemento enfocable. El color del logo/enlaces cambia según fondo (marfil sobre hero,
  vino con fondo marfil); en páginas sin hero oscuro (`/datos-bancarios`) arranca en vino.
- **Activo:** subrayado fino 1 px vino/marfil bajo el enlace (o pill con contorno), transición
  200 ms.
- **Layout:** móvil/tablet (< 1024): logo a la izquierda + botón hamburguesa 44×44 (3 barras
  1.5 px). Menú overlay a pantalla completa con fondo **vino** y texto marfil/rosa. Desktop:
  logo izq · enlaces centro · CTA der. Altura ≈ 96 px (por el mínimo de 220 px del logo).
- `scroll-padding-top` = altura real del navbar (actualizar `LINEA_ACTIVA` y globals).

### 6.2 Hero
- **Referencia directa:** mockup "Presencia digital" (brand book p. 36).
- **Contenido:**
  - Logotipo principal marfil, protagonista.
  - `h1`: **"Tus uñas. Tu forma de decirlo."** (Established, en 3 líneas en el panel:
    "Tus uñas. / Tu forma / de decirlo.").
  - Subtítulo/lead (Jakarta): "Estudio privado de uñas artísticas en Manzanillo, Colima." (aporta
    SEO local).
  - CTA pill contorno marfil: **"Agenda una cita"** → WhatsApp genérico. CTA secundario texto:
    "Ver servicios" → `#servicios`.
  - Indicador de scroll discreto (flecha) opcional.
- **Layout:**
  - Desktop (≥ 1024): dos columnas 50/50 a `100svh` (mín. 640 px): izquierda panel
    `--grad-aura` + grano con logo arriba, titular centrado, CTA abajo; derecha foto a sangre
    (`object-fit: cover`, foco en mano/rostro).
  - Tablet: mismo split 50/50 si alto ≥ 700; si no, apilado.
  - Móvil: panel degradado `min-height: 88svh` con logo (≈ 80 % del ancho), titular y CTA;
    la foto aparece debajo en 4:5 (o se omite si no hay foto con licencia).
- **Rendimiento:** la foto es el probable LCP → `<img>` con `fetchPriority="high"`, sin
  `loading="lazy"`, `srcset` AVIF/WebP 640/960/1280/1600, `sizes="(min-width:1024px) 50vw, 100vw"`,
  `width/height` explícitos. El titular **no** debe arrancar en `opacity:0` (o animar solo
  `transform`) para no retrasar LCP. Entrada por CSS keyframes (como hoy), no JS.
- **Contraste:** el titular y el CTA deben caer en zonas del aura con contraste ≥ 4.5:1
  (verificar; ver §3.1).

### 6.3 Marquee
- **Contenido** (frases de marca, separadas por destello `Recurso 05` en rosa):
  "Diseños con identidad" · "Arte en cada detalle" · "Una experiencia para ti" ·
  "Sofisticación sin pretensiones" · "Manzanillo, Colima" · "Solo con cita".
- **Estilo:** fondo vino, texto rosa en Established `h3` (o Jakarta 600 subtítulo), alto 72–96 px,
  bordes superior/inferior `--color-linea-clara`.
- **Comportamiento:** conservar `components/ui/Marquee.tsx` (copias calculadas, sin huecos).
  Pausa en hover/focus; estático con reduced-motion; copias duplicadas `aria-hidden`, y una
  versión accesible única (lista visualmente oculta o la primera copia legible).

### 6.4 Sobre mí (`#sobre-mi`)
- **Contenido:**
  - Etiqueta pill: "Sobre mí".
  - `h2`: **"El arte también se lleva en las manos."**
  - Subtítulo (Jakarta 600): "Diseños con identidad, hechos para ti."
  - Cuerpo (reescrito en voz de marca, conservando los hechos actuales: abrió en 2024, trabaja
    con cita, una clienta a la vez, escucha antes de diseñar). Borrador:
    > "Abrí Sadai en 2024 con una idea clara: que tus uñas cuenten algo de ti. Trabajo con cita
    > y atiendo a una persona a la vez, para que el tiempo aquí sea tuyo."
    > "Cada diseño empieza escuchándote —tu estilo, la forma, el color, lo que quieres
    > decir— y termina en unas manos que se sienten tuyas."
  - Las **4 propuestas de valor** (§2.1) como mini-tarjetas: título en pill con contorno
    (Jakarta 600) + texto debajo en tarjeta con borde fino (réplica del layout de la p. 8).
  - Dato "Desde 2024" como sticker/pill flotante sobre la foto.
- **Visual:** retrato `sadai-retrato` (optimizado) con radio 24 px o arco; 1–2 stickers
  (05 símbolo, 10 destello) superpuestos; `Recurso 02` grande al fondo con 8 % de opacidad.
- **Layout:** móvil apilado (foto 4:5 → texto → 4 tarjetas en 1 col); tablet foto + texto en
  2 col, tarjetas 2×2; desktop 5/7 col, tarjetas 4 en fila o 2×2.
- Mantener "Herramientas esterilizadas" como mensaje (higiene es relevante para el público):
  integrarlo en "Una experiencia para ti" o en las notas del menú (decisión de copy; §12).

### 6.5 Servicios (`#servicios`) — menú de servicios
Ver §7 (diseño detallado y datos).

### 6.6 Ubicación (`#ubicacion`)
- **Contenido:** pill "Dónde estamos"; `h2` "Te espero en el estudio."; lead "Atiendo solo con
  cita: llegas y es tu turno."; lista Dirección / Horarios / Teléfono (íconos lucide en círculo
  rosa con trazo vino); botón pill contorno marfil "Cómo llegar" (`site.mapsUrl`, nueva pestaña,
  `rel="noopener noreferrer"`); enlace `tel:`.
- **Mapa:** mantener `mapaEmbedSrc`. Para Lighthouse, implementar **fachada**: imagen
  estática del mapa (captura propia en AVIF ~30 KB, con pin vino) + botón "Ver mapa
  interactivo" que inserta el iframe al hacer clic; si no se hace fachada, mínimo
  `loading="lazy"` + `title`. Radio 24 px, borde 1 px rosa-75.
- **Layout:** móvil apilado (texto → mapa 4:3); desktop 5/7 col, mapa a la derecha 16:11.
- **Fondo:** vino; textos marfil; etiquetas marfil-75.
- Los TODO de dirección y horarios siguen pendientes (§12); no inventar datos.

### 6.7 CTA (cierre)
- **Contenido:** `h2` **"Tu próxima expresión comienza aquí."**; subtítulo "Agenda tu cita.";
  texto "Escríbeme y encontramos el horario que te acomode. Mira trabajos recientes en
  Instagram."; botones: sólido marfil con texto vino "Agenda una cita" (WhatsApp) + pill
  contorno marfil "@{instagram}".
- **Visual:** `--grad-04` (o imagen del Degradado 03) + grano; 2–3 stickers (06, 08, 09)
  decorativos `aria-hidden`. El texto se coloca en la zona oscura (contraste ≥ 4.5:1).
- Eliminar el título curvo en `textPath` actual (no es de la marca).
- **Layout:** centrado; padding vertical `--espacio-seccion`; botones apilados en móvil, en
  fila desde `sm`.

### 6.8 Footer
- **Contenido:** logotipo con tagline "Nails by" en rosa (≥ 240 px); frase "Tus uñas. Tu forma de
  decirlo."; columnas Navegación (`navLinks`), Servicios (Manos, Pies, Retiros → enlazan a
  `/#servicios` y seleccionan la pestaña vía hash `#servicios-manos` etc.), Contacto (dirección →
  Maps, teléfono `tel:`, horarios), Redes (Instagram, WhatsApp, botones 44×44 con borde
  `--color-linea-clara`). Línea inferior: "© {año} Sadai. Todos los derechos reservados." ·
  "Desde 2024 en Manzanillo, Colima." · símbolo terciario "Artistic (S) Nails" como firma.
- No enlazar `/datos-bancarios` (regla vigente).
- **Layout:** móvil 1 col; tablet 2×2; desktop 4 col (1.4fr 1fr 1fr 1.2fr). Fondo vino, texto
  marfil/marfil-75, títulos de columna en Jakarta 600 rosa (9.91:1).

### 6.9 Página 404
- `noindex`; `<title>` "Página no encontrada | Sadai".
- Fondo `--grad-04` + grano, `Recurso 02` (mancha) o sticker 07 grande; "404" en Established
  `display` marfil; `h1` "Esta página no existe."; texto "Puede que el enlace haya cambiado.
  Vuelve al inicio y sigue desde ahí."; botón sólido marfil/vino "Volver al inicio" +
  enlace secundario "Ver servicios".
- Navbar y footer presentes (Layout actual).

### 6.10 `/datos-bancarios`
- Conservar **toda** la lógica: `noindex`, no enlazada salvo menú móvil, `agrupar()` de 4 en 4,
  `CampoCopiable` (etiqueta + valor + botón copiar, valor copiado sin espacios),
  `BotonCopiar` "Copiar los tres datos" (variante contorno, ancho completo), feedback
  "Copiado" accesible (`aria-live="polite"`), botón WhatsApp `mensajeComprobante`.
- **Visual:** fondo marfil; pill "Pago"; `h1` "Datos para tu transferencia"; lead actual.
  Campos como tarjetas blancas/marfil con borde 1 px `--color-linea`, radio 24 px, valor en
  Jakarta 600 `tabular-nums`, botón copiar pill vino. Estado copiado: borde vino + ícono Check.
- Tarjeta de cierre rosa: **reformular el título sin "¿"** (Established no tiene el glifo):
  "Envíame tu comprobante" + texto "Mándame la captura y te confirmo en cuanto la vea." +
  botón WhatsApp. Sticker 10 (destello) decorativo.
- Layout: columna única `max-width: 36rem`, padding superior = altura navbar + 2rem.

---

## 7. Servicios: menú interactivo

### 7.1 Datos del menú (fuente: `BI/Menú servicios/Impresión/Menú servicios Sadai.pdf` y `.jpg`, idénticos)

Precios en MXN. **El menú no incluye duraciones ni descripciones** (§12).

| Categoría | Servicio | Precio |
|---|---|---|
| **Manos** | Extensión de acrílico | $600 |
| | Baño de acrílico | $500 |
| | Balance con gel rubber | $500 |
| | Balance con gel builder | $600 |
| | Gel semipermanente | $350 |
| | Manicura en seco | $300 |
| | Manicura spa | $300 |
| **Pies** | Gel semipermanente | $300 |
| | Extensión de acrílico | $400 |
| | Pedicura spa | $500 |
| **Retiros** | Retiro de gel | $80 |
| | Retiro de acrílico | $150 – $200 |
| | Retiro de builder | $100 |

**Notas importantes** (textuales):
1. Todos los servicios incluyen manicura en seco.
2. Los precios indicados corresponden a color liso #1 y 2.
3. Los diseños y decoraciones tienen un costo adicional que se suma al precio base del servicio.
   Cada técnica es personalizada, por lo que el costo varía.
4. Para un presupuesto más exacto, enviar foto de inspiración y la técnica deseada.

Pie del menú impreso: recursos 04 y 03 + "Artistic Nails".

### 7.2 Estructura lista para `lib/menu-servicios.ts`

```ts
export type Precio = { tipo: "fijo"; monto: number } | { tipo: "rango"; desde: number; hasta: number };

export type Servicio = {
  id: string;
  nombre: string;
  precio: Precio;
  /** Borrador a validar con Sadai; null = no mostrar. */
  descripcion: string | null;
  /** Minutos. El menú oficial no los trae: null hasta confirmarlos. */
  duracionMin: number | null;
};

export type Categoria = {
  id: "manos" | "pies" | "retiros";
  nombre: string;
  /** Recurso gráfico que acompaña la pestaña. */
  recurso: "recurso-04" | "recurso-03" | "recurso-05";
  servicios: Servicio[];
};

export const moneda = "MXN";

export const categorias: Categoria[] = [
  {
    id: "manos",
    nombre: "Manos",
    recurso: "recurso-04",
    servicios: [
      { id: "manos-extension-acrilico", nombre: "Extensión de acrílico", precio: { tipo: "fijo", monto: 600 },
        descripcion: "Alargamos tu uña con acrílico y le damos la forma que imaginas.", duracionMin: null },
      { id: "manos-bano-acrilico", nombre: "Baño de acrílico", precio: { tipo: "fijo", monto: 500 },
        descripcion: "Una capa de acrílico sobre tu uña natural para darle resistencia.", duracionMin: null },
      { id: "manos-balance-rubber", nombre: "Balance con gel rubber", precio: { tipo: "fijo", monto: 500 },
        descripcion: "Nivelación con rubber base para fortalecer tu uña natural.", duracionMin: null },
      { id: "manos-balance-builder", nombre: "Balance con gel builder", precio: { tipo: "fijo", monto: 600 },
        descripcion: "Nivelación con gel builder para más estructura y duración.", duracionMin: null },
      { id: "manos-gel-semipermanente", nombre: "Gel semipermanente", precio: { tipo: "fijo", monto: 350 },
        descripcion: "Color con brillo que dura, sobre tu uña natural.", duracionMin: null },
      { id: "manos-manicura-seco", nombre: "Manicura en seco", precio: { tipo: "fijo", monto: 300 },
        descripcion: "Limpieza, forma y cutícula, sin agua.", duracionMin: null },
      { id: "manos-manicura-spa", nombre: "Manicura spa", precio: { tipo: "fijo", monto: 300 },
        descripcion: "Un momento para ti: cuidado completo e hidratación para tus manos.", duracionMin: null },
    ],
  },
  {
    id: "pies",
    nombre: "Pies",
    recurso: "recurso-04",
    servicios: [
      { id: "pies-gel-semipermanente", nombre: "Gel semipermanente", precio: { tipo: "fijo", monto: 300 },
        descripcion: "Color duradero y con brillo para tus pies.", duracionMin: null },
      { id: "pies-extension-acrilico", nombre: "Extensión de acrílico", precio: { tipo: "fijo", monto: 400 },
        descripcion: "Forma y largo con acrílico, hecho a tu medida.", duracionMin: null },
      { id: "pies-pedicura-spa", nombre: "Pedicura spa", precio: { tipo: "fijo", monto: 500 },
        descripcion: "Limpieza profunda, exfoliación e hidratación.", duracionMin: null },
    ],
  },
  {
    id: "retiros",
    nombre: "Retiros",
    recurso: "recurso-03",
    servicios: [
      { id: "retiro-gel", nombre: "Retiro de gel", precio: { tipo: "fijo", monto: 80 }, descripcion: null, duracionMin: null },
      { id: "retiro-acrilico", nombre: "Retiro de acrílico", precio: { tipo: "rango", desde: 150, hasta: 200 },
        descripcion: "El precio depende del largo y del estado de la uña.", duracionMin: null },
      { id: "retiro-builder", nombre: "Retiro de builder", precio: { tipo: "fijo", monto: 100 }, descripcion: null, duracionMin: null },
    ],
  },
];

export const notasMenu = [
  "Todos los servicios incluyen manicura en seco.",
  "Los precios indicados corresponden a color liso #1 y 2.",
  "Los diseños y decoraciones tienen un costo adicional que se suma al precio base del servicio. Cada técnica es personalizada, por lo que el costo varía.",
  "Para un presupuesto más exacto, enviar foto de inspiración y la técnica deseada.",
] as const;

/** "$600" o "$150 – $200" */
export const formatearPrecio = (p: Precio) =>
  p.tipo === "fijo" ? `$${p.monto}` : `$${p.desde} – $${p.hasta}`;
```
Las descripciones son **borradores** (no están en el menú oficial): mostrarlas solo si Sadai
las aprueba; el componente debe funcionar con `descripcion: null` (sin hueco visual).

### 7.3 Diseño web del menú

Inspiración directa: el menú impreso (pills con contorno para categorías, viñeta ✦, columna de
"Notas importantes", fondo de degradado rosa→vino arriba), trasladado a una interfaz.

**Cabecera:** pill "Servicios"; `h2` "Servicios" o "Tu próxima expresión empieza aquí"
(Established); lead "Precios base en pesos mexicanos. Los diseños se cotizan aparte."
Fondo rosa con un `--grad-02`/`--grad-04` muy sutil solo en la franja superior + grano.

**Selector de categoría = pestañas tipo pill** (patrón WAI-ARIA *Tabs*, activación automática):
- `role="tablist"` con 3 `role="tab"`: **Manos (7)** · **Pies (3)** · **Retiros (3)**. Cada pill
  lleva el recurso de su categoría (16–20 px) y el conteo.
- Inactiva: contorno 1 px vino, texto vino, fondo transparente. Activa: fondo vino, texto rosa
  (9.91:1). Hover: fondo rosa-claro. Altura ≥ 44 px.
- Teclado: ←/→ mueven y activan, Home/End, `tabindex` itinerante; `aria-selected`,
  `aria-controls`, panel `role="tabpanel"` con `aria-labelledby` y `tabindex="0"`.
- Deep-link: `#servicios-manos|pies|retiros` selecciona la pestaña (lo usa el footer); al
  cambiar de pestaña actualizar el hash con `history.replaceState` (sin saltos de scroll).
- **SSR/sin JS:** los 3 paneles se renderizan en el HTML (SEO + `<noscript>`); el JS oculta los
  inactivos con `hidden`. Con JS deshabilitado se ven las tres listas apiladas.
- Transición de panel: fade 200 ms + translateY 8 px (sin animación con reduced-motion). Altura
  mínima del panel = la del panel más largo (Manos) para evitar CLS al cambiar.

**Lista de servicios (panel):** tarjeta marfil, radio 24 px, borde `--color-linea`. Cada fila:
- viñeta destello (`Recurso 05`, 12 px, vino) · nombre (Jakarta 400/500) · línea guía punteada
  flexible (`border-bottom: 1px dotted --color-linea`) · precio (Jakarta 600, `tabular-nums`,
  alineado a la derecha). Descripción opcional debajo en `pequeño` vino-70.
- Precio semántico: `<data value="600">$600</data>` + texto oculto "pesos mexicanos" (o
  `aria-label="600 pesos"`); rango: "de 150 a 200 pesos".
- Acción por fila: botón/enlace pill pequeño **"Agendar"** (`aria-label="Agendar Extensión de
  acrílico, manos"`) que abre WhatsApp con `crearWhatsappHref("Hola Sadai, me gustaría agendar:
  Extensión de acrílico (Manos).")`. En móvil la fila completa es el área táctil (≥ 44 px) con
  ícono flecha; en desktop el botón aparece siempre (no solo en hover, por accesibilidad).
- Marcado: `<ul>` de `<li>` (nombre en `<span>`, no en encabezado); el único `h3` del panel es
  el nombre de la categoría (visualmente oculto si la pill ya lo muestra).

**Notas importantes:** desktop: columna lateral (como el impreso) en tarjeta con contorno vino
y título `h3` Established; móvil/tablet: bloque debajo de la lista, colapsable con
`<details><summary>Notas importantes</summary>` (abierto por defecto en tablet). Viñeta ✦.

**Diseños y decoraciones (cotización):** tarjeta vino destacada bajo el menú: título "¿Tienes
un diseño en mente?" → sin "¿" en Established: **"Cuéntame el diseño que imaginas."** +
"Los diseños se cotizan según la técnica. Envíame tu foto de inspiración y te paso el precio."
+ botón "Enviar mi inspiración" → WhatsApp con mensaje "Hola Sadai, quiero cotizar un diseño.
Te envío mi foto de inspiración y la técnica que me gusta." Sticker 09 (uña) decorativo.

**Layout por breakpoint:**
- Móvil (< 640): pills en fila de 3 que ocupan el ancho (segmented control; si no caben,
  scroll horizontal con `scroll-snap` y sombras de borde); lista 1 col; notas colapsables;
  tarjeta de cotización al final.
- Tablet (640–1023): pills centradas; lista 1 col ancha (máx. 40rem); notas debajo en 2 col.
- Desktop (≥ 1024): grid 12 col: pills + lista en 7–8 col, "Notas importantes" en 4 col a la
  derecha (sticky `top: navbar + 24px`); tarjeta de cotización ancho completo debajo.

**SEO:** JSON-LD `OfferCatalog` dentro del `NailSalon` (§9.3) con cada servicio como `Offer`
(`priceCurrency: "MXN"`, `price` o `priceSpecification.minPrice/maxPrice`).

**Alternativas consideradas:** acordeón (oculta precios tras un clic, peor para comparar);
todo en una sola lista larga (bien en desktop, larga en móvil); filtros por tipo de técnica
(sobrediseño para 13 ítems). Las pestañas replican la estructura del impreso y mantienen la
página corta en móvil.

---

## 8. Assets a producir u optimizar

Herramienta: script `scripts/optimizar-assets.mjs` con **sharp** (hoy solo transitivo vía Next:
añadirlo como `devDependency` explícita) + **svgo** (`pnpm add -D svgo`). Las salidas se
commitean en `public/`; **las fuentes en `docs/brand-identity/` no** (§10).

| # | Fuente (`BI/…`) | Destino | Formato / tamaños | Notas |
|---|---|---|---|---|
| 1 | `Branding/2. Identidad gráfica/1. Versiones a color/Versiones a color sin marca registrada/SVG/Logotipo principal - color primario.svg` | `components/marca/Logotipo.tsx` (inline) | SVG svgo, viewBox `220 200 727 250`, `fill="currentColor"`, `role="img"` + `<title>Sadai</title>` | Navbar, hero; < 4 KB |
| 2 | `…/SVG/Logotipo con tagline “Nails by” - color primario.svg` | `components/marca/LogotipoNailsBy.tsx` | idem, viewBox `220 150 727 349` | Footer |
| 3 | `…/SVG/Símbolo principal - color primario.svg` | `components/marca/Simbolo.tsx` | idem, viewBox `200 168 249 313` | Menú móvil |
| 4 | `…/SVG/Símbolo secundario - color primario.svg` | `public/favicon.svg` | SVG con fondo rosa redondeado + "S" vino (≈ 72 % de la caja) | Reemplaza favicon actual |
| 5 | idem 4 | `public/favicon.ico` (16/32/48), `public/apple-touch-icon.png` (180, fondo rosa, sin transparencia), `public/icon-192.png`, `public/icon-512.png` (+ maskable con 20 % de margen) | PNG/ICO | Reemplazan los actuales |
| 6 | `…/SVG/Símbolo terciario con tagline - color primario.svg` | `components/marca/SimboloArtisticNails.tsx` | viewBox `218 163 763 325` | Firma footer/404 |
| 7 | `Branding/4. Elementos gráficos de apoyo/1. Elementos gráficos adicionales/SVG/Recurso 0{1..5}.svg` | `components/marca/Recursos.tsx` (o sprite `public/marca/recursos.svg`) | SVG `currentColor`, svgo | Viñetas, íconos de categoría |
| 8 | `…/2. Stickers/SVG/Sticker 0{1..10}.svg` (usar 04, 05, 06, 07, 08, 09, 10) | `public/marca/stickers/sticker-XX.svg` | SVG svgo (bicolor, conservar colores) | `<img alt="" loading="lazy">` |
| 9 | `…/3. Degradados/Degradado 03.png` | `public/img/degradado-03-{960,1920}.{avif,webp}` | AVIF q45 / WebP q70; ≤ 60 KB a 1920 | Solo si se usa en CTA/404 |
| 10 | Degradados 01, 02, 04, 05 | — | **CSS** (§3.4) | No exportar |
| 11 | `public/sadai-retrato.png` (1133×1600, 1.8 MB) | `public/img/sadai-retrato-{480,800,1133}.{avif,webp}` | AVIF q50 / WebP q75; objetivo ≤ 120 KB a 800 | Sobre mí |
| 12 | Foto del hero (pendiente de licencia; candidata: recorte de `Branding/5. Aplicaciones de la marca/Presencia digital.jpg` x≈4000–6690, y≈900–3920, o foto original) | `public/img/hero-{640,960,1280,1600}.{avif,webp}` | 4:5 en móvil, ~0.9:1 en desktop; LCP ≤ 150 KB a 1280 | Bloqueado por §12 |
| 13 | Composición | `public/og.jpg` | 1200×630 JPG ≤ 200 KB: `--grad-04` + grano + logotipo marfil + "Tus uñas. Tu forma de decirlo." | OG/Twitter |
| 14 | Captura de mapa | `public/img/mapa-{640,1280}.{avif,webp}` | ≤ 40 KB | Fachada del iframe |
| 15 | Fuente Established | `styles/fonts/Established-Regular.woff2` | Subset latin + latin-1 (pyftsubset `--flavor=woff2`) ≤ 15 KB | Bloqueado por licencia §12 |
| 16 | `public/logo-sadai.png` (455 KB) | **eliminar** | — | Sustituido por SVG |
| 17 | `public/site.webmanifest` | actualizar | name "Sadai · Artistic Nails", short_name "Sadai", theme `#440019`, background `#F9F8F4` | |
| 18 | — | `public/robots.txt`, `public/sitemap.xml` | Estáticos; sitemap solo `/` | Excluir `/datos-bancarios` |

Como `images.unoptimized: true`, `next/image` no genera variantes: usar `<picture>` con
`<source type="image/avif" srcset>` / `webp` + `<img width height sizes>` (componente
`components/ui/Imagen.tsx`), o `next/image` con `src` ya optimizado y sin `srcset` automático.

---

## 9. Requerimientos no funcionales

### 9.1 Rendimiento (Lighthouse móvil, Moto G Power/Slow 4G simulado)
- Performance ≥ 95; **LCP ≤ 2.0 s**, **CLS ≤ 0.02**, **TBT ≤ 150 ms**, INP < 200 ms.
- Presupuesto: HTML+CSS crítico ≤ 50 KB gz; JS de la home ≤ 110 KB gz (incluye React);
  fuentes ≤ 60 KB totales (Established subset + Jakarta 400/600 o variable latin); imágenes
  above-the-fold ≤ 180 KB.
- `motion`: usar `LazyMotion` + `m` y `domAnimation`, o sustituir `Reveal` por
  IntersectionObserver + CSS. Ningún contenido above-the-fold depende de JS para mostrarse.
- Fuentes con `next/font` (preload + `size-adjust` de fallback → sin CLS de fuente).
- iframe del mapa con fachada (o lazy); sin scripts de terceros.
- Degradados en CSS; grano con SVG data-URI pequeño (no PNG grandes); evitar
  `backdrop-filter` en elementos grandes salvo el navbar.

### 9.2 Accesibilidad (objetivo 100 + WCAG 2.2 AA real)
- Contrastes de §3.1; foco visible en todo elemento interactivo; orden de tabulación lógico.
- Skip link; landmarks (`header`, `nav` con `aria-label`, `main#contenido`, `footer`); un solo
  `h1` por página; jerarquía h2/h3 sin saltos.
- Tabs del menú según WAI-ARIA APG; menú móvil con foco atrapado; `Esc` cierra.
- Áreas táctiles ≥ 44×44; zoom 200 % sin pérdida; reflow a 320 px sin scroll horizontal.
- `prefers-reduced-motion`: sin marquee en movimiento, sin reveals, sin animación de degradado.
- Imágenes decorativas (`stickers`, recursos, degradados) `alt=""`/`aria-hidden`; fotos con
  `alt` descriptivo ("Manos con uñas en rosa pétalo…").
- Enlaces externos indican "(se abre en otra pestaña)" visualmente oculto.
- `lang="es-MX"`; precios y teléfono legibles por lector de pantalla.

### 9.3 SEO / OG
- `<title>` home: "Sadai Artistic Nails | Estudio de uñas en Manzanillo, Colima" (≤ 60 car.).
- `meta description` (≤ 155): "Estudio privado de uñas artísticas en Manzanillo. Diseños
  personalizados, manicura, pedicura y acrílico. Agenda tu cita por WhatsApp."
- `link rel="canonical"` absoluto `https://sadai.mx/`; OG (`og:type website`, `og:locale es_MX`,
  `og:site_name Sadai`, `og:title`, `og:description`, `og:url`, **`og:image` absoluta**
  `https://sadai.mx/og.jpg` con `og:image:width/height/alt`) + `twitter:card summary_large_image`.
  Hoy `og:image` es relativa (`/logo-sadai.png`): corregir.
- JSON-LD `NailSalon` en la home: `name`, `image`, `logo`, `url`, `telephone "+523141434680"`,
  `address` (PostalAddress: Manzanillo, Colima, MX; calle pendiente), `geo` (coords de
  site-config), `openingHoursSpecification` (cuando se confirmen), `priceRange "$80 – $600"`,
  `sameAs` [Instagram], `hasOfferCatalog` (servicios del menú).
- `robots.txt` (Allow all + `Sitemap:`), `sitemap.xml` (solo `/`), `noindex` en 404 y
  datos bancarios (ya existe). Mover `<meta viewport>` a `_app`/`_document` una sola vez.
- `theme-color` `#440019`.

### 9.4 Responsive
Mobile-first; breakpoints de §6. Sin scroll horizontal en ningún ancho ≥ 320 px. Imágenes con
`sizes` correctos. Tipografía fluida con `clamp`. Probar Safari iOS (svh, `position: sticky`,
`backdrop-filter`), Chrome Android, Chrome/Safari/Firefox desktop.

### 9.5 Export estático / GitHub Pages
- Mantener `output: "export"`, `images.unoptimized`, `reactStrictMode`; sin API routes,
  middleware, `getServerSideProps`, ni rewrites/headers (Pages no los soporta).
- `public/CNAME` intacto (`sadai.mx`); el workflow `.github/workflows/deploy.yml` (push a `main`,
  `pnpm build`, `touch out/.nojekyll`) no necesita cambios.
- Rutas en `/404.html` y `/datos-bancarios.html` como hoy; enlaces internos con `/` delante.
- Sin cabeceras HTTP personalizadas: cache/CSP no configurables (aceptado).

### 9.6 Calidad de código
- Tokens en un solo lugar (`@theme` + espejo SCSS). Sin colores hex sueltos en componentes.
- Componentes de marca en `components/marca/`. Datos del menú en `lib/menu-servicios.ts`.
- `pnpm lint` y `pnpm build` sin errores; revisar el HTML exportado en `out/`.

---

## 10. Repositorio y entregables

- **`docs/brand-identity/` (≈ 450 MB) NO se commitea.** Hoy `docs/` está sin trackear y
  `.gitignore` no lo excluye: añadir `/docs/brand-identity/` a `.gitignore` en el primer commit
  del rebranding. Este PRD (`docs/rebranding/PRD.md`) sí puede commitearse.
- No commitear zips de fuentes, `.ai`, `.eps`, PNG de 5 MB ni plantillas Canva.
- Enlaces Canva (editables de la marca, para referencia): menú
  `https://canva.link/02oef9z37k8nvw5`, redes `https://canva.link/l9nib8fgq75hfq0`, gift card
  `https://canva.link/zg24w0sxaxfnjhs`.

---

## 11. Plan de implementación sugerido (fases)

1. Higiene: `.gitignore`, quitar fuentes y colores viejos, nuevos tokens y fuentes
   (`_app.tsx`, `globals.css`, `_tokens.scss`), componentes de marca SVG.
2. Layout: Navbar + Footer + favicon/manifest/OG/robots/sitemap.
3. Home: Hero → Marquee → Sobre mí → Servicios (menú + `lib/menu-servicios.ts`) → Ubicación → CTA.
4. 404 y `/datos-bancarios` restyle (sin tocar su lógica).
5. Optimización de assets, Lighthouse (móvil y desktop), revisión de contraste con capturas en
   360/768/1280/1440, prueba con teclado y VoiceOver.

Criterios de aceptación globales: todas las secciones presentes y funcionales; ningún resto de
la paleta/fuentes anteriores (`cacao`, `arena`, `crema`, Playfair, Jost, Great Vibes,
`WaveDivider`); logotipos solo desde SVG oficiales sin deformar; Lighthouse en metas; build
estático publica igual que hoy.

---

## 12. Riesgos, dudas abiertas y supuestos

### Bloqueantes / alto impacto
1. **Licencia de Established.** Zip de Envato Elements sin certificado; `fsType` = Preview &
   Print; el repo `JuanequeX/sadai` es **público** (commitear el woff2 = redistribuirlo).
   Pedir el certificado de licencia registrado para Sadai con uso web. Si no existe → elegir
   reemplazo con diseño.
2. **Fotografía.** Las fotos de modelos del brand book/plantillas son de origen desconocido y
   solo vienen dentro de mockups. Pedir originales con licencia web (o sesión propia con el
   estilo descrito). Sin ellas el hero usa solo degradado + logotipo.
3. **® (marca registrada).** Confirmar registro ante IMPI; hasta entonces usar versiones "sin
   marca registrada".
4. **Instagram:** mockups muestran `sadai.artisticnails`; el sitio usa `nailsbysadai`. Confirmar
   handle vigente (afecta CTA, footer, JSON-LD).

### Contenido por confirmar
5. Nombre comercial en web: "Sadai" / "Sadai Artistic Nails" vs "Nails by Sadai".
6. Duraciones de servicios (no están en el menú) y descripciones (borradores en §7.2).
7. Significado de "color liso #1 y 2" (¿uno o dos colores?) para redactarlo claro en web.
8. Dirección exacta y horarios reales (TODO existentes en `site-config`).
9. Mensaje de higiene ("herramientas esterilizadas"): ¿se mantiene? No está en el brand book.
10. Dominio en mockups `sadai.com` vs real `sadai.mx` (se asume `sadai.mx`).

### Diseño / técnicos
11. **Mínimo de 220 px del logotipo** interpretado como px CSS → navbar ≈ 96–104 px de alto.
    Confirmar con diseño si se desea un navbar más bajo.
12. Established **no tiene `¿ ¡ · – —`**: titulares deben evitarlos (fallback serif en stack
    para casos inevitables). Copy adaptado en §6.
13. Proporción 45/45/10 es para piezas; en web se aproxima a nivel página (§5).
14. Texto sobre degradados tiene zonas de contraste insuficiente (2.78–3.48:1): exige
    verificación visual por breakpoint y velos.
15. Brand book con errores de plantilla (menciona "naranja/café/beige"; RGB vs HEX del marfil);
    archivos de logo con nombres erróneos/faltantes (§3.3). Se asume la paleta vino/rosa/marfil.
16. Recrear los degradados en CSS es aproximado; el grano mitiga banding. Si diseño exige
    fidelidad exacta, usar las imágenes AVIF (+~50 KB c/u).
17. `motion` y el iframe de Maps son los principales riesgos de Performance; mitigados con
    `LazyMotion`/CSS y fachada.

### Supuestos
- Se mantiene WhatsApp como único canal de reserva (el motor de citas es otro proyecto).
- Copy en español de México con tuteo; sin versión en inglés.
- Se conserva la estructura de Pages Router y el despliegue actual.
