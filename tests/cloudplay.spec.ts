import {readFile} from 'node:fs/promises';
import {test, expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const hub = '/projects/cloudplay/';
const updates = '/projects/cloudplay/updates/';
const story = '/blog/cloudplay-tu-card-trong-server-den-stream-60fps/';

async function settle(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
}

async function setTheme(page: Page, mode: 'light' | 'dark') {
  if ((await page.locator('html').getAttribute('data-theme')) === mode) return;
  const toggle = page.getByRole('button', {name: /Chuyển đổi chế độ sáng và tối/});
  if (!(await toggle.filter({visible: true}).count()))
    await page.locator('.navbar__toggle').click();
  await toggle.filter({visible: true}).click();
  const close = page.locator('.navbar-sidebar__close');
  if (await close.isVisible()) await close.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', mode);
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations()
      .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
      .map((animation) => animation.finished.catch(() => {})));
  });
}

for (const mode of ['light', 'dark'] as const) {
  for (const [label, route, title] of [
    ['hub', hub, 'CloudPlay'],
    ['updates', updates, 'Nhật ký cải tiến CloudPlay'],
    ['story', story, 'CloudPlay: từ 15 FPS đến 60 FPS trên OpenStack'],
  ] as const) {
    test(`CloudPlay ${label} is readable and accessible in ${mode}`, async ({page}, testInfo) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await settle(page);
      await setTheme(page, mode);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText(title);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://techdoors.io${route}`);
      await expect(page.locator('main')).not.toContainText('BranLabs CloudPlay');
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      await expect(page.locator('footer a[href$="rss.xml"], footer a[href$="atom.xml"]')).toHaveCount(0);
      const {violations} = await new AxeBuilder({page})
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      expect(violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)}))).toEqual([]);
      const screenshot = await page.screenshot({path: testInfo.outputPath(`${label}-${mode}.png`), fullPage: true});
      await testInfo.attach(`${label}-${mode}`, {body: screenshot, contentType: 'image/png'});
      expect(errors).toEqual([]);
    });
  }
}

test('CloudPlay card, hub and updates remain connected without a link to the unlisted story', async ({page}) => {
  await page.goto('/projects/');
  await settle(page);
  await page.getByRole('link', {name: 'Xem chi tiết dự án', exact: true}).click();
  await expect(page).toHaveURL(new RegExp(hub + '$'));
  await expect(page.locator('main')).toContainText('Chưa kiểm thử game thực tế');
  const navigation = page.getByRole('navigation', {name: 'Điều hướng dự án CloudPlay'});
  await expect(navigation.getByRole('link', {name: 'Tổng quan', exact: true})).toHaveAttribute('aria-current', 'page');
  await navigation.getByRole('link', {name: 'Nhật ký cải tiến', exact: true}).click();
  await expect(page).toHaveURL(new RegExp(updates + '$'));
  for (const id of ['cp-u01', 'cp-u02', 'cp-u03', 'cp-u04', 'cp-u05', 'sources']) {
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  }
  await expect(navigation.getByRole('link', {name: 'Đọc bài hành trình'})).toHaveCount(0);
  await navigation.getByRole('link', {name: 'Tổng quan', exact: true}).click();
  await expect(page).toHaveURL(new RegExp(hub + '
});

test('CloudPlay project remains discoverable while the story is unlisted', async ({page, request}) => {
  test.setTimeout(60000);
  await page.goto('/');
  await settle(page);
  const recent = page.getByRole('region', {name: 'Bài viết mới', exact: true});
  await expect(recent.locator(`a[href="${story}"]`)).toHaveCount(0);
  await expect(recent.getByRole('article')).toHaveCount(1);
  await page.getByRole('button', {name: 'Tìm kiếm trên TechDoors'}).click();
  const dialog = page.getByRole('dialog', {name: 'Tìm trong TechDoors'});
  await dialog.getByRole('searchbox', {name: 'Từ khóa'}).fill('CloudPlay');
  await expect(dialog.locator(`a[href="${story}"]`)).toHaveCount(0);
  const result = dialog.locator(`a[href="${hub}"]`);
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(new RegExp(hub + '$'));
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const route of [hub, updates]) expect(xml).toContain(`https://techdoors.io${route}`);
  expect(xml).not.toContain(`https://techdoors.io${story}`);
  for (const format of ['rss', 'atom']) {
    const feed = await request.get(`/blog/${format}.xml`);
    expect(feed.status()).toBe(200);
    expect(await feed.text()).not.toContain('CloudPlay');
  }
});


test('CloudPlay source preserves editorial and disclosure boundaries', async () => {
  const paths = [
    'src/data/projects.ts',
    'src/pages/projects/cloudplay/index.mdx',
    'src/pages/projects/cloudplay/updates.mdx',
    'blog/2026-11-08-cloudplay-hanh-trinh/index.md',
  ];
  for (const path of paths) {
    const source = await readFile(path, 'utf8');
    expect(source, path).not.toMatch(/[\u2014]/);
    expect(source, path).not.toContain('BranLabs CloudPlay');
    expect(source, path).not.toMatch(/\b(?:192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/);
    expect(source, path).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    expect(source, path).not.toMatch(/-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/);
  }
  const snapshot = await readFile('src/pages/projects/cloudplay/index.mdx', 'utf8');
  expect(snapshot).toContain('Chưa kiểm thử game thực tế');
  expect(snapshot).toContain('FPS của luồng video không phải FPS của game');
  expect(snapshot).toContain('host processing không phải toàn bộ độ trễ');
});
));
  await expect(page.locator('main').locator(`a[href="${story}"]`)).toHaveCount(0);
});

test('CloudPlay is discoverable in homepage, search, sitemap and background feeds', async ({page, request}) => {
  test.setTimeout(60000);
  await page.goto('/');
  await settle(page);
  const recent = page.getByRole('region', {name: 'Bài viết mới', exact: true});
  await expect(recent.locator(`a[href="${story}"]`)).toBeVisible();
  expect(await recent.getByRole('article').count()).toBeGreaterThanOrEqual(3);
  await page.getByRole('button', {name: 'Tìm kiếm trên TechDoors'}).click();
  const dialog = page.getByRole('dialog', {name: 'Tìm trong TechDoors'});
  await dialog.getByRole('searchbox', {name: 'Từ khóa'}).fill('CloudPlay');
  const result = dialog.locator(`a[href="${hub}"]`);
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(new RegExp(hub + '$'));
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const route of [hub, updates, story]) expect(xml).toContain(`https://techdoors.io${route}`);
  for (const format of ['rss', 'atom']) {
    const feed = await request.get(`/blog/${format}.xml`);
    expect(feed.status()).toBe(200);
    expect(await feed.text()).toContain('CloudPlay');
  }
});

test('CloudPlay source preserves editorial and disclosure boundaries', async () => {
  const paths = [
    'src/data/projects.ts',
    'src/pages/projects/cloudplay/index.mdx',
    'src/pages/projects/cloudplay/updates.mdx',
    'blog/2026-11-08-cloudplay-hanh-trinh/index.md',
  ];
  for (const path of paths) {
    const source = await readFile(path, 'utf8');
    expect(source, path).not.toMatch(/[\u2014]/);
    expect(source, path).not.toContain('BranLabs CloudPlay');
    expect(source, path).not.toMatch(/\b(?:192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/);
    expect(source, path).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    expect(source, path).not.toMatch(/-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/);
  }
  const snapshot = await readFile('src/pages/projects/cloudplay/index.mdx', 'utf8');
  expect(snapshot).toContain('Chưa kiểm thử game thực tế');
  expect(snapshot).toContain('FPS của luồng video không phải FPS của game');
  expect(snapshot).toContain('host processing không phải toàn bộ độ trễ');
});
