import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import BotonWhatsApp from "@/components/ui/BotonWhatsApp";
import { navLinks, site } from "@/lib/site-config";

import styles from "./Navbar.module.scss";

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const [conFondo, setConFondo] = useState(false);
  const sinMovimiento = useReducedMotion();

  // El navbar es transparente sobre el hero y gana fondo al bajar
  useEffect(() => {
    const alHacerScroll = () => setConFondo(window.scrollY > 40);
    alHacerScroll();
    window.addEventListener("scroll", alHacerScroll, { passive: true });
    return () => window.removeEventListener("scroll", alHacerScroll);
  }, []);

  // Con el menú abierto: bloquea el scroll del body y escucha Esc
  useEffect(() => {
    if (!abierto) return;

    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", alPresionar);

    return () => {
      document.body.style.overflow = overflowPrevio;
      window.removeEventListener("keydown", alPresionar);
    };
  }, [abierto]);

  const barra = (i: number) => {
    const activo = abierto;
    return {
      initial: false,
      animate: {
        rotate: activo ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
        y: activo ? (i === 0 ? 7 : i === 2 ? -7 : 0) : 0,
        opacity: activo && i === 1 ? 0 : 1,
      },
      transition: { duration: sinMovimiento ? 0 : 0.3, ease: "easeInOut" },
    } as const;
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          // Con el menú abierto se deja transparente para fundirse con el overlay rosa
          conFondo && !abierto
            ? "bg-crema/95 shadow-[0_1px_20px_rgba(62,39,35,0.08)] backdrop-blur"
            : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-10"
          aria-label="Navegación principal"
        >
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label={`${site.nombre} — inicio`}
          >
            <Image
              src="/logo-sadai.png"
              alt=""
              width={44}
              height={44}
              priority
              className="size-10 rounded-full object-cover md:size-11"
            />
            <span className="leading-none">
              <span className="block font-firma text-xl text-cacao md:text-2xl">
                Sadai
              </span>
              <span className="block text-[0.55rem] tracking-[0.28em] text-cacao-suave uppercase">
                Artistic Nails
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.enlace}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <BotonWhatsApp className="px-6 py-2.5 text-xs" icono="ninguno" />
          </div>

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className={styles.hamburguesa}
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={abierto}
            aria-controls="menu-movil"
          >
            {[0, 1, 2].map((i) => (
              <motion.span key={i} {...barra(i)} />
            ))}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {abierto ? (
          <motion.div
            id="menu-movil"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-rosa px-8 pt-20 md:hidden"
            initial={{ x: sinMovimiento ? 0 : "100%", opacity: sinMovimiento ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: sinMovimiento ? 0 : "100%", opacity: sinMovimiento ? 0 : 1 }}
            transition={{ duration: sinMovimiento ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col gap-7">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: sinMovimiento ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: sinMovimiento ? 0 : 0.16 + i * 0.08,
                    duration: 0.4,
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => setAbierto(false)}
                    className="font-titulo text-4xl text-cacao"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: sinMovimiento ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sinMovimiento ? 0 : 0.42, duration: 0.4 }}
            >
              <BotonWhatsApp />
              <p className="mt-8 text-xs tracking-[0.2em] text-cacao-suave uppercase">
                {site.telefonoVisible}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
