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
  assert.match($('html').attr('lang') ?? '', /^vi/);
  assert.equal($('h1').length, 1, `${route}: exactly one h1`);
  assert($('title').text().includes('TechDoors'), `${route}: branded title`);
  assert($('meta[name="description"]').attr('content'), `${route}: description`);
  assert.equal($('link[rel="canonical"]').attr('href'), pageUrl.href, `${route}: canonical`);
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
for (const [file, element] of [
  ['blog/rss.xml', 'item'],
  ['blog/atom.xml', 'entry'],
]) {
  const xml = load(await readFile(path.join(root, file), 'utf8'), {xmlMode: true});
  assert(xml(element).length >= 1, `${file}: published post`);
  assert(xml('title').text().includes('Chiếc máy tính vô hình'), `${file}: published article`);
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
for (const route of ['/', '/about/', '/projects/', '/blog/', '/blog/chiec-may-tinh-vo-hinh/'])
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
