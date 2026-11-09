import { useState, useSyncExternalStore } from "react";

/**
 * Pestaña activa del menú de servicios, enlazable por hash (#servicios-pies).
 * Fuente de verdad = location.hash; sin setState en efectos.
 */
const EVENTO = "sadai:hash";
const PREFIJO = "#servicios-";

const suscribir = (cb: () => void) => {
  addEventListener("hashchange", cb);
  addEventListener(EVENTO, cb);
  return () => {
    removeEventListener("hashchange", cb);
    removeEventListener(EVENTO, cb);
  };
};

export function useCategoriaHash<T extends string>(ids: readonly T[], porDefecto: T) {
  const hash = useSyncExternalStore(suscribir, () => location.hash, () => "");
  const [seleccion, setSeleccion] = useState<T>(porDefecto);
  const desdeHash = hash.startsWith(PREFIJO) ? (hash.slice(PREFIJO.length) as T) : null;
  const activa = desdeHash && ids.includes(desdeHash) ? desdeHash : seleccion;

  const seleccionar = (id: T) => {
    setSeleccion(id);
    // Conservar history.state: el router de Pages guarda ahí su estado (__N); null rompería "atrás".
    history.replaceState(history.state, "", `${PREFIJO}${id}`);
    dispatchEvent(new Event(EVENTO));
  };

  return [activa, seleccionar] as const;
}
