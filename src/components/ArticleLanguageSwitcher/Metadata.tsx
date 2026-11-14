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
      <link href={origin + invisibleComputer.vi} rel="alternate" hrefLang="vi-VN" />
      <link href={origin + invisibleComputer.en} rel="alternate" hrefLang="en-US" />
      <link href={origin + invisibleComputer.vi} rel="alternate" hrefLang="x-default" />
    </Head>
  );
}
