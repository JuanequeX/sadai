#!/usr/bin/env node
/**
 * Pipeline de assets de marca (PLAN F1).
 *
 *   node scripts/optimizar-assets.mjs [logos|recursos|stickers|iconos|imagenes|og|todo] [--con-degradado-03]
 *
 * Lee del brand book local (docs/brand-identity/, ignorado por git) y escribe
 * salidas optimizadas que SÍ se commitean: componentes en components/marca/,
 * íconos en public/, imágenes en public/img/ y stickers en public/marca/.
 * No se engancha a `build`: el CI no tiene el brand book.
 *
 * La fuente Established se genera aparte con pyftsubset (ver README).
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { optimize } from "svgo";

const REGISTRADA = false; // decisión (b): versiones sin ® hasta confirmar el registro ante IMPI
const BI = "docs/brand-identity/Branding";
const COLOR = `${BI}/2. Identidad gráfica/1. Versiones a color/Versiones a color ${REGISTRADA ? "con" : "sin"} marca registrada/SVG`;
/** Versiones con ® que se usan aunque REGISTRADA sea false (pedido explícito del cliente). */
const COLOR_REGISTRADA = `${BI}/2. Identidad gráfica/1. Versiones a color/Versiones a color con marca registrada/SVG`;
const RECURSOS = `${BI}/4. Elementos gráficos de apoyo/1. Elementos gráficos adicionales/SVG`;
const STICKERS = `${BI}/4. Elementos gráficos de apoyo/2. Stickers/SVG`;
const DEGRADADOS = `${BI}/4. Elementos gráficos de apoyo/3. Degradados`;
const RETRATO = "assets/fuente/sadai-retrato.png";

const VINO = "#440019";
const ROSA = "#FFB3C3";
const MARFIL = "#F9F8F4";

const CABECERA = "/* Generado por scripts/optimizar-assets.mjs — no editar a mano */";

// ---------------------------------------------------------------- utilidades

function validar() {
  const faltan = [BI, RETRATO].filter((p) => !existsSync(p));
  if (faltan.length) {
    console.error(
      `Faltan insumos: ${faltan.join(", ")}.\n` +
        "El brand book vive solo en local (docs/brand-identity/) y el retrato original en assets/fuente/.",
    );
    process.exit(1);
  }
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const escribir = (destino, contenido) => {
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, contenido);
  console.log(`  ${destino}  ${kb(statSync(destino).size)}`);
};

/** Bbox real de la forma: render a 4 px por unidad, trim y redondeo hacia fuera a 0.5 u. */
async function medirBbox(svg) {
  const vb = svg.match(/viewBox="([^"]+)"/)[1].split(/[\s,]+/).map(Number);
  const { info } = await sharp(Buffer.from(svg), { density: 288 })
    .png()
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true });
  const abajo = (v) => Math.floor(v * 2) / 2;
  const arriba = (v) => Math.ceil(v * 2) / 2;
  const x = abajo(vb[0] + -info.trimOffsetLeft / 4);
  const y = abajo(vb[1] + -info.trimOffsetTop / 4);
  const w = arriba(vb[0] + (-info.trimOffsetLeft + info.width) / 4) - x;
  const h = arriba(vb[1] + (-info.trimOffsetTop + info.height) / 4) - y;
  return [x, y, w, h];
}

/** Limpieza común: estilos a atributos, sin clases/ids/fill, sin el rect de artboard. */
function limpiarMonocromo(svg) {
  const sinRect = svg.replace(/<rect[^>]*class="cls-2"[^>]*\/>/g, "");
  const { data } = optimize(sinRect, {
    multipass: true,
    plugins: [
      "preset-default", // svgo 4 ya conserva viewBox por defecto
      "removeDimensions",
      { name: "inlineStyles", params: { onlyMatchedOnce: false } },
      "convertStyleToAttrs",
      { name: "removeAttrs", params: { attrs: ["class", "id", "data-name", "fill"] } },
    ],
  });
  return data.replace(/<rect[^>]*\/>/g, "");
}

/** Contenido interior del <svg> optimizado (SVG plano). */
const interiorSvg = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

const formatoNum = (n) => Number(n.toFixed(2));

/**
 * Sprite SVG estático en public/marca/ (fase Lighthouse): el path data de logos y recursos ya no
 * viaja dentro del bundle JS ni se repite en el HTML; los componentes solo emiten
 * `<svg viewBox><use href="sprite#id"/></svg>` y heredan `currentColor`. Cada pieza es un <g>
 * en <defs> con las coordenadas originales, así el viewBox del componente encaja sin cálculos.
 * Devuelve el href con `?v=<hash>` (GitHub Pages no permite caché inmutable; así un cambio de
 * arte nunca convive con una versión vieja cacheada).
 */
function escribirSprite(destino, piezas /* [{id, cuerpo}] */) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><defs>${piezas.map((p) => `<g id="${p.id}">${p.cuerpo}</g>`).join("")}</defs></svg>\n`;
  escribir(destino, svg);
  const hash = createHash("sha256").update(svg).digest("hex").slice(0, 8);
  return `/${path.relative("public", destino)}?v=${hash}`;
}

const kebab = (nombre) => nombre.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

// --------------------------------------------------------------------- logos

const LOGOS = [
  { fuente: "Logotipo principal - color primario.svg", destino: "components/marca/Logotipo.tsx", nombre: "Logotipo", aprox: [220, 200, 727, 250] },
  { fuente: "Logotipo con tagline “Nails by” - color primario.svg", destino: "components/marca/LogotipoNailsBy.tsx", nombre: "LogotipoNailsBy", aprox: [220, 150, 727, 349] },
  { fuente: "Símbolo principal - color primario.svg", destino: "components/marca/Simbolo.tsx", nombre: "Simbolo", aprox: [200, 168, 249, 313] },
  { fuente: "Símbolo terciario con tagline - color primario.svg", destino: "components/marca/SimboloArtisticNails.tsx", nombre: "SimboloArtisticNails", aprox: [218, 163, 763, 325] },
  // La "S" sola con ® (símbolo secundario): firma del footer, a pedido del cliente.
  { fuente: "Símbolo secundario - color primario.svg", carpeta: COLOR_REGISTRADA, destino: "components/marca/SimboloS.tsx", nombre: "SimboloS" },
];

async function procesarMonocromo(archivo, aprox) {
  const original = readFileSync(archivo, "utf8");
  const bbox = await medirBbox(original);
  if (aprox && bbox.some((v, i) => Math.abs(v - aprox[i]) > 6)) {
    console.warn(`  ⚠ ${path.basename(archivo)}: bbox ${bbox.join(" ")} difiere del PRD (${aprox.join(" ")})`);
  }
  const limpio = limpiarMonocromo(original);
  return { bbox, cuerpo: interiorSvg(limpio) };
}

function componenteMarca(nombre, bbox, href, fuente) {
  const [x, y, w, h] = bbox.map(formatoNum);
  return `${CABECERA}
// Fuente: BI/…/${fuente}
import type { PropsMarca } from "./tipos";

export default function ${nombre}({ className, titulo }: PropsMarca) {
  return (
    <svg
      viewBox="${x} ${y} ${w} ${h}"
      width={${w}}
      height={${h}}
      fill="currentColor"
      className={className}
      {...(titulo
        ? { role: "img", "aria-label": titulo }
        : { "aria-hidden": true, focusable: false })}
    >
      {titulo ? <title>{titulo}</title> : null}
      <use href="${href}" />
    </svg>
  );
}
`;
}

async function logos() {
  console.log("logos");
  const piezas = [];
  for (const logo of LOGOS) {
    const { bbox, cuerpo } = await procesarMonocromo(`${logo.carpeta ?? COLOR}/${logo.fuente}`, logo.aprox);
    console.log(`  ${logo.nombre}: viewBox ${bbox.join(" ")}`);
    piezas.push({ ...logo, id: kebab(logo.nombre), bbox, cuerpo });
  }
  const sprite = escribirSprite("public/marca/logos.svg", piezas);
  for (const { fuente, destino, nombre, id, bbox } of piezas) {
    escribir(destino, componenteMarca(nombre, bbox, `${sprite}#${id}`, fuente));
  }
}

// ------------------------------------------------------------------ recursos

const NOMBRES_RECURSO = { "01": "salpicadura", "02": "mancha", "03": "espiral", "04": "una", "05": "destello" };

async function recursos() {
  console.log("recursos");
  const piezas = [];
  for (const [num, nombre] of Object.entries(NOMBRES_RECURSO)) {
    const original = readFileSync(`${RECURSOS}/Recurso ${num}.svg`, "utf8");
    const vb = original.match(/viewBox="([^"]+)"/)[1];
    const cuerpo = interiorSvg(limpiarMonocromo(original));
    piezas.push({ num, nombre, id: nombre, vb, cuerpo });
  }
  const sprite = escribirSprite("public/marca/recursos.svg", piezas);
  const tsx = `${CABECERA}
// Fuente: BI/…/1. Elementos gráficos adicionales/SVG/Recurso 0{1..5}.svg
// El trazo vive en public/marca/recursos.svg (sprite); aquí solo el viewBox de cada pieza.

export type NombreRecurso = ${piezas.map((p) => `"${p.nombre}" /*${p.num}*/`).join(" | ")};

const VIEWBOX: Record<NombreRecurso, string> = {
${piezas.map((p) => `  ${p.nombre}: "${p.vb}",`).join("\n")}
};

/** Recurso gráfico de apoyo de la marca. Siempre decorativo. */
export default function Recurso({ nombre, className }: { nombre: NombreRecurso; className?: string }) {
  return (
    <svg viewBox={VIEWBOX[nombre]} fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <use href={\`${sprite}#\${nombre}\`} />
    </svg>
  );
}
`;
  escribir("components/marca/Recurso.tsx", tsx);
}

// ------------------------------------------------------------------ stickers

async function stickers() {
  console.log("stickers");
  const medidas = {};
  // Los stickers 04 y 05 (de logotipo) traen el ® integrado en la silueta y no existe versión
  // sin ®: solo se generan si REGISTRADA = true (decisión b).
  const numeros = REGISTRADA ? ["04", "05", "06", "07", "08", "09", "10"] : ["06", "07", "08", "09", "10"];
  for (const num of numeros) {
    const original = readFileSync(`${STICKERS}/Sticker ${num}.svg`, "utf8");
    const { data } = optimize(original, {
      multipass: true,
      plugins: [
        "preset-default", // svgo 4 ya conserva viewBox por defecto
        { name: "inlineStyles", params: { onlyMatchedOnce: false } },
        "convertStyleToAttrs",
        { name: "prefixIds", params: { prefix: `st${num}` } },
        { name: "removeAttrs", params: { attrs: ["class", "data-name"] } },
      ],
    });
    const vb = data.match(/viewBox="([^"]+)"/)[1].split(/[\s,]+/).map(Number);
    medidas[num] = [vb[2], vb[3]];
    escribir(`public/marca/stickers/sticker-${num}.svg`, data);
  }
  console.log("  medidas (pegar en components/marca/Sticker.tsx):", JSON.stringify(medidas));
}

// -------------------------------------------------------------------- iconos

function pngsAIco(pngs /* [{size, buf}] */) {
  const cab = Buffer.alloc(6); cab.writeUInt16LE(0, 0); cab.writeUInt16LE(1, 2); cab.writeUInt16LE(pngs.length, 4);
  let off = 6 + 16 * pngs.length; const dir = [], datos = [];
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(off, 12);
    dir.push(e); datos.push(buf); off += buf.length;
  }
  return Buffer.concat([cab, ...dir, ...datos]);
}

async function iconos() {
  console.log("iconos");
  const original = readFileSync(`${COLOR}/Símbolo secundario - color primario.svg`, "utf8");
  const bbox = await medirBbox(original);
  const limpio = limpiarMonocromo(original);
  const interior = limpio.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  const vb = bbox.map(formatoNum).join(" ");

  /** Caja 100×100 con la "S" vino centrada. */
  const icono = ({ radio, escala, titulo = true }) => {
    const lado = 100 * escala;
    const o = (100 - lado) / 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${titulo ? "<title>Sadai</title>" : ""}<rect width="100" height="100" rx="${radio}" fill="${ROSA}"/><svg x="${o}" y="${o}" width="${lado}" height="${lado}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet"><g fill="${VINO}">${interior}</g></svg></svg>`;
  };

  const favicon = icono({ radio: 22, escala: 0.72 });
  escribir("public/favicon.svg", favicon);

  const png = (svg, size) => sharp(Buffer.from(svg), { density: Math.ceil((72 * size) / 100) * 2 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

  escribir("public/apple-touch-icon.png", await png(icono({ radio: 0, escala: 0.72, titulo: false }), 180));
  escribir("public/icon-192.png", await png(icono({ radio: 22, escala: 0.72, titulo: false }), 192));
  escribir("public/icon-512.png", await png(icono({ radio: 22, escala: 0.72, titulo: false }), 512));
  escribir("public/icon-maskable-512.png", await png(icono({ radio: 0, escala: 0.56, titulo: false }), 512));

  const tamanos = [16, 32, 48];
  const pngs = [];
  for (const size of tamanos) pngs.push({ size, buf: await png(icono({ radio: 22, escala: 0.8, titulo: false }), size) });
  escribir("public/favicon.ico", pngsAIco(pngs));
}

// ------------------------------------------------------------------ imágenes

async function imagenes() {
  console.log("imagenes");
  // Anchos según el tamaño real en pantalla (≤ 464 px CSS): 480 = 1x, 720 ≈ móvil a 1.75x,
  // 960 = 2x de escritorio, 1133 (original) = 3x. Mantener en sincronía con lib/imagenes.ts.
  for (const ancho of [480, 720, 960, 1133]) {
    let q = 50;
    let avif = await sharp(RETRATO).resize({ width: ancho }).avif({ quality: q, effort: 6 }).toBuffer();
    if (ancho === 720 && avif.length > 120 * 1024) {
      q = 45;
      avif = await sharp(RETRATO).resize({ width: ancho }).avif({ quality: q, effort: 6 }).toBuffer();
    }
    escribir(`public/img/sadai-retrato-${ancho}.avif`, avif);
    escribir(`public/img/sadai-retrato-${ancho}.webp`, await sharp(RETRATO).resize({ width: ancho }).webp({ quality: 75 }).toBuffer());
  }

  if (process.argv.includes("--con-degradado-03")) {
    // Fondo de "Sobre mí" (docs/rebranding/SOBRE-MI-DEGRADADO.md). El PNG trae grano fino que,
    // codificado, pesa cientos de KB y ampliado por `cover` se ve como manchas: se suaviza aquí y
    // el grano lo pone CSS (`.grano`), nítido a cualquier DPR y que además tapa el banding.
    // Horizontal (md+) y vertical (móvil, girado 90° → rosa arriba, vino abajo).
    const suave = await sharp(`${DEGRADADOS}/Degradado 03.png`)
      .flatten({ background: "#310913" })
      .resize({ width: 640 })
      .blur(2.5)
      .png()
      .toBuffer();
    const variantes = [
      ["degradado-03-1280", sharp(suave).resize({ width: 1280 })],
      ["degradado-03-1920", sharp(suave).resize({ width: 1920 })],
      ["degradado-03-vertical-720", sharp(suave).rotate(90).resize({ width: 720 })],
    ];
    for (const [nombre, img] of variantes) {
      escribir(`public/img/${nombre}.avif`, await img.clone().avif({ quality: 60, effort: 6 }).toBuffer());
      escribir(`public/img/${nombre}.webp`, await img.clone().webp({ quality: 80 }).toBuffer());
    }
  }
}

// ------------------------------------------------------------------------ og

async function og() {
  console.log("og");
  const original = readFileSync(`${COLOR}/Logotipo principal - color primario.svg`, "utf8");
  const bbox = await medirBbox(original);
  const limpio = limpiarMonocromo(original);
  const interior = limpio.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  const ancho = 560;
  const alto = Math.round((ancho * bbox[3]) / bbox[2]);
  const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="${bbox.join(" ")}"><g fill="${MARFIL}">${interior}</g></svg>`;
  const logoPng = await sharp(Buffer.from(logo), { density: 144 }).resize(ancho, alto).png().toBuffer();

  const salida = await sharp(`${DEGRADADOS}/Degradado 04.png`)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .composite([{ input: logoPng, left: Math.round((1200 - ancho) / 2), top: Math.round((630 - alto) / 2) }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  escribir("public/og.jpg", salida);
}

// ---------------------------------------------------------------------- main

const TAREAS = { logos, recursos, stickers, iconos, imagenes, og };
const pedido = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const lista = pedido.length === 0 || pedido.includes("todo") ? Object.keys(TAREAS) : pedido;
const desconocidas = lista.filter((t) => !TAREAS[t]);
if (desconocidas.length) {
  console.error(`Tarea desconocida: ${desconocidas.join(", ")}. Usa: ${Object.keys(TAREAS).join("|")}|todo`);
  process.exit(1);
}

validar();
for (const t of lista) await TAREAS[t]();
