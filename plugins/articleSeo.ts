import {readFile, readdir, writeFile} from 'node:fs/promises';
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

      // Untranslated author archive pages should not be searchable.
      // Normalize language metadata on English blog routes.
      async function normalizeEnglishPages(dir: string): Promise<void> {
        for (const entry of await readdir(dir, {withFileTypes: true})) {
          const file = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            await normalizeEnglishPages(file);
          } else if (entry.isFile() && entry.name.endsWith('.html')) {
            let html = await readFile(file, 'utf8');
            html = html.replace(/(<html\b[^>]*\blang=["'])[^"']+(["'])/i, '$1en$2');
            html = html.replace(/<meta\b(?=[^>]*\bproperty=["']og:locale["'])[^>]*>/gi, (tag) =>
              tag.replace(/\bcontent=["'][^"']*["']/i, 'content="en_US"'),
            );
            const authors = file.includes(path.sep + 'authors' + path.sep);
            if (authors) {
              html = html.replace(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi, '');
              html = html.replace('</head>', '<meta name="robots" content="noindex, follow"/></head>');
            }
            await writeFile(file, html);
          }
        }
      }
      await normalizeEnglishPages(path.join(outDir, 'en', 'blog'));
    },
  };
}
