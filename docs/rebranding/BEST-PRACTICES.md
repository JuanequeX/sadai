# Lighthouse Best Practices: de 77 a 100

Medición original (usuario, Chrome DevTools → Lighthouse, desktop, `localhost:3000` = `next dev`): **Best Practices 77**, con tres fallos: cookies de terceros (32), Issues en el panel de DevTools y source maps faltantes en JS grande.

## Por qué daba 77 exactamente

En Lighthouse 13 (el de Chrome 156) la categoría suma 26 de peso. Solo dos auditorías restan:

| Auditoría | Peso | Efecto |
|---|---|---|
| `third-party-cookies` ("Uses third-party cookies") | 5 | falla |
| `inspector-issues` ("Issues were logged…") | 1 | falla |
| `valid-source-maps` ("Missing source maps…") | **0** | se muestra, pero no resta |

(26 − 5 − 1) / 26 = 0.77 → **77**. El de source maps se ve como fallo, pero no cuenta en el puntaje.

## Causa de cada fallo

1. **Cookies de terceros.** Las cookies venían del iframe de Google Maps en Ubicación. Tenía `loading="lazy"`, pero el lazy‑load nativo de Chrome empieza a cargar iframes a una distancia del viewport de 1250 a 4000 px o más, según la conexión. En escritorio (1350×940) el mapa está a ~3800 px del inicio, así que Chrome lo cargaba durante la corrida de Lighthouse aunque nadie hubiera bajado: 17 peticiones a google.com/gstatic/googleapis. El iframe envía las cookies que el navegador ya tiene de google.com. En el perfil del usuario (con sesión de Google) eran 32, y Chrome las marca como "third-party phaseout". En un perfil limpio no hay cookies de Google y la auditoría pasa. Por eso Lighthouse por CLI con perfil nuevo daba 100 y DevTools daba 77.
2. **Issues en DevTools.** Vienen de lo mismo: son *Cookie issues* de `maps.google.com/maps?…output=embed` y `www.google.com/maps/embed?…`. Lo reproduje con un perfil sembrado con cookies de Google (NID, AEC, __Secure‑STRP): `inspector-issues` falla y solo lista esas dos URLs.
3. **Source maps faltantes.** Solo pasa en `next dev`. Ahí los chunks de Turbopack (react‑dom, next/dist/compiled…) pesan más de 500 KB y sus `.map` de dev no tienen el campo `mappings`. En el build de producción (webpack) ningún chunk supera el umbral, así que la auditoría pasaba incluso antes del cambio. De todos modos pesa 0.

**Dev vs. producción.** `next dev` no sirve para medir: sirve JS sin minificar, con HMR y mapas de dev. El sitio publicado es el export estático (`pnpm build` → `out/`). Todas las mediciones de abajo son sobre ese build, servido con un servidor estático que imita GitHub Pages (gzip, `.html` implícito, 404.html).

## Cambios

- **`components/ubicacion/MapaInteractivo.tsx`** (nuevo): mapa interactivo de Google que se monta solo cuando su contenedor entra al viewport (`IntersectionObserver`, `rootMargin: "200px 0px"`). Ya no depende del `loading="lazy"` nativo.
  - Mientras tanto se ve un placeholder del mismo contenedor (`aspect-[4/3] lg:aspect-[16/11]`, `bg-vino-80`, borde `rosa-75`) con un pin decorativo. No es un botón ni una fachada: el mapa aparece solo al llegar a la sección. CLS = 0 y el tamaño de la caja es idéntico antes y después de montar.
  - El iframe entra con un fade de opacidad (500 ms). Con `prefers-reduced-motion` no hay transición (`motion-reduce:transition-none`, más la regla global de `globals.css`).
  - Sin JS: `<noscript>` con el enlace "Ver la ubicación en Google Maps" (`site.mapsUrl`) dentro del mismo contenedor.
  - `referrerPolicy="strict-origin-when-cross-origin"`, que es el valor por defecto del navegador. Antes era `no-referrer-when-downgrade`, que envía la URL completa. El embed sin API key no necesita referrer.
- **`components/sections/Ubicacion.tsx`**: usa `<MapaInteractivo />` en lugar del iframe directo. El resto de la sección no cambia.
- **`next.config.ts`**: `productionBrowserSourceMaps: true`. El export publica 13 `.map` (9 de JS y 4 de CSS) en `out/_next/static/**`, y cada chunk de JS lleva su `sourceMappingURL`. Los `.map` solo se descargan con DevTools abierto: los usuarios no bajan ni un byte más. `out/` pasa de 1.5 MB a 3.4 MB y el workflow sube `out/` completo. No mejora el puntaje (la auditoría ya pasaba en producción y pesa 0), pero sirve para depurar producción y evita el aviso si algún chunk llega a pasar de 500 KB. El repo es público, así que no se expone nada nuevo.

### Evaluado y descartado

- **`sandbox` en el iframe.** Sin `allow-same-origin` el mapa se rompe (Maps JS necesita storage). Con `allow-same-origin` no reduce nada: la petición de navegación del iframe lleva las cookies de google.com de todos modos.
- **Otra URL de embed.** No hay embed de Google Maps sin cookies: tanto `maps?…output=embed` como la Maps Embed API (`/maps/embed/v1/…?key=`) se sirven desde google.com. Usar la URL `www.google.com/maps/embed?pb=…` directa ahorraría un redirect, pero no cambia las cookies. Se deja la actual, que funciona sin API key.

## Mediciones (Lighthouse 13.6.0, Chrome 156 headless, perfil con cookies de Google, todas las categorías)

Build de producción, antes = `babfdbe`, después = este cambio.

| Página | Dispositivo | BP antes | BP después | Peticiones a Google en la carga | Fallos antes |
|---|---|---|---|---|---|
| `/` | desktop | 96 | **100** | 17 → 0 | `inspector-issues` (cookie issues de Maps) |
| `/` | móvil | 100 | 100 | 0 → 0 | — |
| `/como-llegar` | desktop | 100 | 100 | 0 → 0 | — |
| `/como-llegar` | móvil | 100 | 100 | 0 → 0 | — |
| `/datos-bancarios` | desktop | 100 | 100 | 0 → 0 | — |
| `/datos-bancarios` | móvil | 100 | 100 | 0 → 0 | — |

- En headless las cookies sembradas no reciben la marca "third-party phaseout", así que `third-party-cookies` no falla y el "antes" da 96 y no 77. Con el perfil real del usuario (sesión de Google, 32 cookies) es esa misma carga del iframe la que produce el 77. Después del cambio el iframe ya no carga en la corrida, así que no hay ni cookies ni issues.
- `next dev` después del cambio, desktop, mismo perfil: **BP 100**, con 0 peticiones a Google. `valid-source-maps` sigue fallando en dev (13 chunks de Turbopack), con peso 0.
- Performance 100, Accesibilidad 100 y CLS 0 en todas las páginas, antes y después. SEO 63 en `/datos-bancarios` es el `noindex` intencional.

### Comprobaciones funcionales (build de producción, Playwright)

- Carga de `/` a 1350×940 y a 390×844 (móvil): 0 iframes, 0 peticiones externas.
- Al hacer scroll hasta Ubicación se monta el iframe, se hacen 32 peticiones a Google y el mapa se ve completo.
- `/#ubicacion` directo y clic en el ancla del menú: el mapa se monta, la opacidad termina en 1 y la caja mide igual antes y después (673×463).
- Sin JS: el enlace a `https://maps.app.goo.gl/…` se ve dentro del placeholder.

## Lo que no depende de nosotros

- **Cuando el visitante llega a Ubicación**, el mapa de Google sí usa cookies de terceros y genera Cookie issues en DevTools. No se puede evitar sin quitar el mapa interactivo. Lighthouse en modo navegación (lo que mide el puntaje) no hace scroll, así que no lo cuenta. Un modo *timespan* con scroll hasta la sección sí lo mostraría.
- **El número de cookies** que reporta DevTools depende del perfil de quien mide: sesión de Google, consentimientos, etc. En otra máquina puede ser otro número, o ninguno.
- **Chrome puede cambiar sus umbrales de lazy‑load** o el criterio de "third‑party phaseout". La solución no depende de esos umbrales: el iframe ni siquiera existe en el DOM hasta que la sección está a 200 px del viewport.
- **Para medir como el sitio real**, usa el build (`pnpm build` y servir `out/`) o la URL publicada en GitHub Pages, no `next dev`, en una ventana de incógnito o en un perfil sin extensiones.
