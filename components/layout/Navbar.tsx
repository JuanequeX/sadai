import { useEffect, useRef, useState, type Ref } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Phone } from "lucide-react";

import Logotipo from "@/components/marca/Logotipo";
import SimboloS from "@/components/marca/SimboloS";
import BotonWhatsApp from "@/components/ui/BotonWhatsApp";
import { ALTURA_NAVBAR_PX } from "@/lib/layout";
import { navLinks, site, telefonoHref, type EnlaceNav } from "@/lib/site-config";

import styles from "./Navbar.module.scss";

/**
 * Línea bajo la que se decide qué sección se está viendo: la altura del navbar fijo,
 * igual que el scroll-padding-top de globals.css. Al llegar por un ancla la sección
 * queda activa exactamente al terminar el salto.
 */
const LINEA_ACTIVA = ALTURA_NAVBAR_PX;

/**
 * Tono del navbar arriba del todo (antes de pasar 40 px), según el primer bloque de cada ruta:
 * - "/": hero "seda" malva oscuro → transparente con texto marfil.
 * - "/404": base vino del degradado → transparente con texto marfil.
 * - resto: fondo marfil con texto vino desde el inicio.
 */
const TONO_INICIAL: Record<string, "vino" | "marfil"> = { "/": "marfil", "/404": "marfil" };

export default function Navbar({ alCambiarMenu }: { alCambiarMenu?: (abierto: boolean) => void }) {
  const { pathname } = useRouter();
  const [abierto, setAbiertoEstado] = useState(false);
  const [conFondo, setConFondo] = useState(false);
  const [activa, setActiva] = useState<string | null>(null);
  const botonRef = useRef<HTMLButtonElement>(null);
  const primerEnlaceRef = useRef<HTMLAnchorElement>(null);

  const setAbierto = (valor: boolean) => {
    setAbiertoEstado(valor);
    alCambiarMenu?.(valor);
  };

  // Fondo al pasar 40 px y sección activa, midiendo una sola vez por frame.
  useEffect(() => {
    let pendiente = false;

    const medir = () => {
      pendiente = false;
      setConFondo(window.scrollY > 40);

      // La sección activa es la última que ya cruzó la línea. Se compara por
      // posición y no por orden en navLinks, para no atarlo al orden del array.
      let masCercana: string | null = null;
      let mejorTop = -Infinity;
      for (const link of navLinks) {
        // `ancla`, no `href`: el href lleva "/" delante y no es un selector válido.
        // Las páginas propias (sin ancla) se marcan activas por ruta, no por scroll.
        if (!link.ancla) continue;
        const seccion = document.querySelector(link.ancla);
        if (!seccion) continue;
        const { top } = seccion.getBoundingClientRect();
        if (top <= LINEA_ACTIVA + 1 && top > mejorTop) {
          mejorTop = top;
          masCercana = link.ancla;
        }
      }
      setActiva(masCercana);
    };

    const alHacerScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", alHacerScroll, { passive: true });
    window.addEventListener("resize", alHacerScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", alHacerScroll);
      window.removeEventListener("resize", alHacerScroll);
    };
  }, [pathname]);

  // Con el menú abierto: bloquea el scroll del body, escucha Esc y enfoca el primer enlace.
  useEffect(() => {
    if (!abierto) return;

    const alPresionar = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbiertoEstado(false);
      alCambiarMenu?.(false);
      botonRef.current?.focus();
    };
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", alPresionar);
    primerEnlaceRef.current?.focus();

    return () => {
      document.body.style.overflow = overflowPrevio;
      window.removeEventListener("keydown", alPresionar);
    };
  }, [abierto, alCambiarMenu]);

  const tonoInicial = TONO_INICIAL[pathname];
  /** Activo: por sección a la vista (anclas del home) o por ruta (páginas propias). */
  const esActivo = (link: EnlaceNav) => (link.ancla ? activa === link.ancla : pathname === link.href);
  const transparente = abierto || (tonoInicial !== undefined && !conFondo);
  const tonoClaro = abierto || (tonoInicial === "marfil" && !conFondo);
  // En el home, arriba del todo, el hero ya muestra el logotipo grande.
  const logoOculto = pathname === "/" && !conFondo && !abierto;

  const alternar = () => {
    const siguiente = !abierto;
    setAbierto(siguiente);
    if (!siguiente) botonRef.current?.focus();
  };

  // Al elegir un enlace se cierra sin mover el foco: el navegador lo lleva al ancla.
  const cerrar = () => setAbierto(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-[var(--altura-navbar)] transition-colors duration-200 ${
          transparente
            ? `border-b border-transparent bg-transparent ${tonoClaro ? "text-marfil" : "text-vino"}`
            : "border-b border-linea bg-marfil/95 text-vino backdrop-blur"
        }`}
      >
        <nav aria-label="Navegación principal" className="contenedor flex h-full items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={`${site.marca}, inicio`}
            tabIndex={logoOculto ? -1 : undefined}
            aria-hidden={logoOculto || undefined}
            className={`shrink-0 transition-opacity duration-200 ${logoOculto ? "pointer-events-none opacity-0" : "opacity-100"}`}
          >
            <Logotipo className="h-auto w-[130px] lg:w-[150px]" />
          </Link>

          <ul className="hidden gap-10 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <EnlaceMenu
                  enlace={link}
                  className={`${styles.enlace} ${esActivo(link) ? styles.activo : ""}`}
                  aria-current={esActivo(link) ? (link.ancla ? "true" : "page") : undefined}
                />
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <BotonWhatsApp
              variante={tonoClaro ? "contorno-marfil" : transparente ? "contorno-vino" : "vino"}
              icono="ninguno"
            />
          </div>

          <button
            ref={botonRef}
            type="button"
            onClick={alternar}
            className={styles.hamburguesa}
            data-abierto={abierto || undefined}
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={abierto}
            aria-controls="menu-movil"
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </header>

      {/* Patrón disclosure (no dialog): el botón de cierre vive en el header. */}
      <div
        id="menu-movil"
        inert={!abierto}
        data-abierto={abierto || undefined}
        className={`${styles.menuMovil} fixed inset-0 z-40 overflow-y-auto bg-vino text-marfil lg:hidden`}
      >
        <div className="contenedor flex min-h-full flex-col pt-[var(--altura-navbar)]">
          <ul className="mt-6 flex flex-col gap-4">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <EnlaceMenu
                  ref={i === 0 ? primerEnlaceRef : undefined}
                  enlace={link}
                  onClick={cerrar}
                  className="inline-flex min-h-11 items-center font-titulo text-h3"
                  aria-current={esActivo(link) ? (link.ancla ? "true" : "page") : undefined}
                />
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-start gap-4 border-t border-linea-clara pt-6">
            <BotonWhatsApp variante="marfil" />
            <a href={telefonoHref} className="inline-flex min-h-11 items-center gap-2 text-pequeno text-marfil-75 hover:text-marfil">
              <Phone className="size-5" strokeWidth={1.5} aria-hidden="true" />
              {site.telefonoVisible}
            </a>
          </div>

          <SimboloS className="mt-auto mb-10 h-auto w-[96px] self-center pt-10 text-rosa" />
        </div>
      </div>
    </>
  );
}

/**
 * Enlace del menú: las secciones del home van con <a> (fragmento en el mismo documento, conserva
 * el scroll suave); las páginas propias con <Link> (navegación de cliente).
 */
function EnlaceMenu({
  enlace,
  ref,
  ...resto
}: {
  enlace: EnlaceNav;
  ref?: Ref<HTMLAnchorElement>;
  className?: string;
  onClick?: () => void;
  "aria-current"?: "true" | "page";
}) {
  if (enlace.ancla) {
    return (
      <a ref={ref} href={enlace.href} {...resto}>
        {enlace.label}
      </a>
    );
  }
  return (
    <Link ref={ref} href={enlace.href} {...resto}>
      {enlace.label}
    </Link>
  );
}
