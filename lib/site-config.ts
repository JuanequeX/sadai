/**
 * Única fuente de verdad para los datos del negocio.
 * Cambiar aquí se refleja en navbar, secciones y footer.
 */
export const site = {
  nombre: "Nails by Sadai",
  tagline: "Artistic Nails",
  descripcion:
    "Estudio privado de uñas en Manzanillo, Colima. Manicura y pedicura con atención personalizada, una clienta a la vez.",

  // Formato internacional sin signos: 52 (México) + 10 dígitos
  whatsapp: "523141434680",
  telefonoVisible: "314 143 4680",
  // Sin emoji: WhatsApp lo corrompe al redirigir de wa.me a api.whatsapp.com
  mensajeWhatsApp: "Hola Sadai, me gustaría agendar una cita ✨",

  instagram: "nailsbysadai",
  instagramUrl: "https://www.instagram.com/nailsbysadai/",

  mapsUrl: "https://maps.app.goo.gl/cpt3F7QhS8LeF2kE7",
  coords: { lat: 19.1113967, lng: -104.3359845 },

  // TODO: confirmar calle, colonia y CP exactos con Sadai
  direccion: "Manzanillo, Colima",
  // TODO: confirmar horarios reales del estudio
  horarios: "Lunes a sábado · 10:00 – 21:00",

  fundado: 2024,
} as const;

/** Link de WhatsApp con el mensaje ya precargado. */
export const whatsappHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  site.mensajeWhatsApp,
)}`;

/** Embed de Google Maps centrado en el estudio (no requiere API key). */
export const mapaEmbedSrc = `https://maps.google.com/maps?q=${site.coords.lat},${site.coords.lng}&z=17&output=embed`;

/** Anchors del home, compartidos por navbar y footer. */
export const navLinks = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#servicios", label: "Servicios" },
  { href: "#ubicacion", label: "Ubicación" },
] as const;
