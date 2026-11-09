import Link from "next/link";
import { MessageCircle } from "lucide-react";

import LogotipoNailsBy from "@/components/marca/LogotipoNailsBy";
import SimboloS from "@/components/marca/SimboloS";
import IconoInstagram from "@/components/ui/IconoInstagram";
import { categorias } from "@/lib/menu-servicios";
import { navLinks, site, telefonoHref, whatsappHref } from "@/lib/site-config";

const tituloColumna = "text-etiqueta font-semibold text-rosa";
const enlace = "inline-flex min-h-11 items-center transition-colors duration-200 hover:text-rosa sm:min-h-0 sm:py-1";
const redes = "grid size-11 place-items-center rounded-pill border border-linea-clara transition-colors duration-200 hover:border-rosa hover:text-rosa";

export default function Footer({ inert }: { inert?: boolean }) {
  return (
    <footer inert={inert} className="border-t border-linea-clara bg-vino pt-[var(--espacio-seccion)] pb-8 text-marfil">
      <div className="contenedor">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            {/* Área de seguridad del logotipo: nada a menos de ~0.65 × su altura */}
            <div className="-m-[0.65em] inline-block p-[0.65em]">
              <LogotipoNailsBy titulo={site.marca} className="h-auto w-[260px] text-rosa" />
            </div>
            <p className="mt-8 max-w-[18ch] text-subtitulo font-semibold">Tus uñas. Tu forma de decirlo.</p>
          </div>

          <nav aria-label="Pie de página">
            <h2 className={`${tituloColumna} font-cuerpo`}>Navegación</h2>
            <ul className="mt-4 space-y-1 text-pequeno">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.ancla ? (
                    <a href={link.href} className={enlace}>
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className={enlace}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={`${tituloColumna} font-cuerpo`}>Servicios</h2>
            <ul className="mt-4 space-y-1 text-pequeno">
              {categorias.map((c) => (
                <li key={c.id}>
                  <a href={`/#servicios-${c.id}`} className={enlace}>
                    {c.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={`${tituloColumna} font-cuerpo`}>Contacto</h2>
            <ul className="mt-4 space-y-1 text-pequeno">
              <li>
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className={enlace}>
                  {site.direccion}
                  <span className="sr-only"> (se abre en otra pestaña)</span>
                </a>
              </li>
              <li>
                <a href={telefonoHref} className={enlace}>
                  {site.telefonoVisible}
                </a>
              </li>
              {site.horarios.map((h) => (
                <li key={h.dias} className="py-1 text-marfil-75">
                  {h.dias} · {h.horas}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-3">
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram de ${site.marca} (se abre en otra pestaña)`}
                className={redes}
              >
                <IconoInstagram />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Escribir a ${site.marca} por WhatsApp (se abre en otra pestaña)`}
                className={redes}
              >
                <MessageCircle className="size-5" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-6 border-t border-linea-clara pt-6 text-center text-legal text-marfil-75 md:flex-row md:justify-between md:text-left">
          <div className="space-y-1">
            <p>
              © {new Date().getFullYear()} {site.nombre}. Todos los derechos reservados.
            </p>
            <p>Desde {site.fundado} en Manzanillo, Colima.</p>
          </div>
          <SimboloS titulo={`${site.marca} (marca registrada)`} className="h-auto w-[72px] shrink-0 text-rosa" />
        </div>
      </div>
    </footer>
  );
}
