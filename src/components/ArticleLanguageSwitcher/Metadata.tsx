import type {ReactNode} from 'react';
import Head from '@docusaurus/Head';

// The paired hreflang links are created during the production build.
export default function ArticleLanguageMetadata({
  language,
}: {
  language: 'vi' | 'en';
}): ReactNode {
  if (language !== 'en') return null;
  return (
    <Head>
      <html lang="en" />
      <meta property="og:locale" content="en_US" />
    </Head>
  );
}
