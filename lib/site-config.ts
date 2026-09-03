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
  // Mismo criterio: sin emoji. Se manda al mismo número que las citas.
  mensajeComprobante: "Hola Sadai, te envío el comprobante de mi pago",

  instagram: "nailsbysadai",
  instagramUrl: "https://www.instagram.com/nailsbysadai/",

  mapsUrl: "https://maps.app.goo.gl/cpt3F7QhS8LeF2kE7",
  coords: { lat: 19.1113967, lng: -104.3359845 },

  // TODO: confirmar calle, colonia y CP exactos con Sadai
  direccion: "Manzanillo, Colima",
  // TODO: confirmar horarios reales del estudio
  horarios: "Lunes a sábado · 10:00 – 21:00",

  fundado: 2024,

  /**
   * Datos para transferencia, los mismos que se publicaban en el sitio previo.
   *
   * `cuenta` es un número de tarjeta BBVA de 16 dígitos, no una CLABE, que
   * lleva 18. Se guarda sin espacios porque es lo que hay que pegar en la app
   * del banco; el agrupado para leerlo lo hace la vista.
   */
  datosBancarios: {
    banco: "BBVA",
    titular: "Perla Zurisadai Lopez Cobian",
    cuenta: "4152314248811682",
  },
} as const;

/** Link de WhatsApp con un mensaje a medida, p. ej. el servicio que se reserva. */
export const crearWhatsappHref = (mensaje: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;

/** Link de WhatsApp con el mensaje genérico ya precargado. */
export const whatsappHref = crearWhatsappHref(site.mensajeWhatsApp);

/** Embed de Google Maps centrado en el estudio (no requiere API key). */
export const mapaEmbedSrc = `https://maps.google.com/maps?q=${site.coords.lat},${site.coords.lng}&z=17&output=embed`;

/**
 * Secciones del home, compartidas por navbar y footer.
 *
 * Los dos campos no son redundantes:
 *
 * - `href` es la URL a la que se navega. Va con `/` delante para que funcione
 *   también desde otras rutas —/404 o /datos-bancarios—, donde un ancla
 *   desnuda no lleva a ninguna parte. Desde el home sigue siendo navegación de
 *   fragmento en el mismo documento, así que el scroll suave se conserva.
 * - `ancla` es el selector CSS de la sección, y solo lo usa el navbar para
 *   resolver cuál está a la vista. Tiene que ir por separado porque
 *   `querySelector("/#sobre-mi")` no es un selector válido: lanzaría excepción
 *   y tumbaría el navbar entero.
 */
export const navLinks = [
  { ancla: "#sobre-mi", href: "/#sobre-mi", label: "Sobre mí" },
  { ancla: "#servicios", href: "/#servicios", label: "Servicios" },
  { ancla: "#ubicacion", href: "/#ubicacion", label: "Ubicación" },
] as const;

/** Link de WhatsApp para mandar el comprobante de pago. */
export const comprobanteHref = crearWhatsappHref(site.mensajeComprobante);
