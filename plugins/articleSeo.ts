import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import type {Plugin} from '@docusaurus/types';

const vi = '/blog/the-invisible-computer/';
const en = '/en/blog/the-invisible-computer/';
const base = 'https://techdoors.io';

// The main site has one Docusaurus locale (vi). Its automatic SEO metadata
// cannot describe this separately authored English blog article. Inject
// alternates for the two pages only in the production HTML build.
export default function articleSeoPlugin(): Plugin {
  return {
    name: 'techdoors-article-seo',
    async postBuild({outDir}) {
      const alternatives = [
        {lang: 'vi-VN', href: base + vi},
        {lang: 'en-US', href: base + en},
        {lang: 'x-default', href: base + vi},
      ];
      const links = alternatives
        .map(({lang, href}) => '<link rel="alternate" hreflang="' + lang + '" href="' + href + '"/>')
        .join('');
      // Remove VI-only locale alternates, but leave alternate RSS/Atom links.
      const languageLink = /<link\b(?=[^>]*\brel=["']alternate["'])(?=[^>]*\bhreflang=["'](?:vi-VN|en-US|x-default)["'])[^>]*>/gi;
      for (const route of [vi, en]) {
        const file = path.join(outDir, route.slice(1), 'index.html');
        let html = await readFile(file, 'utf8');
        html = html.replace(languageLink, '');
        if (!html.includes('</head>')) {
          throw new Error('Cannot write article alternates: missing head in ' + route);
        }
        html = html.replace('</head>', links + '</head>');
        await writeFile(file, html);
      }
    },
  };
}
