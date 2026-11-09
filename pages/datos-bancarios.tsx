import Metadatos from "@/components/layout/Metadatos";
import Sticker from "@/components/marca/Sticker";
import BotonCopiar from "@/components/ui/BotonCopiar";
import BotonWhatsApp from "@/components/ui/BotonWhatsApp";
import CampoCopiable from "@/components/ui/CampoCopiable";
import Pill from "@/components/ui/Pill";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site-config";

/** Agrupa de cuatro en cuatro: así se lee y se teclea sin perder el sitio. */
const agrupar = (numero: string) => numero.replace(/(\d{4})(?=\d)/g, "$1 ");

/**
 * Página de datos para transferencia.
 *
 * No se enlaza desde ninguna parte salvo el menú móvil: se llega por el enlace directo
 * que se comparte al cobrar. Lleva datos personales, así que va con noindex.
 */
export default function DatosBancarios() {
  // Todo lo de arriba (título, datos y "copiar los tres") cabe en el primer pantallazo del móvil:
  // entra con `inmediato` para no depender de la hidratación (LCP). El cierre rosa sí usa reveal.
  const { banco, titular, cuenta } = site.datosBancarios;

  // Lo que se copia de una vez, con etiquetas para que el mensaje se entienda
  // al pegarlo en un chat.
  const todo = [`Banco: ${banco}`, `Titular: ${titular}`, `Cuenta: ${cuenta}`].join("\n");

  return (
    <>
      <Metadatos
        titulo={`Datos para transferencia | ${site.nombre}`}
        descripcion={`Datos bancarios de ${site.nombre} para transferencias.`}
        noindex
      />

      <section className="overflow-x-clip bg-marfil pt-[calc(var(--altura-navbar)+2rem)] pb-[var(--espacio-seccion)]">
        <div className="mx-auto max-w-[36rem] px-[var(--gutter)]">
          <Reveal inmediato>
            <Pill>Pago</Pill>
            <h1 className="mt-6 text-h2">Datos para tu transferencia</h1>
            <p className="mt-4 text-lead text-vino-80">
              Copia lo que necesites y mándame el comprobante por WhatsApp para confirmar tu cita.
            </p>
          </Reveal>

          <Reveal inmediato delay={0.08}>
            <ul className="mt-10 space-y-3.5">
              <li>
                <CampoCopiable etiqueta="Cuenta" valor={cuenta} mostrado={agrupar(cuenta)} />
              </li>
              <li>
                <CampoCopiable etiqueta="Titular" valor={titular} />
              </li>
              <li>
                <CampoCopiable etiqueta="Banco" valor={banco} />
              </li>
            </ul>
          </Reveal>

          <Reveal inmediato delay={0.14}>
            <div className="mt-4">
              <BotonCopiar valor={todo} etiqueta="Todos los datos" variante="contorno" className="w-full">
                Copiar los tres datos
              </BotonCopiar>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            {/* El cierre va en rosa para que se lea como un paso aparte y no como un cuarto dato. */}
            <div className="relative mt-12 rounded-tarjeta bg-rosa p-8 text-center">
              <Sticker numero="10" ancho={80} rotacion={12} className="absolute -top-6 -right-3" />
              <h2 className="text-h3">Envíame tu comprobante</h2>
              <p className="mx-auto mt-3 max-w-sm text-cuerpo text-vino-80">
                Mándame la captura y te confirmo en cuanto la vea.
              </p>
              <div className="mt-6">
                <BotonWhatsApp mensaje={site.mensajeComprobante}>Enviar comprobante</BotonWhatsApp>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
