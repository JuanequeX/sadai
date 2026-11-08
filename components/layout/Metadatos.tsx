import Head from "next/head";

import { site } from "@/lib/site-config";

type MetadatosProps = {
  titulo: string;
  descripcion: string;
  /** Ruta absoluta desde la raíz ("/"). Solo se usa para canonical y og:url. */
  ruta?: string;
  noindex?: boolean;
};

/** Metadatos de página: title, description, robots, canonical, Open Graph y Twitter. */
export default function Metadatos({ titulo, descripcion, ruta = "/", noindex = false }: MetadatosProps) {
  const url = `${site.url}${ruta}`;
  const imagen = `${site.url}/og.jpg`;

  return (
    <Head>
      <title>{titulo}</title>
      <meta name="description" content={descripcion} />
      {noindex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={url} />}

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="es_MX" />
      <meta property="og:site_name" content={site.marca} />
      <meta property="og:title" content={titulo} />
      <meta property="og:description" content={descripcion} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imagen} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Logotipo de Sadai sobre un degradado vino y rosa" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
