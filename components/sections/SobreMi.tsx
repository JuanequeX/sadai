import Recurso from "@/components/marca/Recurso";
import Sticker from "@/components/marca/Sticker";
import Imagen from "@/components/ui/Imagen";
import Pill from "@/components/ui/Pill";
import Reveal from "@/components/ui/Reveal";
import { retrato } from "@/lib/imagenes";
import { site } from "@/lib/site-config";

/** Propuestas de valor, textuales del brand book (PRD §2.1). */
const propuestas = [
  {
    titulo: "Diseños con identidad",
    texto:
      "Cada diseño nace de la personalidad y las preferencias de quien lo lleva, creando resultados auténticos y personalizados.",
  },
  {
    titulo: "Arte en cada detalle",
    texto:
      "La combinación de técnicas, precisión y creatividad transforma cada aplicación en una propuesta estética cuidadosamente ejecutada.",
  },
  {
    titulo: "Una experiencia para ti",
    // TODO(PRD §12.9): confirmar si se mantiene el mensaje de higiene (no está en el brand book).
    texto:
      "Un espacio privado y cercano que prioriza la tranquilidad, la comodidad y la atención personalizada en cada visita. Herramientas esterilizadas en cada cita.",
  },
  {
    titulo: "Sofisticación sin pretensiones",
    texto:
      "Una experiencia premium que combina calidad, estética contemporánea y profesionalismo con una personalidad fresca y auténtica.",
  },
];

export default function SobreMi() {
  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-titulo" className="seccion relative overflow-hidden bg-marfil">
      <Recurso
        nombre="mancha"
        className="pointer-events-none absolute top-10 -right-24 w-[28rem] text-vino opacity-[0.08]"
      />

      <div className="contenedor relative grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:items-center lg:gap-x-16">
        <Reveal className="relative mx-auto w-full max-w-[28rem] self-start md:max-w-none lg:col-span-5 lg:self-center">
          <Imagen
            {...retrato}
            alt="Sadai en su estudio, frente al letrero de neón de la marca"
            // Ancho real medido: columna 5/12 (tope 464 px), media columna en md, y en móvil el
            // ancho del contenedor con tope de 28rem.
            sizes="(min-width:1280px) 464px, (min-width:1024px) calc(42vw - 72px), (min-width:768px) calc(50vw - 3rem), min(calc(100vw - 2rem), 28rem)"
            className="block"
            classNameImg="block aspect-[4/5] h-auto w-full rounded-tarjeta object-cover object-[center_22%]"
          />
          <Sticker numero="07" ancho={130} rotacion={-6} className="absolute -top-6 -left-3 w-[96px] sm:w-[130px]" />
          <Sticker numero="10" ancho={96} rotacion={-8} className="absolute -right-3 bottom-16 w-[80px] sm:w-[96px]" />
          <Pill as="span" className="absolute bottom-4 left-4 bg-marfil">
            Desde {site.fundado}
          </Pill>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <Pill>Sobre mí</Pill>
            <h2 id="sobre-mi-titulo" className="mt-6 text-h2">
              El arte también se lleva en las manos.
            </h2>
            <p className="mt-5 text-subtitulo font-semibold">Diseños con identidad, hechos para ti.</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-6 max-w-[65ch] space-y-4 text-cuerpo text-vino-80">
              <p>
                Abrí Sadai en {site.fundado} con una idea clara: que tus uñas cuenten algo de ti. Trabajo con cita y
                atiendo a una persona a la vez, para que el tiempo aquí sea tuyo.
              </p>
              <p>
                Cada diseño empieza escuchándote —tu estilo, la forma, el color, lo que quieres decir— y termina en
                unas manos que se sienten tuyas.
              </p>
            </div>
          </Reveal>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 md:col-span-2 lg:col-span-12 xl:grid-cols-4">
          {propuestas.map((p, i) => (
            <Reveal as="li" key={p.titulo} delay={i * 0.08} className="flex flex-col">
              <h3 className="self-start rounded-2xl border border-linea px-4 py-2 font-cuerpo text-menu font-semibold">
                {p.titulo}
              </h3>
              <p className="mt-2 flex-1 rounded-tarjeta border border-linea p-5 text-cuerpo text-vino-80">{p.texto}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
