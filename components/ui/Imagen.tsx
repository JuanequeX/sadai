import type { FuenteImagen } from "@/lib/imagenes";

type ImagenProps = FuenteImagen & {
  alt: string;
  sizes: string;
  /** Imagen del LCP: carga inmediata y prioridad alta. */
  prioridad?: boolean;
  className?: string;
  classNameImg?: string;
};

/**
 * <picture> con AVIF/WebP. Con `images.unoptimized` (export estático) el componente Image de Next no genera
 * variantes; se generan en scripts/optimizar-assets.mjs.
 */
export default function Imagen({ base, anchos, ancho, alto, alt, sizes, prioridad = false, className, classNameImg }: ImagenProps) {
  const srcSet = (ext: string) => anchos.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={`${base}-${anchos[1] ?? anchos[0]}.webp`}
        width={ancho}
        height={alto}
        alt={alt}
        sizes={sizes}
        loading={prioridad ? "eager" : "lazy"}
        fetchPriority={prioridad ? "high" : "auto"}
        decoding="async"
        className={classNameImg}
      />
    </picture>
  );
}
