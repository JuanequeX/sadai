import Recurso from "@/components/marca/Recurso";
import MenuServicios from "@/components/servicios/MenuServicios";
import TarjetaCotizacion from "@/components/servicios/TarjetaCotizacion";
import Degradado from "@/components/ui/Degradado";
import Pill from "@/components/ui/Pill";
import Reveal from "@/components/ui/Reveal";
import { categorias, notasMenu } from "@/lib/menu-servicios";

/** Servicios = menú de servicios interactivo (PRD §7). */
export default function Servicios() {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="seccion relative isolate overflow-hidden bg-rosa">
      <Degradado
        variante="02"
        grano
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[22rem] opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />

      <Reveal className="contenedor flex flex-col items-center text-center">
        <Pill>Servicios</Pill>
        <h2 id="servicios-titulo" className="mt-6 text-h2">
          Servicios
        </h2>
        <p className="mt-4 max-w-[40ch] text-lead text-vino-80">
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
    </section>
  );
}
