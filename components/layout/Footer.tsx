import Image from "next/image";
import { MapPin, MessageCircle, Phone } from "lucide-react";

import IconoInstagram from "@/components/ui/IconoInstagram";
import { navLinks, site, whatsappHref } from "@/lib/site-config";

const servicios = [
  { label: "Manicura", href: "#servicios" },
  { label: "Pedicura", href: "#servicios" },
];

export default function Footer() {
  return (
    <footer className="bg-cacao px-5 pt-16 pb-8 text-crema md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo-sadai.png"
                alt=""
                width={56}
                height={56}
                className="size-12 rounded-full object-cover"
              />
              <span className="leading-none">
                <span className="block font-firma text-2xl">
                  Sadai
                </span>
                <span className="block text-[0.55rem] tracking-[0.28em] text-rosa uppercase">
                  {site.tagline}
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-crema/70">
              Estudio privado de uñas en Manzanillo. Un espacio tranquilo,
              hecho para consentirte.
            </p>
          </div>

          <nav aria-label="Navegación del pie de página">
            <h2 className="text-[0.65rem] tracking-[0.24em] text-rosa uppercase">
              Navegación
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-crema/80 transition-colors hover:text-rosa"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.65rem] tracking-[0.24em] text-rosa uppercase">
              Servicios
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {servicios.map((servicio) => (
                <li key={servicio.label}>
                  <a
                    href={servicio.href}
                    className="text-crema/80 transition-colors hover:text-rosa"
                  >
                    {servicio.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.65rem] tracking-[0.24em] text-rosa uppercase">
              Contacto
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-crema/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-rosa" aria-hidden="true" />
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-rosa"
                >
                  {site.direccion}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-rosa" aria-hidden="true" />
                <a
                  href={`tel:+52${site.telefonoVisible.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-rosa"
                >
                  {site.telefonoVisible}
                </a>
              </li>
              <li className="text-crema/60">{site.horarios}</li>
            </ul>

            <div className="mt-6 flex gap-3">
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram de ${site.nombre}`}
                className="grid size-10 place-items-center rounded-full border border-crema/25 transition-colors hover:border-rosa hover:text-rosa"
              >
                <IconoInstagram />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Escribir a ${site.nombre} por WhatsApp`}
                className="grid size-10 place-items-center rounded-full border border-crema/25 transition-colors hover:border-rosa hover:text-rosa"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 border-t border-crema/15 pt-6 text-center text-[0.7rem] tracking-wide text-crema/50 md:flex-row md:justify-between md:text-left">
          <p>
            © {new Date().getFullYear()} {site.nombre}. Todos los derechos
            reservados.
          </p>
          <p>Desde {site.fundado} en Manzanillo, Colima.</p>
        </div>
      </div>
    </footer>
  );
}
