/* Generado por scripts/optimizar-assets.mjs — no editar a mano */
// Fuente: BI/…/Logotipo con tagline “Nails by” - color primario.svg
import type { PropsMarca } from "./tipos";

export default function LogotipoNailsBy({ className, titulo }: PropsMarca) {
  return (
    <svg
      viewBox="218.5 150 729 350"
      width={729}
      height={350}
      fill="currentColor"
      className={className}
      {...(titulo
        ? { role: "img", "aria-label": titulo }
        : { "aria-hidden": true, focusable: false })}
    >
      {titulo ? <title>{titulo}</title> : null}
      <use href="/marca/logos.svg?v=3ca6c173#logotipo-nails-by" />
    </svg>
  );
}
