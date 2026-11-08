import {test, expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const article = '/blog/chao-mung-den-voi-techdoors/';
const routes = [
  '/',
  '/blog/',
  article,
  '/about/',
  '/projects/',
  '/blog/tags/',
  '/blog/tags/devops/',
  '/404.html',
];

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
    await Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
}

test('projects page introduces the real CloudPlay homelab card without placeholders', async ({
  page,
}) => {
  await page.goto('/projects/');
  await settle(page);
  const projects = page.getByRole('region', {name: 'Các dự án'});
  const card = projects.getByRole('article');
  await expect(card).toHaveCount(1);
  await expect(
    card.getByRole('heading', {
      name: 'BranLabs CloudPlay - OpenStack GPU Gaming Lab',
      exact: true,
    }),
  ).toBeVisible();
  await expect(card).toContainText(
    'Xây dựng hệ thống Cloud Gaming trên OpenStack, sử dụng PCI GPU Passthrough',
  );
  await expect(card).toContainText('Windows VM, Sunshine và Moonlight');
  await expect(card).toContainText('1080p60');
  await expect(card).toContainText('OpenStack / KVM / GPU Passthrough / Cloud Gaming');
  await expect(projects).not.toContainText(/placeholder|chưa triển khai|khung nội dung mẫu/i);
});

test('homepage recent articles retain metadata, article links and the blog topic filters', async ({
  page,
}) => {
  for (const mode of ['light', 'dark'] as const) {
    await page.goto('/');
    await settle(page);
    await setTheme(page, mode);
    const recent = page.getByRole('region', {name: 'Bài viết mới', exact: true});
    const heroTitle = await page.locator('#hero-title').boundingBox();
    const recentBox = await recent.boundingBox();
    expect(Math.abs((heroTitle?.x ?? 0) - (recentBox?.x ?? 0))).toBeLessThan(1);
    await expect(page.locator('main > section')).toHaveCount(2);
    await expect(page.getByRole('link', {name: /RSS|Atom/})).toHaveCount(0);
    const footerNav = page.getByRole('navigation', {name: 'Liên kết cuối trang'});
    await expect(page.locator('footer nav')).toHaveCount(1);
    await expect(footerNav.getByRole('link', {name: /GitHub/})).toHaveAttribute(
      'href',
      'https://github.com/branlabs/techdoors-blog',
    );
    const posts = recent.getByRole('article');
    expect(await posts.count()).toBeGreaterThan(0);
    expect(await posts.count()).toBeLessThanOrEqual(5);
    const first = posts.first();
    await expect(first.locator('time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}/);
    await expect(first.getByText(/\d+ phút đọc/)).toBeVisible();
    const title = first.getByRole('heading', {level: 3}).getByRole('link');
    const articleTitle = await title.innerText();
    await title.click();
    await expect(
      page.getByRole('heading', {level: 1, name: articleTitle, exact: true}),
    ).toBeVisible();
    await page.goto('/');
    await settle(page);
    await recent.getByRole('link', {name: 'Xem tất cả', exact: true}).click();
    await expect(page).toHaveURL(/\/blog\/$/);
    await page
      .getByRole('navigation', {name: 'Lọc bài viết theo chủ đề'})
      .getByRole('link', {name: 'DevOps', exact: true})
      .click();
    await expect(page).toHaveURL(/\/blog\/tags\/devops\/$/);
    await expect(
      page.getByRole('link', {name: 'Chào mừng đến với TechDoors', exact: true}),
    ).toBeVisible();
  }
});

for (const mode of ['light', 'dark'] as const) {
  test(`feed navigation stays hidden while XML feeds remain available in ${mode} mode`, async ({
    page,
    request,
  }, testInfo) => {
    await page.goto('/blog/');
    await settle(page);
    await setTheme(page, mode);
    await expect(page.getByRole('link', {name: /RSS|Atom/})).toHaveCount(0);
    for (const format of ['rss', 'atom']) {
      const response = await request.get('/blog/' + format + '.xml');
      expect(response.status()).toBe(200);
      expect(await response.text()).toContain('Chào mừng đến với TechDoors');
    }
    const {violations} = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)})),
    ).toEqual([]);
    await page.screenshot({path: testInfo.outputPath(`blog-${mode}.png`), fullPage: true});
  });
}

test('article landmarks, sticky TOC and touch controls work in both themes', async ({
  page,
  isMobile,
}, testInfo) => {
  for (const mode of ['light', 'dark'] as const) {
    await page.goto(article);
    await settle(page);
    await setTheme(page, mode);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
    ).toBeLessThanOrEqual(1);
    const desktopTOC = page.getByRole('navigation', {name: 'Mục lục bài viết'});
    if (isMobile) {
      await expect(desktopTOC).toBeHidden();
      const toggle = page.locator('.navbar__toggle');
      const target = await toggle.boundingBox();
      expect(target?.width).toBeGreaterThanOrEqual(44);
      expect(target?.height).toBeGreaterThanOrEqual(44);
    } else {
      await expect(desktopTOC).toBeVisible();
      await page.evaluate(() => window.scrollTo({top: 600, behavior: 'instant'}));
      await expect(desktopTOC.getByRole('link').first()).toBeInViewport();
      await desktopTOC.getByRole('link').filter({hasText: 'Những cánh cửa'}).click();
      await expect(page).toHaveURL(/#/);
    }
    const {violations} = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    expect(
      violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)})),
    ).toEqual([]);
    const copy = page.getByRole('button', {name: 'Sao chép mã vào bộ nhớ tạm'});
    await expect(copy).toHaveCSS('opacity', '1');
    if (!isMobile) {
      await page.locator('.theme-code-block').hover();
      await expect(copy).toHaveCSS('opacity', '1');
    }
    const target = await copy.boundingBox();
    expect(target?.width).toBeGreaterThanOrEqual(44);
    expect(target?.height).toBeGreaterThanOrEqual(44);
    await page.evaluate(() => window.scrollTo({top: 0, behavior: 'instant'}));
    await page.screenshot({path: testInfo.outputPath(`article-${mode}.png`), fullPage: true});
  }
});

test('all public flows render without console errors or horizontal overflow', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await settle(page);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('footer a[href$="rss.xml"], footer a[href$="atom.xml"]')).toHaveCount(
      0,
    );
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `horizontal overflow at ${route}`).toBeLessThanOrEqual(1);
    const {violations} = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)})),
      `accessibility at ${route}`,
    ).toEqual([]);
    if (['/about/', '/projects/', '/blog/', '/blog/tags/'].includes(route))
      await page.screenshot({
        path: testInfo.outputPath(route.replaceAll('/', '') + '.png'),
        fullPage: true,
      });
  }
  await page.goto('/');
  await settle(page);
  await page.screenshot({path: testInfo.outputPath('home-light.png'), fullPage: true});
  expect(errors).toEqual([]);
});

test('light/dark preference persists and mobile navigation works', async ({
  page,
  isMobile,
}, testInfo) => {
  await page.goto('/');
  await settle(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  if (isMobile) await page.locator('.navbar__toggle').click();
  await page
    .getByRole('button', {name: /Chuyển đổi chế độ sáng và tối/})
    .filter({visible: true})
    .click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  if (isMobile) await page.locator('.navbar-sidebar__close').click();
  await page.reload();
  await settle(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const {violations} = await new AxeBuilder({page})
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)})),
  ).toEqual([]);
  await page.screenshot({path: testInfo.outputPath('home-dark.png'), fullPage: true});
  if (isMobile) {
    await page.locator('.navbar__toggle').click();
    await page.locator('.navbar-sidebar').getByRole('link', {name: 'Dự án', exact: true}).click();
    await expect(page).toHaveURL(/\/projects\/$/);
    await expect(page.locator('h1')).toHaveText('Nơi ý tưởng được thử.');
  }
});

test('Vietnamese local search opens a real article without external requests', async ({page}) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on('request', (request) => {
    if (/^https?:/.test(request.url()) && !request.url().startsWith('http://127.0.0.1:3000'))
      external.push(request.url());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await settle(page);
  const trigger = page.getByRole('button', {name: 'Tìm kiếm trên TechDoors'});
  const previousFocus = page.getByRole('link', {name: 'Khám phá bài viết', exact: true});
  await previousFocus.focus();
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', {name: 'Tìm trong TechDoors'});
  await expect(dialog).toBeVisible();
  const search = dialog.getByRole('searchbox', {name: 'Từ khóa'});
  await expect(search).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(previousFocus).toBeFocused();
  await trigger.click();
  await search.fill('Chào mừng');
  const result = dialog.locator('a[href="' + article + '"]');
  await expect(result).toBeVisible();
  const {violations} = await new AxeBuilder({page})
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)})),
  ).toEqual([]);
  await search.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await search.fill('Chào mừng');
  await expect(result).toBeVisible();
  const resultIndex = await dialog
    .getByRole('link')
    .evaluateAll(
      (links, path) => links.findIndex((link) => link.getAttribute('href') === path),
      article,
    );
  expect(resultIndex).toBeGreaterThanOrEqual(0);
  await search.press('ArrowDown');
  for (let index = 0; index < resultIndex; index++) await page.keyboard.press('ArrowDown');
  await expect(result).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(article));
  await expect(page.locator('h1')).toHaveText('Chào mừng đến với TechDoors');
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('Markdown, syntax highlighting, code copy, TOC and related navigation', async ({
  page,
  context,
  isMobile,
}, testInfo) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(article);
  await settle(page);
  await expect(page.locator('.theme-code-block code')).toContainText('free -h');
  expect(await page.locator('.theme-code-block .token').count()).toBeGreaterThan(0);
  await page.getByRole('button', {name: 'Sao chép mã vào bộ nhớ tạm'}).press('Enter');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('free -h');
  if (isMobile) await page.getByRole('button', {name: 'Trên trang này'}).click();
  const toc = page
    .locator('.table-of-contents a')
    .filter({hasText: 'Những cánh cửa'})
    .filter({visible: true});
  await toc.click();
  await expect(page).toHaveURL(/#/);
  await expect(page.getByRole('heading', {name: 'Tiếp tục khám phá'})).toBeVisible();
  await page.evaluate(() => window.scrollTo({top: 0, behavior: 'instant'}));
  await page.screenshot({path: testInfo.outputPath('article.png'), fullPage: true});
  await page.getByRole('link', {name: 'Về TechDoors', exact: true}).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByText('[Tên hoặc biệt danh của bạn]', {exact: true})).toBeVisible();
});

test('keyboard skip link and custom 404 recovery', async ({page}) => {
  await page.goto('/');
  await settle(page);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name: 'Chuyển tới nội dung chính'})).toBeFocused();
  await page.keyboard.press('Enter');
  await page.goto('/duong-dan-khong-ton-tai/');
  await settle(page);
  await expect(page.locator('h1')).toHaveText('Có vẻ bạn đã đi lạc.');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await page.getByRole('link', {name: 'Về trang chủ'}).click();
  await expect(page).toHaveURL('http://127.0.0.1:3000/');
});
