import {test, expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function settle(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
}

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
  test(`living SVG portal is a subtle accessible interaction in ${mode}`, async ({
    page,
    isMobile,
  }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.goto('/');
    await settle(page);
    await setTheme(page, mode);
    const hero = page.locator('main > section[aria-labelledby="hero-title"]');
    const portal = hero.locator('[data-door-state]');
    const artwork = portal.locator('[aria-hidden="true"] svg');
    const door = artwork.getByTestId('portal-door-leaf');
    const control = portal.locator('button[aria-pressed]');

    await expect(portal).toHaveAttribute('data-door-state', 'rest');
    await expect(door).toBeVisible();
    await expect(door.locator('path').first()).toHaveAttribute(
      'd',
      'm166 114 90 28v218l-90-32Z',
    );
    await expect(control).toHaveAttribute('aria-label', 'Mở cánh cửa minh họa');
    await expect(control).toHaveAttribute('aria-pressed', 'false');
    await expect(hero.getByRole('link', {name: 'Gõ cửa'})).toBeVisible();
    expect((await control.boundingBox())!.width).toBeGreaterThanOrEqual(44);
    expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);

    await portal.screenshot({
      path: testInfo.outputPath(`portal-${mode}-rest.png`),
    });

    if (!isMobile) {
      await control.hover();
      await expect(portal).toHaveAttribute('data-door-state', 'peek');
      await page.mouse.move(1, 1);
      await expect(portal).toHaveAttribute('data-door-state', 'rest');
    }

    await control.click();
    await expect(portal).toHaveAttribute('data-door-state', 'open');
    const close = portal.getByRole('button', {name: 'Khép cánh cửa minh họa'});
    await expect(close).toHaveAttribute('aria-pressed', 'true');
    // Wait for the leaf's known final transform rather than unrelated page animations.
    await expect(door).toHaveCSS(
      'transform',
      'matrix(0.68, 0.17, 0, 1, 53.12, -28.22)',
    );
    await portal.screenshot({
      path: testInfo.outputPath(`portal-${mode}-open.png`),
    });

    await close.click();
    await expect(portal).toHaveAttribute('data-door-state', 'rest');
    await control.focus();
    await expect(control).toBeFocused();
    await control.press('Enter');
    await expect(portal).toHaveAttribute('data-door-state', 'open');
    await control.press('Escape');
    await expect(portal).toHaveAttribute('data-door-state', 'rest');
    await control.press('Space');
    await expect(portal).toHaveAttribute('data-door-state', 'open');
    await control.press('Space');
    await expect(portal).toHaveAttribute('data-door-state', 'rest');

    const {violations} = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => node.target),
    }))).toEqual([]);
    expect(await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('living portal honors reduced-motion preferences', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('/');
  await settle(page);
  const portal = page.locator('main > section[aria-labelledby="hero-title"] [data-door-state]');
  const door = portal.getByTestId('portal-door-leaf');
  await portal.getByRole('button', {name: 'Mở cánh cửa minh họa'}).click();
  await expect(portal).toHaveAttribute('data-door-state', 'open');
  // Docusaurus may clamp reduced-motion transitions to 0.01ms instead of 0ms.
  const seconds = await door.evaluate(
    (element) => parseFloat(getComputedStyle(element).transitionDuration),
  );
  expect(seconds).toBeLessThanOrEqual(0.001);
});
