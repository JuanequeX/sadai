import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Retraso en segundos, para escalonar varios elementos de una sección. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
  /**
   * Para contenido above the fold: entra por keyframes de CSS al cargar ([data-entrada] en
   * globals.css), solo con desplazamiento y sin opacity 0, así no espera a la hidratación ni
   * retrasa el LCP. Sin IntersectionObserver.
   */
  inmediato?: boolean;
};

/**
 * Un único IntersectionObserver para todo el sitio: marca `data-visible` y deja de observar.
 * El estado inicial y la transición viven en globals.css ([data-reveal]); el <noscript> de
 * _document los fuerza visibles sin JS. Sin estado React: cero re-renders.
 */
let observador: IntersectionObserver | null = null;

function observar(el: Element) {
  if (typeof IntersectionObserver === "undefined") {
    el.setAttribute("data-visible", "");
    return () => {};
  }
  observador ??= new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.setAttribute("data-visible", "");
        observador?.unobserve(entrada.target);
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
  );
  observador.observe(el);
  return () => observador?.unobserve(el);
}

export default function Reveal({ children, delay = 0, className, as: Componente = "div", inmediato = false }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (inmediato || !ref.current) return;
    return observar(ref.current);
  }, [inmediato]);

  return (
    <Componente
      // @ts-expect-error -- el ref genérico sirve para cualquiera de las etiquetas permitidas
      ref={ref}
      className={className}
      {...(inmediato ? { "data-entrada": "" } : { "data-reveal": "" })}
      style={{ "--retraso": `${delay * 1000}ms` } as CSSProperties}
    >
      {children}
    </Componente>
  );
}
