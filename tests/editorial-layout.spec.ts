import {test, expect, type Page} from '@playwright/test';

const pages = [
  {route: '/blog/', title: 'Những điều được ghi lại.', maxContentWidth: 700},
  {route: '/projects/', title: 'Nơi ý tưởng được thử.', maxContentWidth: 760},
  {route: '/about/', title: 'Một chút về mình', maxContentWidth: 670},
] as const;

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
  test(`editorial pages share a consistent reading grid in ${mode} mode`, async ({page}, testInfo) => {
    test.setTimeout(90_000);
    let alignedLeft: number | undefined;
    let headingFontSize: number | undefined;

    for (const {route, title, maxContentWidth} of pages) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);
      await setTheme(page, mode);

      const shell = page.locator('main[data-editorial-shell]');
      const header = shell.locator('header[data-editorial-header]');
      const heading = header.getByRole('heading', {level: 1, name: title});
      const content = shell.locator('[data-editorial-content]');
      await expect(shell).toHaveCount(1);
      await expect(heading).toBeVisible();
      await expect(content).toBeVisible();

      const [shellBox, headingBox, contentBox] = await Promise.all([
        shell.boundingBox(),
        heading.boundingBox(),
        content.boundingBox(),
      ]);
      expect(shellBox!.width).toBeLessThanOrEqual(1121);
      expect(contentBox!.width).toBeLessThanOrEqual(maxContentWidth + 1);
      expect(Math.abs(headingBox!.x - contentBox!.x)).toBeLessThanOrEqual(1.5);

      const fontSize = await heading.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      if (alignedLeft !== undefined) {
        expect(Math.abs(headingBox!.x - alignedLeft)).toBeLessThanOrEqual(1.5);
        expect(Math.abs(fontSize - headingFontSize!)).toBeLessThanOrEqual(0.1);
      }
      alignedLeft = headingBox!.x;
      headingFontSize = fontSize;

      if (route === '/about/') {
        const story = content.locator('p');
        await expect(story).toHaveCount(5);
        const bodyColorMatchesHeading = await story.first().evaluate(
          (el) =>
            getComputedStyle(el).color ===
            getComputedStyle(document.querySelector('[data-editorial-header] h1')!).color,
        );
        expect(bodyColorMatchesHeading).toBe(true);
        const lineHeightRatio = await story.first().evaluate((el) => {
          const style = getComputedStyle(el);
          return parseFloat(style.lineHeight) / parseFloat(style.fontSize);
        });
        expect(lineHeightRatio).toBeGreaterThan(1.75);
        expect(lineHeightRatio).toBeLessThan(1.9);
      }

      if (route === '/projects/') {
        const card = content.getByRole('article');
        await expect(card.getByRole('link')).toHaveCount(0);
        await expect(card).toContainText('Đang hoàn thiện nội dung');
        const tagSize = await card.getByRole('listitem').first().evaluate(
          (el) => parseFloat(getComputedStyle(el).fontSize),
        );
        expect(tagSize).toBeGreaterThanOrEqual(11.5);
      }

      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
      ).toBeLessThanOrEqual(1);

      await page.screenshot({
        path: testInfo.outputPath(`editorial-${route.replaceAll('/', '')}-${mode}.png`),
        fullPage: true,
      });
    }
  });
}
