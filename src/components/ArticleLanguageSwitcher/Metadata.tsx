import type {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import {invisibleComputer} from './index';

const origin = 'https://techdoors.io';

export default function ArticleLanguageMetadata({
  language,
}: {
  language: 'vi' | 'en';
}): ReactNode {
  return (
    <Head>
      {language === 'en' && <html lang="en" />}
      {language === 'en' && <meta property="og:locale" content="en_US" />}
      <link rel="alternate" hrefLang="vi-VN" href={origin + invisibleComputer.vi} />
      <link rel="alternate" hrefLang="en-US" href={origin + invisibleComputer.en} />
      <link rel="alternate" hrefLang="x-default" href={origin + invisibleComputer.vi} />
    </Head>
  );
}
