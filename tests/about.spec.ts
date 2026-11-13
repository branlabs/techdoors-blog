import {test, expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
  test(`about page reads like a personal note in ${mode} mode`, async ({page}, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await setTheme(page, mode);

    const main = page.locator('main');
    await expect(main.getByRole('heading', {level: 1})).toHaveText('Một chút về mình');
    await expect(main.getByRole('heading')).toHaveCount(1);
    await expect(main).toContainText('Mình là Brandon.');
    await expect(main).toContainText('TechDoors bắt đầu từ những lần như vậy.');
    await expect(main).toContainText('Không phải lúc nào cũng có một câu trả lời hoàn chỉnh');
    await expect(main.locator('aside')).toHaveCount(0);
    await expect(main).not.toContainText('CÁC CHỦ ĐỀ ĐANG MỞ');

    const story = main.locator('div').filter({hasText: 'Mình là Brandon.'}).last();
    await expect(story.locator('p')).toHaveCount(5);
    await expect(story.getByRole('link', {name: 'Chiếc máy tính vô hình'})).toHaveAttribute(
      'href',
      '/blog/the-invisible-computer/',
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);

    const {violations} = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)}))).toEqual([]);
    expect(errors).toEqual([]);

    const screenshot = await main.screenshot({path: testInfo.outputPath(`about-${mode}.png`)});
    await testInfo.attach(`about-${mode}`, {body: screenshot, contentType: 'image/png'});
  });
}
