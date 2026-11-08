/**
 * Única fuente de verdad para los datos del negocio.
 * Cambiar aquí se refleja en navbar, secciones y footer.
 */
export const site = {
  // TODO(PRD §12.5): ¿"Sadai Artistic Nails"?
  nombre: "Nails by Sadai",
  /** Nombre accesible de los logotipos (el logotipo es el nombre). */
  marca: "Sadai",
  tagline: "Artistic Nails",
  descripcion:
    "Estudio privado de uñas artísticas en Manzanillo, Colima. Diseños personalizados, manicura, pedicura y acrílico.",
  url: "https://sadai.mx",

  // Formato internacional sin signos: 52 (México) + 10 dígitos
  whatsapp: "523141434680",
  telefonoVisible: "314 143 4680",
  // Sin emoji: WhatsApp lo corrompe al redirigir de wa.me a api.whatsapp.com
  mensajeWhatsApp: "Hola Sadai, me gustaría agendar una cita",
  // Mismo criterio: sin emoji. Se manda al mismo número que las citas.
  mensajeComprobante: "Hola Sadai, te envío el comprobante de mi pago",
  mensajeCotizacion:
    "Hola Sadai, quiero cotizar un diseño. Te envío mi foto de inspiración y la técnica que me gusta.",

  // TODO(PRD §12.4): mockups usan sadai.artisticnails
  instagram: "nailsbysadai",
  instagramUrl: "https://www.instagram.com/nailsbysadai/",

  mapsUrl: "https://maps.app.goo.gl/cpt3F7QhS8LeF2kE7",
  coords: { lat: 19.1113967, lng: -104.3359845 },

  // TODO: confirmar calle, colonia y CP exactos con Sadai
  direccion: "Manzanillo, Colima",
  /** Horario de atención (confirmado por Sadai, 2026-11-08). Domingo cerrado. */
  horarios: [
    { dias: "Lunes a viernes", horas: "9:00 – 22:00", schema: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], abre: "09:00", cierra: "22:00" },
    { dias: "Sábados", horas: "9:00 – 14:00", schema: ["Saturday"], abre: "09:00", cierra: "14:00" },
  ],

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

/** Mensaje para agendar un servicio concreto del menú. */
export const crearMensajeServicio = (servicio: string, categoria: string) =>
  `Hola Sadai, me gustaría agendar: ${servicio} (${categoria}).`;

/** Enlace `tel:` en formato internacional. */
export const telefonoHref = `tel:+52${site.telefonoVisible.replace(/\s/g, "")}`;

/** Link de WhatsApp con el mensaje genérico ya precargado. */
export const whatsappHref = crearWhatsappHref(site.mensajeWhatsApp);

/** Embed de Google Maps centrado en el estudio (no requiere API key). */
export const mapaEmbedSrc = `https://maps.google.com/maps?q=${site.coords.lat},${site.coords.lng}&z=17&output=embed`;

/**
 * Enlaces del menú principal, compartidos por navbar (escritorio y móvil) y footer.
 *
 * - `href` es la URL a la que se navega. Las secciones del home van con `/` delante para que
 *   funcionen también desde otras rutas —/404, /datos-bancarios—; desde el home sigue siendo
 *   navegación de fragmento en el mismo documento, así que el scroll suave se conserva.
 * - `ancla` es el selector CSS de la sección y solo lo usa el navbar para resolver cuál está a
 *   la vista (`querySelector("/#sobre-mi")` lanzaría excepción). Las páginas propias, como
 *   /datos-bancarios, no tienen ancla: se marcan activas por ruta.
 */
export type EnlaceNav = { href: string; label: string; ancla: string | null };

export const navLinks: readonly EnlaceNav[] = [
  { ancla: "#sobre-mi", href: "/#sobre-mi", label: "Sobre mí" },
  { ancla: "#servicios", href: "/#servicios", label: "Servicios" },
  { ancla: "#ubicacion", href: "/#ubicacion", label: "Ubicación" },
  { ancla: null, href: "/datos-bancarios", label: "Datos bancarios" },
];

/** Página con el croquis para llegar desde el Boulevard Miguel de la Madrid. */
export const rutaComoLlegar = "/como-llegar";

/** Link de WhatsApp para mandar el comprobante de pago. */
export const comprobanteHref = crearWhatsappHref(site.mensajeComprobante);
