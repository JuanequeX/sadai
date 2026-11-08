/* Generado por scripts/optimizar-assets.mjs — no editar a mano */
// Fuente: BI/…/1. Elementos gráficos adicionales/SVG/Recurso 0{1..5}.svg
// El trazo vive en public/marca/recursos.svg (sprite); aquí solo el viewBox de cada pieza.

export type NombreRecurso = "salpicadura" /*01*/ | "mancha" /*02*/ | "espiral" /*03*/ | "una" /*04*/ | "destello" /*05*/;

const VIEWBOX: Record<NombreRecurso, string> = {
  salpicadura: "0 0 140.79 174.91",
  mancha: "0 0 157.37 158.57",
  espiral: "0 0 83.49 161.08",
  una: "0 0 95.97 177.96",
  destello: "0 0 139.23 165.47",
};

/** Recurso gráfico de apoyo de la marca. Siempre decorativo. */
export default function Recurso({ nombre, className }: { nombre: NombreRecurso; className?: string }) {
  return (
    <svg viewBox={VIEWBOX[nombre]} fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <use href={`/marca/recursos.svg?v=8515de1e#${nombre}`} />
    </svg>
  );
}
