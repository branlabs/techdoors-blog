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
  test('blog index foregrounds the story in ' + mode + ' mode', async ({page}, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto('/blog/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await setTheme(page, mode);

    const main = page.locator('main');
    await expect(main.getByRole('heading', {level: 1})).toHaveText('Những điều được ghi lại.');
    const intro = main.locator('header p').last();
    await expect(intro).toHaveText(
      'Ghi chép về hạ tầng, thử nghiệm và những điều mình muốn hiểu rõ hơn.',
    );
    await expect(main.getByRole('navigation', {name: 'Lọc bài viết theo chủ đề'})).toHaveCount(0);

    const cards = main.getByRole('region', {name: 'Danh sách bài viết'}).getByRole('article');
    await expect(cards).toHaveCount(1);
    const card = cards.first();
    await expect(card.getByRole('heading', {level: 2})).toHaveText('Chiếc máy tính vô hình');
    await expect(card.getByRole('link', {name: 'Chiếc máy tính vô hình'}))
      .toHaveAttribute('href', '/blog/the-invisible-computer/');
    await expect(card.locator('time')).toHaveText('13.11.2026');
    await expect(card.locator('time')).toHaveAttribute('datetime', /^2026-11-13/);
    await expect(card).toContainText('Under the Hood');
    await expect(card).toContainText(/\d+ phút đọc/);
    await expect(card.locator('a[href*="/blog/tags/"]')).toHaveCount(0);
    await expect(card).not.toContainText('Virtualization');
    await expect(card).not.toContainText('Infrastructure');
    await expect(card).not.toContainText('01');

    const introBox = await intro.boundingBox();
    const cardBox = await card.boundingBox();
    expect(introBox).not.toBeNull();
    expect(cardBox).not.toBeNull();
    const gap = cardBox!.y - (introBox!.y + introBox!.height);
    expect(gap).toBeGreaterThanOrEqual(24);
    expect(gap).toBeLessThanOrEqual(85);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
      .toBeLessThanOrEqual(1);

    const {violations} = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations.map(({id, nodes}) => ({id, nodes: nodes.map(({target}) => target)})))
      .toEqual([]);
    expect(errors).toEqual([]);
    const screenshot = await main.screenshot({path: testInfo.outputPath('blog-index-' + mode + '.png')});
    await testInfo.attach('blog-index-' + mode, {body: screenshot, contentType: 'image/png'});

    await card.getByRole('link', {name: 'Chiếc máy tính vô hình'}).click();
    await expect(page).toHaveURL(/\/blog\/the-invisible-computer\/$/);
  });
}
