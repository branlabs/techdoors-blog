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
    const removeDuplicates = () => {
      // The real article alternates are SSR links from articleSeo.ts, without
      // data-rh. Remove the default-locale Helmet links it can reinsert.
      for (const link of Array.from(document.head.querySelectorAll<HTMLLinkElement>(
        'link[data-rh="true"][rel="alternate"][hreflang]',
      ))) {
        if (['vi-VN', 'en-US', 'x-default'].includes(link.hreflang)) {
          link.remove();
        }
      }
    };
    removeDuplicates();
    const observer = new MutationObserver(removeDuplicates);
    observer.observe(document.head, {childList: true});
    return () => observer.disconnect();
  }, []);

  if (language !== 'en') return null;
  return (
    <Head>
      <html lang="en" />
      <meta property="og:locale" content="en_US" />
    </Head>
  );
}
