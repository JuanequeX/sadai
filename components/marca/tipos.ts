/**
 * API común de los componentes de marca (PLAN F1.2).
 * Solo se colorean por `currentColor`; el tamaño se da por CSS (width fijo, height auto).
 * Prohibido rotar, inclinar, aplicar filtros o sombras (PRD §3.3).
 */
export type PropsMarca = {
  className?: string;
  /** Nombre accesible. Si se omite, el SVG es decorativo (aria-hidden). */
  titulo?: string;
};
