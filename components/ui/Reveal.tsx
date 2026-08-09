import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealProps = {
  children: ReactNode;
  /** Retraso en segundos, para escalonar varios elementos de una sección. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
};

/**
 * Único lugar donde se define la curva de entrada del sitio.
 * Con "reducir movimiento" activado degrada a un fade sin desplazamiento.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const sinMovimiento = useReducedMotion();
  const Componente = motion[as];

  return (
    <Componente
      className={className}
      // Marca para el fallback sin JS de _document.tsx
      data-reveal=""
      initial={{ opacity: 0, y: sinMovimiento ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: sinMovimiento ? 0.2 : 0.7,
        delay: sinMovimiento ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Componente>
  );
}
