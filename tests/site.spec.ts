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
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', {name: 'Tìm trong TechDoors'});
  await expect(dialog).toBeVisible();
  const search = dialog.getByRole('searchbox', {name: 'Từ khóa'});
  await expect(search).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await trigger.click();
  await search.fill('Chào mừng');
  const result = dialog.getByRole('link').filter({hasText: 'Chào mừng đến với TechDoors'}).first();
  await expect(result).toBeVisible();
  const {violations} = await new AxeBuilder({page})
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)})),
  ).toEqual([]);
  await search.press('Escape');
  await expect(dialog).not.toBeVisible();
  await trigger.click();
  await search.fill('Chào mừng');
  await expect(result).toBeVisible();
  await search.press('ArrowDown');
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
  await page.getByRole('button', {name: 'Sao chép mã vào bộ nhớ tạm'}).click();
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
