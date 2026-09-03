import Head from "next/head";

import BotonCopiar from "@/components/ui/BotonCopiar";
import BotonWhatsApp from "@/components/ui/BotonWhatsApp";
import CampoCopiable from "@/components/ui/CampoCopiable";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site-config";

/** Agrupa de cuatro en cuatro: así se lee y se teclea sin perder el sitio. */
const agrupar = (numero: string) => numero.replace(/(\d{4})(?=\d)/g, "$1 ");

/**
 * Página de datos para transferencia.
 *
 * Sustituye al sitio suelto que vivía en Netlify, para que no quede nada de la
 * marca fuera de este dominio. No se enlaza desde ninguna parte —ni navbar, ni
 * pie, ni home—: se llega solo por el enlace directo que se comparte al cobrar.
 */
export default function DatosBancarios() {
  const { banco, titular, cuenta } = site.datosBancarios;

  // Lo que se copia de una vez, con etiquetas para que el mensaje se entienda
  // al pegarlo en un chat.
  const todo = [
    `Banco: ${banco}`,
    `Titular: ${titular}`,
    `Cuenta: ${cuenta}`,
  ].join("\n");

  return (
    <>
      <Head>
        <title>{`Datos para transferencia | ${site.nombre}`}</title>
        <meta
          name="description"
          content={`Datos bancarios de ${site.nombre} para transferencias.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Se comparte por enlace y lleva datos personales: no tiene por qué
            aparecer en buscadores. */}
        <meta name="robots" content="noindex" />
      </Head>

      {/* El padding superior despeja el navbar fijo, que mide 5.5rem */}
      <section className="bg-arena px-5 pt-28 pb-20 md:px-10 md:pt-32 md:pb-28">
        <div className="mx-auto max-w-xl">
          <Reveal>
            <p className="text-[0.65rem] tracking-[0.3em] text-cacao-suave uppercase">
              Pago
            </p>
            <h1 className="mt-4 text-3xl leading-[1.15] text-balance text-cacao sm:text-4xl">
              Datos para tu transferencia
            </h1>
            <p className="mt-4 text-base leading-relaxed text-cacao-suave">
              Copia lo que necesites y mándame el comprobante por WhatsApp para
              confirmar tu cita.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-10 space-y-3.5">
              <li>
                <CampoCopiable
                  etiqueta="Cuenta"
                  valor={cuenta}
                  mostrado={agrupar(cuenta)}
                />
              </li>
              <li>
                <CampoCopiable etiqueta="Titular" valor={titular} />
              </li>
              <li>
                <CampoCopiable etiqueta="Banco" valor={banco} />
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-4">
              <BotonCopiar
                valor={todo}
                etiqueta="Todos los datos"
                variante="contorno"
                className="w-full"
              >
                Copiar los tres datos
              </BotonCopiar>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            {/* El cierre va en rosa para que se lea como un paso aparte y no
                como un cuarto dato que copiar. */}
            <div className="mt-10 rounded-[2rem_0.75rem] bg-rosa px-6 py-8 text-center md:px-8">
              <h2 className="text-2xl text-cacao">¿Ya transferiste?</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-cacao-suave">
                Mándame la captura al mismo número donde agendamos y te confirmo
                en cuanto la vea.
              </p>
              <div className="mt-6">
                <BotonWhatsApp mensaje={site.mensajeComprobante}>
                  Enviar comprobante
                </BotonWhatsApp>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
