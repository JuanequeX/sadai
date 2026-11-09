/* Generado por scripts/optimizar-assets.mjs — no editar a mano */
// Fuente: BI/…/Símbolo secundario - color primario.svg
import type { PropsMarca } from "./tipos";

export default function SimboloS({ className, titulo }: PropsMarca) {
  return (
    <svg
      viewBox="201.5 190 247 270"
      width={247}
      height={270}
      fill="currentColor"
      className={className}
      {...(titulo
        ? { role: "img", "aria-label": titulo }
        : { "aria-hidden": true, focusable: false })}
    >
      {titulo ? <title>{titulo}</title> : null}
      <use href="/marca/logos.svg?v=3ca6c173#simbolo-s" />
    </svg>
  );
}
