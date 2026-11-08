/* Generado por scripts/optimizar-assets.mjs — no editar a mano */
// Fuente: BI/…/Símbolo terciario con tagline - color primario.svg
import type { PropsMarca } from "./tipos";

export default function SimboloArtisticNails({ className, titulo }: PropsMarca) {
  return (
    <svg
      viewBox="217.5 162.5 765 325"
      width={765}
      height={325}
      fill="currentColor"
      className={className}
      {...(titulo
        ? { role: "img", "aria-label": titulo }
        : { "aria-hidden": true, focusable: false })}
    >
      {titulo ? <title>{titulo}</title> : null}
      <use href="/marca/logos.svg?v=3ca6c173#simbolo-artistic-nails" />
    </svg>
  );
}
