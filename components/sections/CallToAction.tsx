import Sticker from "@/components/marca/Sticker";
import Boton from "@/components/ui/Boton";
import BotonWhatsApp from "@/components/ui/BotonWhatsApp";
import Degradado from "@/components/ui/Degradado";
import IconoInstagram from "@/components/ui/IconoInstagram";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site-config";

import styles from "./CallToAction.module.scss";

/** Cierre: --grad-04 ajustado (brillo arriba, base vino bajo el texto) + grano + stickers. */
export default function CallToAction() {
  return (
    <Degradado
      as="section"
      variante="04"
      grano
      velo="inferior"
      aria-labelledby="cta-titulo"
      className={`${styles.cta} seccion relative overflow-hidden text-marfil`}
    >
      <Sticker numero="06" ancho={120} rotacion={-12} className="absolute top-4 left-[3%] w-[84px] sm:w-[120px]" />
      <Sticker numero="08" ancho={100} rotacion={8} className="absolute right-[4%] bottom-8 w-[72px] sm:w-[100px]" />
      <Sticker numero="09" ancho={90} rotacion={-6} className="absolute top-1/3 right-[6%] hidden xl:block" />

      <Reveal className={`${styles.contenido} contenedor max-w-3xl text-center`}>
        <h2 id="cta-titulo" className="text-h2">
          Tu próxima expresión comienza aquí.
        </h2>
        <p className="mt-4 text-subtitulo font-semibold">Agenda tu cita.</p>
        <p className="mx-auto mt-4 max-w-[46ch] text-lead">
          Escríbeme y encontramos el horario que te acomode. Mira trabajos recientes en Instagram.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <BotonWhatsApp variante="marfil" />
          <Boton href={site.instagramUrl} externo variante="contorno-marfil" icono={<IconoInstagram />}>
            @{site.instagram}
          </Boton>
        </div>
      </Reveal>
    </Degradado>
  );
}
