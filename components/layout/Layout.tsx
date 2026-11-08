import { useState, type ReactNode } from "react";

import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  // Con el menú móvil abierto, main y footer quedan `inert`: el foco no sale del menú.
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-pill focus:bg-vino focus:px-5 focus:text-etiqueta focus:font-semibold focus:text-marfil"
      >
        Saltar al contenido
      </a>
      <Navbar alCambiarMenu={setMenuAbierto} />
      <main id="contenido" tabIndex={-1} className="outline-none" inert={menuAbierto}>
        {children}
      </main>
      <Footer inert={menuAbierto} />
    </>
  );
}
