import Sticker from "@/components/marca/Sticker";
import BotonWhatsApp from "@/components/ui/BotonWhatsApp";
import Degradado from "@/components/ui/Degradado";
import { site } from "@/lib/site-config";

import styles from "./MenuServicios.module.scss";

/**
 * Diseños y decoraciones se cotizan aparte. Fondo --grad-01 con velo vino: el ajuste local
 * (.cotizacion) oscurece la esquina clara para que el marfil quede ≥ 4.5:1 en todo el bloque.
 * Contorno doble (borde vino + anillo marfil 55 %): el fondo de Servicios pasa de rosa a satén
 * vino, y uno de los dos trazos siempre contrasta ≥ 3:1 con lo que hay detrás.
 */
export default function TarjetaCotizacion() {
  return (
    <div className="relative">
      <Degradado variante="01" grano velo="superior" className={`${styles.cotizacion} overflow-hidden rounded-tarjeta border border-vino shadow-[0_0_0_1px_rgb(249_248_244/0.55)] p-8 text-marfil sm:p-10`}>
        <div className="max-w-xl">
          <h3 className="text-h3">Cuéntame el diseño que imaginas.</h3>
          <p className="mt-4 text-cuerpo">
            Los diseños se cotizan según la técnica. Envíame tu foto de inspiración y te paso el precio.
          </p>
          <div className="mt-6">
            <BotonWhatsApp variante="marfil" mensaje={site.mensajeCotizacion}>
              Enviar mi inspiración
            </BotonWhatsApp>
          </div>
        </div>
      </Degradado>
      <Sticker numero="09" ancho={110} rotacion={10} className="absolute -right-3 -bottom-6 hidden sm:block" />
    </div>
  );
}
