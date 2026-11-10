import {test, expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const cloudplayTitle = 'CloudPlay: từ 15 FPS đến 60 FPS trên OpenStack';
const cloudplayDescription =
  'Tận dụng GPU trong server để thử cloud gaming. Hành trình từ các phiên stream khoảng 15 FPS đến 1080p60 trong LAN, trước khi thử game.';
const welcomeDescription =
  'Một vài lời giới thiệu về TechDoors và những chủ đề mình muốn chia sẻ.';
const cloudplayUrl = '/blog/cloudplay-tu-card-trong-server-den-stream-60fps/';

async function setTheme(page: Page, mode: 'light' | 'dark') {
  if ((await page.locator('html').getAttribute('data-theme')) === mode) return;
  const toggle = page.getByRole('button', {name: /Chuyển đổi chế độ sáng và tối/});
  if (!(await toggle.filter({visible: true}).count())) {
    await page.locator('.navbar__toggle').click();
  }
  await toggle.filter({visible: true}).click();
  const close = page.locator('.navbar-sidebar__close');
  if (await close.isVisible()) await close.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', mode);
}

for (const mode of ['light', 'dark'] as const) {
  test(`recent articles remain concise and readable in ${mode} mode`, async ({page}, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await setTheme(page, mode);

    const recent = page.getByRole('region', {name: 'Bài viết mới', exact: true});
    const posts = recent.getByRole('article');
    await expect(posts).toHaveCount(2);
    const cloudplay = posts.first();
    const title = cloudplay.getByRole('heading', {level: 3}).getByRole('link');
    await expect(title).toHaveText(cloudplayTitle);
    await expect(title).toHaveAttribute('href', cloudplayUrl);
    await expect(cloudplay.getByText(cloudplayDescription, {exact: true})).toBeVisible();
    await expect(cloudplay.locator('time')).toHaveAttribute('datetime', /^2026-11-08/);

    const welcome = posts.nth(1);
    await expect(
      welcome.getByRole('heading', {level: 3, name: 'Chào mừng đến với TechDoors'}),
    ).toBeVisible();
    await expect(welcome.getByText(welcomeDescription, {exact: true})).toBeVisible();

    for (const post of [cloudplay, welcome]) {
      const description = await post.locator('p').last().innerText();
      expect(description.length).toBeLessThanOrEqual(140);
    }

    // Tighten spacing while preserving the existing font size and one-column layout.
    await expect(cloudplay).toHaveCSS('padding-top', '26px');
    await expect(cloudplay).toHaveCSS('padding-bottom', '26px');
    await expect(welcome).toHaveCSS('padding-bottom', '0px');
    await expect(recent.getByRole('link', {name: 'Xem tất cả'})).toHaveAttribute('href', '/blog/');

    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const {violations} = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)}))).toEqual([]);
    expect(errors).toEqual([]);

    const screenshot = await recent.screenshot({
      path: testInfo.outputPath(`recent-articles-${mode}.png`),
    });
    await testInfo.attach(`recent-articles-${mode}`, {
      body: screenshot,
      contentType: 'image/png',
    });

    await title.click();
    await expect(page).toHaveURL(new RegExp(cloudplayUrl + '$'));
    await expect(page.getByRole('heading', {level: 1})).toHaveText(cloudplayTitle);
  });
}
