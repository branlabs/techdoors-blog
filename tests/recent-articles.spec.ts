import {test, expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const articleUrl = '/blog/chiec-may-tinh-vo-hinh/';
const articleTitle = 'Chiếc máy tính vô hình';

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
  test(`recent articles show only public posts in ${mode} mode`, async ({page}, testInfo) => {
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
    await expect(posts).toHaveCount(1);
    const story = posts.first();
    const title = story.getByRole('heading', {level: 3}).getByRole('link');
    await expect(title).toHaveText(articleTitle);
    await expect(title).toHaveAttribute('href', articleUrl);
    await expect(story.locator('time')).toHaveAttribute('datetime', /^2026-11-13/);

    const description = await story.locator('p').last().innerText();
    expect(description.length).toBeLessThanOrEqual(140);
    await expect(story).toHaveCSS('padding-top', '26px');
    await expect(story).toHaveCSS('padding-bottom', '0px');
    await expect(recent.getByRole('link', {name: 'Xem tất cả'})).toHaveAttribute('href', '/blog/');
    await expect(recent.locator('a[href*="chao-mung-den-voi-techdoors"]')).toHaveCount(0);
    await expect(recent.locator('a[href*="cloudplay-tu-card"]')).toHaveCount(0);

    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const {violations} = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)}))).toEqual([]);
    expect(errors).toEqual([]);
    const screenshot = await recent.screenshot({path: testInfo.outputPath(`recent-articles-${mode}.png`)});
    await testInfo.attach(`recent-articles-${mode}`, {body: screenshot, contentType: 'image/png'});

    await title.click();
    await expect(page).toHaveURL(new RegExp(articleUrl + '$'));
    await expect(page.getByRole('heading', {level: 1})).toHaveText(articleTitle);
  });
}
