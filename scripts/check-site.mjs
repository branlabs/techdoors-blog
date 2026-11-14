import {readFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
import assert from 'node:assert/strict';

const root = path.resolve('build');
const origin = 'https://techdoors.io';
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
}
await walk(root);
assert(files.length > 5, 'Build must contain all site pages');
const parsed = new Map();
for (const file of files) parsed.set(file, load(await readFile(file, 'utf8')));
async function targetFor(url) {
  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const absolute = path.resolve(root, relative);
  assert(
    absolute === root || absolute.startsWith(root + path.sep),
    'Link must stay inside the build',
  );
  for (const candidate of [absolute, path.join(absolute, 'index.html'), absolute + '.html']) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      /* Try the directory form. */
    }
  }
  return null;
}
let links = 0;
for (const [file, $] of parsed) {
  const route =
    '/' +
    path
      .relative(root, file)
      .split(path.sep)
      .join('/')
      .replace(/index\.html$/, '');
  const pageUrl = new URL(route, origin);
  const english = route.startsWith('/en/blog/');
  assert.match($('html').attr('lang') ?? '', english ? /^en/ : /^vi/, `${route}: html lang`);
  assert.equal($('h1').length, 1, `${route}: exactly one h1`);
  assert($('title').text().includes('TechDoors'), `${route}: branded title`);
  // Do not advertise the website repository; unrelated GitHub references in
  // future technical articles may remain legitimate citations.
  assert.equal(
    $('a[href*="github.com/branlabs/techdoors-blog"]').length,
    0,
    `${route}: website source link in public page`,
  );
  assert.equal(
    $('a[href*="/edit/main/"]').length,
    0,
    `${route}: GitHub editor link in public page`,
  );
  const html = await readFile(file, 'utf8');
  assert(
    !html.toLowerCase().includes('github.com/branlabs/techdoors-blog'),
    `${route}: website repository URL leaked in public HTML`,
  );
  assert($('meta[name="description"]').attr('content'), `${route}: description`);
  const expectedCanonical = route === '/blog/chiec-may-tinh-vo-hinh/' ? 'https://techdoors.io/blog/the-invisible-computer/' : pageUrl.href;
  assert.equal($('link[rel="canonical"]').attr('href'), expectedCanonical, `${route}: canonical`);
  if (route === '/blog/the-invisible-computer/' || route === '/en/blog/the-invisible-computer/') {
    const alternates = {
      'vi-VN': origin + '/blog/the-invisible-computer/',
      'en-US': origin + '/en/blog/the-invisible-computer/',
      'x-default': origin + '/blog/the-invisible-computer/',
    };
    for (const [lang, href] of Object.entries(alternates)) {
      assert.equal(
        $('link[rel="alternate"]').filter((_, element) => $(element).attr('hreflang') === lang).attr('href'),
        href,
        `${route}: missing ${lang} alternate`,
      );
    }
    assert.equal($('nav[aria-label="Article language"], nav[aria-label="Ngôn ngữ bài viết"]').length, 1, `${route}: missing language selector`);
  }
  if (english) {
    assert.equal($('meta[property="og:locale"]').attr('content'), 'en_US', `${route}: English Open Graph locale`);
  }
  assert.equal(
    $('meta[property="og:image"]').attr('content'),
    `${origin}/img/og-default.png`,
    `${route}: Open Graph image`,
  );
  for (const node of $('a[href], img[src]').toArray()) {
    const value = $(node).attr(node.tagName === 'img' ? 'src' : 'href');
    if (!value || /^(mailto:|tel:|data:|javascript:)/.test(value)) continue;
    const target = new URL(value, pageUrl);
    if (target.origin !== origin) continue;
    const destination = await targetFor(target);
    assert(destination, `${route}: broken internal URL ${value}`);
    if (target.hash && parsed.has(destination)) {
      const id = decodeURIComponent(target.hash.slice(1));
      const found = parsed
        .get(destination)('[id]')
        .toArray()
        .some((element) => parsed.get(destination)(element).attr('id') === id);
      assert(found, `${route}: missing anchor ${value}`);
    }
    links++;
  }
}
for (const [file, element, title] of [
  ['blog/rss.xml', 'item', 'Chiếc máy tính vô hình'],
  ['blog/atom.xml', 'entry', 'Chiếc máy tính vô hình'],
  ['en/blog/rss.xml', 'item', 'The Invisible Computer'],
  ['en/blog/atom.xml', 'entry', 'The Invisible Computer'],
]) {
  const xml = load(await readFile(path.join(root, file), 'utf8'), {xmlMode: true});
  assert(xml(element).length >= 1, `${file}: published post`);
  assert(xml('title').text().includes(title), `${file}: published article`);
  assert(!xml('title').text().includes('Chào mừng đến với TechDoors'), `${file}: unlisted welcome`);
  assert(!xml('title').text().includes('CloudPlay:'), `${file}: unlisted CloudPlay`);
  assert(
    !(await readFile(path.join(root, file), 'utf8')).includes('localhost'),
    `${file}: production URLs`,
  );
}
const sitemap = load(await readFile(path.join(root, 'sitemap.xml'), 'utf8'), {xmlMode: true});
const locations = sitemap('loc')
  .toArray()
  .map((element) => sitemap(element).text());
for (const route of ['/', '/about/', '/projects/', '/blog/', '/blog/the-invisible-computer/', '/en/blog/', '/en/blog/the-invisible-computer/'])
  assert(locations.includes(origin + route), `Sitemap missing ${route}`);
assert(
  !locations.some((url) => /404|\/search\//.test(url)),
  'Search and 404 must not be in the sitemap',
);
for (const hidden of ['/blog/chao-mung-den-voi-techdoors/', '/blog/cloudplay-tu-card-trong-server-den-stream-60fps/']) {
  assert(!locations.includes(origin + hidden), `${hidden}: unlisted post in sitemap`);
  const hiddenPage = await targetFor(new URL(origin + hidden));
  assert(hiddenPage, `${hidden}: direct URL should still exist`);
  assert.match(parsed.get(hiddenPage)('meta[name="robots"]').attr('content') ?? '', /noindex/, `${hidden}: not blocked from indexing`);
}
const legacyRoute = '/blog/chiec-may-tinh-vo-hinh/';
assert(!locations.includes(origin + legacyRoute), 'Legacy permalink must not appear in sitemap');
const legacyPage = await targetFor(new URL(origin + legacyRoute));
assert(legacyPage, 'Legacy permalink redirect page must exist');
const legacy = parsed.get(legacyPage);
assert(legacy, 'Legacy redirect must be parsed');
assert.equal(legacy('link[rel="canonical"]').attr('href'), origin + '/blog/the-invisible-computer/');
assert.equal(legacy('meta[name="robots"]').attr('content'), 'noindex, follow');
assert.match(legacy('meta[http-equiv="refresh"]').attr('content') ?? '', /url=\/blog\/the-invisible-computer\//);

const englishPage = await targetFor(new URL(origin + '/en/blog/the-invisible-computer/'));
assert(englishPage && parsed.has(englishPage), 'English translation must be generated');
const englishArticle = parsed.get(englishPage);
assert.equal(englishArticle('h1').first().text(), 'The Invisible Computer');
assert(!englishArticle('body').text().includes('QEMY'), 'Uncorrected translation typo found');

for (const location of locations) {
  const url = new URL(location);
  assert.equal(url.origin, origin);
  assert(await targetFor(url), `Sitemap has a missing URL: ${location}`);
}
assert.equal((await readFile(path.join(root, 'CNAME'), 'utf8')).trim(), 'techdoors.io');
const png = await readFile(path.join(root, 'img/og-default.png'));
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);
console.log(
  `Verified ${files.length} HTML pages, ${links} internal links/assets, ${locations.length} sitemap URLs, RSS/Atom, canonical metadata and OG image.`,
);
