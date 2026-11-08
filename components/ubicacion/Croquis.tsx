import { useId } from "react";

/*
 * Croquis para llegar al estudio desde el Boulevard Miguel de la Madrid.
 *
 * Geometría real de OpenStreetMap (© colaboradores de OpenStreetMap, ODbL) proyectada a metros
 * alrededor del estudio (19.1113967, −104.3359845): 1 unidad del viewBox = 1 m, norte arriba.
 * Ruta calculada con OSRM el 2026-11-08: desde el boulevard (cualquier sentido) se entra por la
 * Calle General Lázaro Cárdenas (~150 m) y se dobla a la derecha en la Calle Eusebio Hernández
 * (~60 m); el estudio queda a la izquierda, en Plaza Don Pedro (confirmado por Sadai).
 */

/** Calles de contexto (sin nombre en el dibujo). */
const CALLES: readonly string[] = [
  "M-319 34 L-322 41 L-336 81 L-339 89 L-454 407",
  "M49 -275 L-15 -212 L-73 -155 L-148 -81 L-192 -38 L-225 -6 L-254 22",
  "M262 -53 L215 -2 L152 68 L85 151 L15 224 L-31 278",
  "M-15 -212 L71 -136 L146 -62 L215 -2 L261 43",
  "M-240 -166 L-220 -149 L-148 -81 L-73 -9 L6 72 L85 151 L188 248 L231 287 L266 320",
  "M150 -235 L138 -223 L113 -176 L71 -136 L5 -80 L-73 -9 L-130 54 L-144 68 L-175 96 L-181 103 L-189 110 L-195 116",
  "M-166 -247 L-73 -155 L5 -80 L85 0 L152 68 L251 162",
  "M194 -111 L146 -62 L85 0 L6 72 L-44 120 L-99 172",
  "M15 224 L93 301 L162 377",
  "M113 -176 L154 -143 L194 -111 L262 -53",
  "M-225 -6 L-144 68",
  "M-223 -71 L-207 -55 L-192 -38",
  "M302 193 L231 287 L162 377",
  "M103 -244 L138 -223",
  "M251 162 L188 248",
  "M-44 120 L-34 132 L-33 155",
  "M-147 124 L-103 83",
  "M-103 83 L-130 54",
  "M-277 -113 L-271 -119 L-254 -142 L-240 -166 L-226 -190 L-210 -216 L-191 -241",
  "M-79 -269 L-15 -212",
  "M-277 -113 L-300 -133 L-326 -162 L-355 -190 L-381 -218",
  "M-310 13 L-319 34",
  "M-301 -0 L-306 5 L-310 13"
];

/** Boulevard Miguel de la Madrid (las dos calzadas) y sus enlaces. */
const BOULEVARD: readonly string[] = [
  "M-414 -96 L-379 -74 L-354 -53 L-301 -0 L-257 40 L-189 110 L-123 175 L-103 197 L-88 213 L-73 234 L-63 252 L-40 305 L-30 331",
  "M-217 95 L-195 116 L-169 140",
  "M-384 -69 L-361 -50 L-329 -17 L-306 5 L-278 33 L-217 95",
  "M-7 342 L-22 303 L-31 278 L-50 238 L-65 212 L-87 186 L-99 172 L-102 169 L-147 124 L-175 96 L-254 22 L-292 -15 L-297 -20 L-315 -39 L-336 -59 L-355 -75 L-389 -99",
  "M-13 353 L-22 303",
  "M-296 -8 L-315 -39",
  "M-13 353 L-33 305 L-57 251 L-69 227 L-84 207 L-98 189 L-167 117 L-181 103 L-200 86 L-239 48 L-287 2 L-296 -8 L-349 -60 L-376 -82 L-411 -104",
  "M-169 140 L-135 176 L-93 219 L-71 259 L-63 276 L0 437",
  "M-169 140 L-123 175",
  "M-257 40 L-217 95"
];

const LAZARO = "M150 -235 L138 -223 L113 -176 L71 -136 L5 -80 L-73 -9 L-130 54 L-144 68 L-175 96 L-181 103 L-189 110 L-195 116";
/** Mismo trazo al revés: para que la etiqueta se lea de izquierda a derecha. */
const LAZARO_ETIQUETA = "M-195 116 L-189 110 L-181 103 L-175 96 L-144 68 L-130 54 L-73 -9 L5 -80 L71 -136 L113 -176 L138 -223 L150 -235";
const EUSEBIO = "M-240 -166 L-220 -149 L-148 -81 L-73 -9 L6 72 L85 151 L188 248";
/** Ruta: boulevard → Lázaro Cárdenas → Eusebio Hernández → estudio. */
const RUTA = "M-195 116 L-189 110 L-181 103 L-175 96 L-144 68 L-130 54 L-73 -9 L-33 32";
const ESTUDIO = { x: -20, y: 19 };

/**
 * Encuadres: "amplio" (desktop) con más calles de contexto; "cercano" (móvil) recortado a la
 * ruta para que, al mismo ancho de pantalla, los nombres de calles se lean ~35 % más grandes.
 */
const ENCUADRES = {
  amplio: { x: -300, y: -180, lado: 460, boulevard: { x: -290, y: 196 }, eusebio: "56%", norte: { x: 135, y: -150 } },
  cercano: { x: -234, y: -160, lado: 352, boulevard: { x: -230, y: 152 }, eusebio: "50%", norte: { x: 98, y: -132 } },
} as const;

export type EncuadreCroquis = keyof typeof ENCUADRES;

/**
 * `preserveAspectRatio` por defecto (meet): el dibujo se centra completo en la caja que le dé el
 * contenedor, así la página puede ajustar su alto al viewport sin recortar el croquis.
 */
export default function Croquis({ className = "", encuadre = "amplio" }: { className?: string; encuadre?: EncuadreCroquis }) {
  const e = ENCUADRES[encuadre];
  const id = useId().replace(/:/g, "");
  const ids = {
    titulo: `${id}-titulo`,
    desc: `${id}-desc`,
    flecha: `${id}-flecha`,
    lazaro: `${id}-lazaro`,
    eusebio: `${id}-eusebio`,
  };

  return (
    <svg
      viewBox={`${e.x} ${e.y} ${e.lado} ${e.lado}`}
      role="img"
      aria-labelledby={`${ids.titulo} ${ids.desc}`}
      className={className}
      fontFamily="var(--font-cuerpo)"
    >
      <title id={ids.titulo}>Croquis para llegar al estudio Sadai desde el Boulevard Miguel de la Madrid</title>
      <desc id={ids.desc}>
        Desde el Boulevard Miguel de la Madrid, entra por la Calle General Lázaro Cárdenas y avanza unos 150 metros.
        Dobla a la derecha en la Calle Eusebio Hernández; a unos 60 metros, el estudio queda a tu izquierda, en Plaza Don Pedro.
      </desc>

      <defs>
        <marker id={ids.flecha} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--color-vino)" />
        </marker>
        <path id={ids.lazaro} d={LAZARO_ETIQUETA} />
        <path id={ids.eusebio} d={EUSEBIO} />
      </defs>

      <rect x={e.x} y={e.y} width={e.lado} height={e.lado} fill="var(--color-marfil)" />

      {/* Calles de contexto */}
      <g fill="none" stroke="var(--color-rosa-claro)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        {CALLES.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* Boulevard */}
      <g fill="none" stroke="var(--color-rosa)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
        {BOULEVARD.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* Calles de la ruta */}
      <g fill="none" stroke="var(--color-rosa)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
        <path d={LAZARO} />
        <path d={EUSEBIO} />
      </g>

      {/* Ruta */}
      <path
        d={RUTA}
        fill="none"
        stroke="var(--color-vino)"
        strokeWidth="4"
        strokeDasharray="10 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#${ids.flecha})`}
      />

      {/* Nombres de calles */}
      <g fill="var(--color-vino)" fontSize="15" fontWeight="600" letterSpacing="0.01em">
        {/* Horizontal, en el hueco al suroeste de la calzada: sobre el trazo se encimaba en la curva */}
        <text x={e.boulevard.x} y={e.boulevard.y}>
          <tspan>Blvd. Miguel</tspan>
          <tspan x={e.boulevard.x} dy="18">
            de la Madrid
          </tspan>
        </text>
        <text dy="-10">
          <textPath href={`#${ids.lazaro}`} startOffset="37%">
            Gral. Lázaro Cárdenas
          </textPath>
        </text>
        <text dy="-10">
          <textPath href={`#${ids.eusebio}`} startOffset={e.eusebio}>
            Eusebio Hernández
          </textPath>
        </text>
      </g>

      {/* Pasos */}
      <g fontSize="14" fontWeight="700" textAnchor="middle">
        <circle cx="-195" cy="116" r="13" fill="var(--color-vino)" />
        <text x="-195" y="121" fill="var(--color-marfil)">1</text>
        <circle cx="-73" cy="-9" r="13" fill="var(--color-vino)" />
        <text x="-73" y="-4" fill="var(--color-marfil)">2</text>
      </g>

      {/* Estudio */}
      <g transform={`translate(${ESTUDIO.x} ${ESTUDIO.y})`}>
        <path d="M0 0 C-4 -9 -15 -14 -15 -26 A15 15 0 1 1 15 -26 C15 -14 4 -9 0 0 Z" fill="var(--color-vino)" />
        <circle cx="0" cy="-26" r="6" fill="var(--color-marfil)" />
        <text x="20" y="-30" fill="var(--color-vino)" fontSize="22" fontFamily="var(--font-titulo)">
          Sadai
        </text>
        <text x="20" y="-12" fill="var(--color-vino-80)" fontSize="13">
          Plaza Don Pedro
        </text>
      </g>

      {/* Norte */}
      <g transform={`translate(${e.norte.x} ${e.norte.y})`} fill="var(--color-vino)" textAnchor="middle">
        <path d="M0 -12 L6 6 L0 2 L-6 6 Z" />
        <text y="20" fontSize="10" fontWeight="700">
          N
        </text>
      </g>
    </svg>
  );
}
