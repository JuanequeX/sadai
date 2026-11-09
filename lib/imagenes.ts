/** Variantes generadas por scripts/optimizar-assets.mjs (tarea `imagenes`). */
export const retrato = {
  base: "/img/sadai-retrato",
  anchos: [480, 720, 960, 1133],
  ancho: 1133,
  alto: 1600,
} as const;

export type FuenteImagen = {
  base: string;
  anchos: readonly number[];
  ancho: number;
  alto: number;
};
