/* Generado por scripts/optimizar-assets.mjs — no editar a mano */
// Fuente: BI/…/Logotipo principal - color primario.svg
import type { PropsMarca } from "./tipos";

export default function Logotipo({ className, titulo }: PropsMarca) {
  return (
    <svg
      viewBox="218.5 199.5 729 251"
      width={729}
      height={251}
      fill="currentColor"
      className={className}
      {...(titulo
        ? { role: "img", "aria-label": titulo }
        : { "aria-hidden": true, focusable: false })}
    >
      {titulo ? <title>{titulo}</title> : null}
      <use href="/marca/logos.svg?v=3ca6c173#logotipo" />
    </svg>
  );
}
