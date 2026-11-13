import {test, expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const article = '/blog/the-invisible-computer/';

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
  test(`article header has a compact byline in ${mode} mode`, async ({page}, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(article);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await setTheme(page, mode);

    const header = page.locator('.blog-post-page article header').first();
    await expect(header.getByRole('heading', {level: 1})).toHaveText('Chiếc máy tính vô hình');
    const byline = header.getByTestId('article-byline');
    await expect(byline).toBeVisible();
    const author = byline.getByRole('link', {name: 'Brandon'});
    await expect(author).toHaveAttribute('href', '/about/');
    await expect(byline.locator('time')).toHaveText('13.11.2026');
    await expect(byline.locator('time')).toHaveAttribute('datetime', /^2026-11-13/);
    await expect(byline.getByTestId('article-reading-time')).toHaveText(/^\d+ phút đọc$/);
    await expect(header.locator('img')).toHaveCount(0);
    await expect(header).not.toContainText('Người viết tại TechDoors');
    const bylineBox = await byline.boundingBox();
    expect(bylineBox?.height).toBeLessThanOrEqual(52);

    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
    const {violations} = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)}))).toEqual([]);
    expect(errors).toEqual([]);

    const screenshot = await header.screenshot({path: testInfo.outputPath(`article-header-${mode}.png`)});
    await testInfo.attach(`article-header-${mode}`, {body: screenshot, contentType: 'image/png'});
    await author.click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.getByRole('heading', {level: 1})).toHaveText('Một chút về mình');
  });
}
