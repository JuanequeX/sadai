import Recurso from "@/components/marca/Recurso";
import MenuServicios from "@/components/servicios/MenuServicios";
import TarjetaCotizacion from "@/components/servicios/TarjetaCotizacion";
import Degradado from "@/components/ui/Degradado";
import Pill from "@/components/ui/Pill";
import Reveal from "@/components/ui/Reveal";
import { categorias, notasMenu } from "@/lib/menu-servicios";

import styles from "./Servicios.module.scss";

/**
 * Servicios = menú de servicios interactivo (PRD §7). Fondo: Degradado 02 reencuadrado por
 * zonas (rosa claro bajo el texto, satén vino tras la tarjeta), ver Servicios.module.scss.
 */
export default function Servicios() {
  return (
    <Degradado
      as="section"
      variante="02"
      grano
      id="servicios"
      aria-labelledby="servicios-titulo"
      // overflow-clip y no hidden: recorta el halo igual, pero no crea contenedor de scroll y deja funcionar el sticky de las notas.
      className={`${styles.servicios} seccion overflow-clip`}
    >
      <Reveal className="contenedor flex flex-col items-center text-center">
        <Pill>Servicios</Pill>
        <h2 id="servicios-titulo" className="mt-6 text-h2">
          Servicios
        </h2>
        <p className="mt-4 max-w-[40ch] text-lead text-vino">
          Precios base en pesos mexicanos. Los diseños se cotizan aparte.
        </p>
        <Recurso nombre="salpicadura" className="mx-auto mt-6 size-10 text-vino" />
      </Reveal>

      <div className="mt-12">
        <MenuServicios categorias={categorias} notas={notasMenu} />
      </div>

      <div className="contenedor mt-12">
        <TarjetaCotizacion />
      </div>
    </Degradado>
  );
}
