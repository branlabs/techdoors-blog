import {useEffect, type ReactNode} from 'react';
import Head from '@docusaurus/Head';

// The paired hreflang links are created during the production build.
export default function ArticleLanguageMetadata({
  language,
}: {
  language: 'vi' | 'en';
}): ReactNode {
  // Docusaurus injects vi-VN / x-default for the single global locale
  // again during hydration. The production HTML already contains the three
  // correct article alternates from articleSeo.ts; keep those, and remove
  // only Helmet's duplicate (and wrong on /en/) language links.
  useEffect(() => {
    for (const link of document.head.querySelectorAll<HTMLLinkElement>(
      'link[data-rh="true"][rel="alternate"][hreflang]',
    )) {
      if (['vi-VN', 'en-US', 'x-default'].includes(link.hreflang)) {
        link.remove();
      }
    }
  }, []);

  if (language !== 'en') return null;
  return (
    <Head>
      <html lang="en" />
      <meta property="og:locale" content="en_US" />
    </Head>
  );
}
