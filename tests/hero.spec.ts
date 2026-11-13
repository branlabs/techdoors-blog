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
  test(`homepage hero has one message and CTA in ${mode} mode`, async ({page}, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await setTheme(page, mode);

    const hero = page.locator('main > section[aria-labelledby="hero-title"]');
    await expect(hero).toBeVisible();
    await expect(hero.getByRole('heading', {level: 1})).toHaveText(
      /Mở cửa vào\s+thế giới hạ tầng\./,
    );
    await expect(hero.getByText(
      'Ghi chép về những hệ thống mình xây dựng, vận hành và học hỏi.',
      {exact: true},
    )).toBeVisible();
    await expect(hero.getByRole('link')).toHaveCount(1);
    await expect(hero.getByRole('link', {name: 'Gõ cửa'})).toHaveAttribute(
      'href', '/blog/',
    );
    await expect(hero.getByText('BLOG KỸ THUẬT CÁ NHÂN')).toHaveCount(0);
    await expect(hero.getByText('Về TechDoors')).toHaveCount(0);
    await expect(hero.getByText('Học. Thử. Hiểu. Chia sẻ.')).toHaveCount(0);
    await expect(hero.getByText('Một cánh cửa. Nhiều điều để khám phá.')).toHaveCount(0);

    const illustration = hero.locator('div[aria-hidden="true"] svg').first();
    await expect(illustration).toBeVisible();
    await expect(illustration.locator('path')).not.toHaveCount(0);

    const cta = hero.getByRole('link', {name: 'Gõ cửa'});
    const ctaBox = await cta.boundingBox();
    expect(ctaBox!.height).toBeGreaterThanOrEqual(44);
    const pageOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(pageOverflow).toBeLessThanOrEqual(1);

    const {violations} = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze();
    expect(
      violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)})),
    ).toEqual([]);
    expect(errors).toEqual([]);

    await page.screenshot({path: testInfo.outputPath(`homepage-hero-${mode}.png`), fullPage: true});
  });
}
