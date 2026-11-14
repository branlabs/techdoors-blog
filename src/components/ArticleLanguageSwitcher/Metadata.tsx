import type {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import {invisibleComputer} from './index';

const origin = 'https://techdoors.io';

// Keep alternates in the same Helmet link array so that they are not
// collapsed by another Head instance carrying the default locale metadata.
export default function ArticleLanguageMetadata({
  language,
}: {
  language: 'vi' | 'en';
}): ReactNode {
  return (
    <Head
      link={[
        {href: origin + invisibleComputer.vi, rel: 'alternate', hrefLang: 'vi-VN'},
        {href: origin + invisibleComputer.en, rel: 'alternate', hrefLang: 'en-US'},
        {href: origin + invisibleComputer.vi, rel: 'alternate', hrefLang: 'x-default'},
      ]}
    >
      {language === 'en' && <html lang="en" />}
      {language === 'en' && <meta property="og:locale" content="en_US" />}
    </Head>
  );
}
