import {readFile} from 'node:fs/promises';
import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('TechDoors has no GA4 consent banner and links to Umami privacy details', async ({page}) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('complementary', {name: 'Lựa chọn thống kê truy cập'})).toHaveCount(0);
  await expect(page.getByRole('button', {name: 'Tùy chọn thống kê'})).toHaveCount(0);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  await expect(page.locator('script[src*="google-analytics.com"]')).toHaveCount(0);

  // CI builds without a Website ID intentionally emit no tracker at all.
  const umamiTracker = page.locator('script[src="https://cloud.umami.is/script.js"]');
  if (process.env.UMAMI_WEBSITE_ID) {
    await expect(umamiTracker).toHaveAttribute('data-website-id', process.env.UMAMI_WEBSITE_ID);
    await expect(umamiTracker).toHaveAttribute('data-domains', 'techdoors.io,www.techdoors.io');
  } else {
    await expect(umamiTracker).toHaveCount(0);
  }

  const privacy = page.locator('footer').getByRole('link', {name: 'Quyền riêng tư'});
  await expect(privacy).toHaveAttribute('href', '/privacy/');
  await privacy.click();
  await expect(page.getByRole('heading', {level: 1, name: 'Quyền riêng tư'})).toBeVisible();
  await expect(page.locator('main')).toContainText('Umami Cloud');
  await expect(page.locator('main')).toContainText('không dùng cookie');
  await expect(page.locator('main')).not.toContainText('Google Analytics');

  const {violations} = await new AxeBuilder({page})
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(violations.map((v) => ({id: v.id, nodes: v.nodes.map((n) => n.target)}))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('build is wired to an Umami website ID and avoids duplicate SPA tracking', async () => {
  const [config, deploy, doc] = await Promise.all([
    readFile('docusaurus.config.ts', 'utf8'),
    readFile('.github/workflows/deploy.yml', 'utf8'),
    readFile('docs/analytics.md', 'utf8'),
  ]);
  expect(config).toContain('UMAMI_WEBSITE_ID');
  expect(config).toContain('https://cloud.umami.is/script.js');
  expect(config).toContain("'data-domains': 'techdoors.io,www.techdoors.io'");
  expect(config).toContain("'data-do-not-track': 'true'");
  expect(config).not.toContain('googletagmanager.com');
  expect(config).not.toContain('G-THZSCXZY06');
  expect(deploy).toContain('UMAMI_WEBSITE_ID: ${{ vars.UMAMI_WEBSITE_ID }}');
  expect(doc).toContain('Umami Cloud');
});
