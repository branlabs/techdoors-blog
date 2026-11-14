import type {Config} from '@docusaurus/types';
import type {Options as BlogOptions} from '@docusaurus/plugin-content-blog';
import type {UserThemeConfig as ThemeConfig} from '@docusaurus/theme-common';
import type {PrismTheme} from 'prism-react-renderer';

const lightCode: PrismTheme = {
  plain: {color: '#262923', backgroundColor: '#eeede6'},
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: '#606758'}},
    {types: ['string', 'attr-value', 'char', 'builtin', 'inserted'], style: {color: '#276449'}},
    {
      types: ['keyword', 'operator', 'function', 'class-name', 'tag', 'selector'],
      style: {color: '#8b3b28'},
    },
    {
      types: ['boolean', 'number', 'constant', 'symbol', 'parameter', 'attr-name'],
      style: {color: '#5c4390'},
    },
  ],
};
const darkCode: PrismTheme = {
  plain: {color: '#e9eae2', backgroundColor: '#222621'},
  styles: [
    {types: ['comment', 'prolog', 'doctype', 'cdata'], style: {color: '#abb1a4'}},
    {types: ['string', 'attr-value', 'char', 'builtin', 'inserted'], style: {color: '#a8cc97'}},
    {
      types: ['keyword', 'operator', 'function', 'class-name', 'tag', 'selector'],
      style: {color: '#f0a17c'},
    },
    {
      types: ['boolean', 'number', 'constant', 'symbol', 'parameter', 'attr-name'],
      style: {color: '#c7b0ee'},
    },
  ],
};

const config: Config = {
  title: 'TechDoors',
  tagline: 'Ghi chép về hạ tầng. Mở thêm một cánh cửa.',
  favicon: 'img/favicon-door.svg',
  url: 'https://techdoors.io',
  baseUrl: '/',
  trailingSlash: true,
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    hooks: {onBrokenMarkdownLinks: 'throw', onBrokenMarkdownImages: 'throw'},
  },
  // Only Vietnamese is shipped. Add an English locale when translations exist.
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi'],
    localeConfigs: {vi: {label: 'Tiếng Việt', htmlLang: 'vi-VN'}},
  },
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        blogTitle: 'Bài viết',
        blogDescription: 'Ghi chép về DevOps, SRE, Kubernetes và những hệ thống phía sau màn hình.',
        routeBasePath: 'blog',
        blogSidebarCount: 0,
        postsPerPage: 6,
        showReadingTime: true,
        onInlineTags: 'throw',
        onInlineAuthors: 'throw',
        onUntruncatedBlogPosts: 'throw',
        feedOptions: {
          type: ['rss', 'atom'],
          title: 'TechDoors — Ghi chép kỹ thuật',
          description: 'Bài viết mới về hạ tầng, vận hành và kỹ thuật phần mềm từ TechDoors.',
          language: 'vi-VN',
          copyright: `© ${new Date().getFullYear()} TechDoors`,
        },
      } satisfies Partial<BlogOptions>,
    ],
    // Article-only English publishing. Keep the main site in Vietnamese until
    // Brandon has written translations for its general pages.
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'english',
        path: 'blog-en',
        routeBasePath: 'en/blog',
        archiveBasePath: null,
        blogTitle: 'Articles',
        blogDescription: 'TechDoors stories about Linux, virtual machines, and infrastructure.',
        blogSidebarCount: 0,
        postsPerPage: 6,
        showReadingTime: true,
        onInlineTags: 'throw',
        onInlineAuthors: 'throw',
        onUntruncatedBlogPosts: 'throw',
        feedOptions: {
          type: ['rss', 'atom'],
          title: 'TechDoors — Technical Notes',
          description: 'English articles about infrastructure and the systems behind the screen.',
          language: 'en-US',
          copyright: `© ${new Date().getFullYear()} TechDoors`,
        },
      } satisfies Partial<BlogOptions>,
    ],
    '@docusaurus/plugin-content-pages',
    [
      '@docusaurus/plugin-sitemap',
      {changefreq: 'weekly', priority: 0.5, ignorePatterns: ['/search/**', '/en/blog/authors/**']},
    ],
    './plugins/content.ts',
    './plugins/articleSeo.ts',
  ],
  themes: [
    ['@docusaurus/theme-classic', {customCss: './src/css/custom.css'}],
    [
      '@cmfcmf/docusaurus-search-local',
      {
        indexDocs: false,
        indexBlog: true,
        indexPages: true,
        language: 'vi',
        maxSearchResults: 8,
        style: 'none',
      },
    ],
  ],
  themeConfig: {
    image: 'img/og-default.png',
    metadata: [
      {
        name: 'description',
        content:
          'TechDoors là blog kỹ thuật cá nhân bằng tiếng Việt về DevOps, SRE, Kubernetes, Platform Engineering và hạ tầng.',
      },
      {name: 'theme-color', content: '#f6f5f0'},
      {property: 'og:locale', content: 'vi_VN'},
      {name: 'color-scheme', content: 'light dark'},
    ],
    colorMode: {defaultMode: 'light', disableSwitch: false, respectPrefersColorScheme: false},
    navbar: {
      title: 'TechDoors',
      logo: {alt: '', src: 'img/mark.svg', srcDark: 'img/mark.svg', width: 28, height: 30},
      hideOnScroll: false,
      items: [
        {to: '/blog', label: 'Bài viết', position: 'left'},
        {to: '/projects', label: 'Dự án', position: 'left'},
        {to: '/about', label: 'Giới thiệu', position: 'left'},
        {type: 'search', position: 'right'},
      ],
    },
    prism: {
      theme: lightCode,
      darkTheme: darkCode,
      additionalLanguages: ['bash', 'yaml', 'json', 'docker', 'nginx', 'hcl', 'diff'],
    },
    tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 3},
  } satisfies ThemeConfig,
};

export default config;
