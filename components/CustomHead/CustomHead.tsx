import { isUrl } from '@/utility/index';
import Head from 'next/head';
import { useRouter } from 'next/router';

export interface Meta {
  title?: string;
  description?: string;
  /** relative path */
  image?: string;
  type?: string;
  date?: string;
}

const CustomHead = ({ ...customMeta }: Meta) => {
  const router = useRouter();

  // this is the only file that needs NEXT_PUBLIC_BASE_URL at build time

  // this must use env var or SSR prop, must be same on SSR and CSR, no javascript
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // with '/'
  const trimmedBaseUrl = (baseUrl as string).replace(/\/$/, ''); // without

  const defaultMeta = {
    title: 'MindLabs',
    description: 'Collaborative learning platform for students and teachers',
    image: `${baseUrl}images/MindLabs_logo_full.png`,
    type: 'website',
  };

  // returns image with absolute path
  const handleCustomMeta = (_meta: Meta): Meta => {
    const { image } = _meta;
    if (!image || isUrl(image)) return _meta;
    return { ..._meta, image: `${baseUrl}${image}` };
  };

  const meta = { ...defaultMeta, ...handleCustomMeta(customMeta) };

  return (
    <Head>
      <title>{meta.title}</title>
      <meta charSet="utf-8" />
      {/* should handle position: fixed on Chrome mobile, it doesn't work */}
      <meta
        name="viewport"
        content="initial-scale=1.0, minimum-scale=1.0, height=device-height, width=device-width"
      />

      <meta name="robots" content="follow, index" />
      <meta content={meta.description} name="description" />
      <link rel="canonical" href={`${trimmedBaseUrl}${router.asPath}`} />

      {/* og */}
      <meta property="og:url" content={`${trimmedBaseUrl}${router.asPath}`} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content="MindLabs" />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:image" content={meta.image} />

      {/* tw */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@my_acc" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      {meta.date && (
        <meta property="article:published_time" content={meta.date} />
      )}
    </Head>
  );
};

export default CustomHead;
