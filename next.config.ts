import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Landing estática: `next build` genera `out/` con HTML/CSS/JS listos para Netlify.
  output: "export",
  // El optimizador de imágenes requiere servidor; con export se sirven tal cual desde public/.
  images: { unoptimized: true },
};

export default nextConfig;
