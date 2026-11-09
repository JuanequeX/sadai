import type { CSSProperties } from "react";

import styles from "./Sticker.module.scss";

/** viewBox de cada sticker (salida de `pnpm assets stickers`). */
const MEDIDAS = {
  "06": [130.65, 157.36],
  "07": [137.38, 135.68],
  "08": [107, 162.58],
  "09": [121.97, 165.58],
  "10": [109.88, 151.94],
} as const;

/*
 * Solo stickers no-logotipo (06–10), que admiten una leve rotación (PRD §3.5).
 * Los de logotipo (04 "S", 05 símbolo) traen el ® integrado en la silueta y no hay versión
 * sin ®, así que no se publican mientras REGISTRADA = false (scripts/optimizar-assets.mjs).
 * Si se activan, añadirlos aquí como unión discriminada SIN `rotacion`:
 *   | { numero: "04" | "05"; ancho: number; className?: string; rotacion?: never }
 */
type NumeroSticker = keyof typeof MEDIDAS;

type StickerProps = { numero: NumeroSticker; ancho: number; rotacion?: number; className?: string };

/** Sticker decorativo de la marca (SVG bicolor en public/marca/stickers). */
export default function Sticker({ numero, ancho, rotacion, className = "" }: StickerProps) {
  const [w, h] = MEDIDAS[numero];
  const estilo: CSSProperties | undefined = rotacion ? { rotate: `${rotacion}deg` } : undefined;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- export estático con images.unoptimized: SVG ya optimizado por scripts/optimizar-assets.mjs
    <img
      src={`/marca/stickers/sticker-${numero}.svg`}
      width={ancho}
      height={Math.round((ancho * h) / w)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      style={estilo}
      className={`${styles.sticker} ${className}`}
    />
  );
}
