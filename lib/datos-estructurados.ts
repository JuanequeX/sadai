import { categorias, moneda, rangoPrecios } from "@/lib/menu-servicios";
import { site } from "@/lib/site-config";

/**
 * JSON-LD `NailSalon` para la home (PRD §9.3).
 * Sin calle mientras siga el TODO de dirección.
 */
export function crearJsonLdNailSalon() {
  return {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    name: site.nombre,
    url: `${site.url}/`,
    image: `${site.url}/og.jpg`,
    logo: `${site.url}/icon-512.png`,
    telephone: `+52${site.telefonoVisible.replace(/\s/g, "")}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Manzanillo",
      addressRegion: "Colima",
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.coords.lat,
      longitude: site.coords.lng,
    },
    openingHoursSpecification: site.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.schema,
      opens: h.abre,
      closes: h.cierra,
    })),
    priceRange: rangoPrecios(),
    sameAs: [site.instagramUrl],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios",
      itemListElement: categorias.map((c) => ({
        "@type": "OfferCatalog",
        name: c.nombre,
        itemListElement: c.servicios.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: `${s.nombre} (${c.nombre})` },
          priceCurrency: moneda,
          ...(s.precio.tipo === "fijo"
            ? { price: s.precio.monto }
            : {
                priceSpecification: {
                  "@type": "PriceSpecification",
                  minPrice: s.precio.desde,
                  maxPrice: s.precio.hasta,
                  priceCurrency: moneda,
                },
              }),
        })),
      })),
    },
  };
}
