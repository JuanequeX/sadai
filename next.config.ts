import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Landing estática: `next build` genera `out/` con HTML/CSS/JS listos para GitHub Pages.
  output: "export",
  // El optimizador de imágenes requiere servidor; con export se sirven tal cual desde public/.
  images: { unoptimized: true },
  // Source maps del JS de cliente publicados junto a los chunks (`out/_next/static/**/*.js.map`).
  // El repo es público, así que no se expone nada nuevo; sirven para depurar producción y para
  // la auditoría "valid-source-maps" de Lighthouse. Ver docs/rebranding/BEST-PRACTICES.md.
  productionBrowserSourceMaps: true,
};

export default nextConfig;
