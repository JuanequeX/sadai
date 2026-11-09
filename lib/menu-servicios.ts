/**
 * Menú de servicios: única fuente de datos (PRD §7.1–7.2).
 * Precios del menú impreso oficial (BI/Menú servicios). El menú no trae duraciones ni descripciones.
 */
export type Precio = { tipo: "fijo"; monto: number } | { tipo: "rango"; desde: number; hasta: number };

export type Servicio = {
  id: string;
  nombre: string;
  precio: Precio;
  /** Borrador a validar con Sadai; null = no mostrar. */
  descripcion: string | null;
  /** Minutos. El menú oficial no los trae: null hasta confirmarlos. */
  duracionMin: number | null;
};

export type Categoria = {
  id: "manos" | "pies" | "retiros";
  nombre: string;
  /** Recurso gráfico que acompaña la pestaña. */
  recurso: "recurso-04" | "recurso-03" | "recurso-05";
  servicios: Servicio[];
};

export const moneda = "MXN";

// TODO(PRD §12.6): las descripciones son borradores sin aprobar; las duraciones, pendientes.
export const categorias: readonly Categoria[] = [
  {
    id: "manos",
    nombre: "Manos",
    recurso: "recurso-04",
    servicios: [
      { id: "manos-extension-acrilico", nombre: "Extensión de acrílico", precio: { tipo: "fijo", monto: 600 },
        descripcion: "Alargamos tu uña con acrílico y le damos la forma que imaginas.", duracionMin: null },
      { id: "manos-bano-acrilico", nombre: "Baño de acrílico", precio: { tipo: "fijo", monto: 500 },
        descripcion: "Una capa de acrílico sobre tu uña natural para darle resistencia.", duracionMin: null },
      { id: "manos-balance-rubber", nombre: "Balance con gel rubber", precio: { tipo: "fijo", monto: 500 },
        descripcion: "Nivelación con rubber base para fortalecer tu uña natural.", duracionMin: null },
      { id: "manos-balance-builder", nombre: "Balance con gel builder", precio: { tipo: "fijo", monto: 600 },
        descripcion: "Nivelación con gel builder para más estructura y duración.", duracionMin: null },
      { id: "manos-gel-semipermanente", nombre: "Gel semipermanente", precio: { tipo: "fijo", monto: 350 },
        descripcion: "Color con brillo que dura, sobre tu uña natural.", duracionMin: null },
      { id: "manos-manicura-seco", nombre: "Manicura en seco", precio: { tipo: "fijo", monto: 300 },
        descripcion: "Limpieza, forma y cutícula, sin agua.", duracionMin: null },
      { id: "manos-manicura-spa", nombre: "Manicura spa", precio: { tipo: "fijo", monto: 300 },
        descripcion: "Un momento para ti: cuidado completo e hidratación para tus manos.", duracionMin: null },
    ],
  },
  {
    id: "pies",
    nombre: "Pies",
    recurso: "recurso-04",
    servicios: [
      { id: "pies-gel-semipermanente", nombre: "Gel semipermanente", precio: { tipo: "fijo", monto: 300 },
        descripcion: "Color duradero y con brillo para tus pies.", duracionMin: null },
      { id: "pies-extension-acrilico", nombre: "Extensión de acrílico", precio: { tipo: "fijo", monto: 400 },
        descripcion: "Forma y largo con acrílico, hecho a tu medida.", duracionMin: null },
      { id: "pies-pedicura-spa", nombre: "Pedicura spa", precio: { tipo: "fijo", monto: 500 },
        descripcion: "Limpieza profunda, exfoliación e hidratación.", duracionMin: null },
    ],
  },
  {
    id: "retiros",
    nombre: "Retiros",
    recurso: "recurso-03",
    servicios: [
      { id: "retiro-gel", nombre: "Retiro de gel", precio: { tipo: "fijo", monto: 80 }, descripcion: null, duracionMin: null },
      { id: "retiro-acrilico", nombre: "Retiro de acrílico", precio: { tipo: "rango", desde: 150, hasta: 200 },
        descripcion: "El precio depende del largo y del estado de la uña.", duracionMin: null },
      { id: "retiro-builder", nombre: "Retiro de builder", precio: { tipo: "fijo", monto: 100 }, descripcion: null, duracionMin: null },
    ],
  },
];

export const notasMenu = [
  "Todos los servicios incluyen manicura en seco.",
  // TODO(PRD §12.7): confirmar qué significa "color liso #1 y 2".
  "Los precios indicados corresponden a color liso #1 y 2.",
  "Los diseños y decoraciones tienen un costo adicional que se suma al precio base del servicio. Cada técnica es personalizada, por lo que el costo varía.",
  "Para un presupuesto más exacto, enviar foto de inspiración y la técnica deseada.",
] as const;

/** "$600" o "$150 – $200" */
export const formatearPrecio = (p: Precio) =>
  p.tipo === "fijo" ? `$${p.monto}` : `$${p.desde} – $${p.hasta}`;

/**
 * Las descripciones son borradores redactados para la web, no vienen del menú oficial.
 * TODO(PRD §12.6): borradores sin aprobar. Con `false` se ocultan todas sin dejar hueco.
 */
export const MOSTRAR_DESCRIPCIONES = true;

/** Texto para lectores de pantalla: "600 pesos" o "de 150 a 200 pesos". */
export const precioAccesible = (p: Precio) =>
  p.tipo === "fijo" ? `${p.monto} pesos` : `de ${p.desde} a ${p.hasta} pesos`;

export const idsCategorias = categorias.map((c) => c.id);

/** Rango global de precios para JSON-LD: "$80 – $600". */
export function rangoPrecios() {
  const montos = categorias.flatMap((c) =>
    c.servicios.flatMap((s) => (s.precio.tipo === "fijo" ? [s.precio.monto] : [s.precio.desde, s.precio.hasta])),
  );
  return `$${Math.min(...montos)} – $${Math.max(...montos)}`;
}
