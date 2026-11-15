import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('analytics is opt-in, preference persists and can be changed', async ({page}) => {
  await page.goto('/');
  const banner = page.getByRole('complementary', {name: 'Lựa chọn thống kê truy cập'});
  // New visitors see no overlay. Analytics remains disabled until an explicit choice.
  await expect(banner).toHaveCount(0);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('techdoors.ga4-consent.v1'))).toBeNull();

  await page.goto('/blog/');
  await expect(banner).toHaveCount(0);
  await page.getByRole('button', {name: 'Tùy chọn thống kê'}).click();
  await expect(banner).toBeVisible();
  await expect(banner.getByRole('link', {name: 'Tìm hiểu thêm'})).toHaveAttribute(
    'href',
    '/privacy/',
  );
  await banner.getByRole('button', {name: 'Không đồng ý'}).click();
  await expect(banner).toHaveCount(0);

  await page.reload();
  await expect(banner).toHaveCount(0);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);

  await page.getByRole('button', {name: 'Tùy chọn thống kê'}).click();
  await expect(banner).toBeVisible();
  await banner.getByRole('button', {name: 'Cho phép thống kê'}).click();
  await expect(banner).toHaveCount(0);

  await page.goto('/blog/');
  await expect(banner).toHaveCount(0);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('techdoors.ga4-consent.v1'))).toBe(
    'accepted',
  );

  await page.getByRole('button', {name: 'Tùy chọn thống kê'}).click();
  await banner.getByRole('button', {name: 'Không đồng ý'}).click();
  await expect(banner).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('techdoors.ga4-consent.v1'))).toBe(
    'rejected',
  );
});

test('privacy page is readable and consent controls are accessible', async ({page}) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', {name: 'Quyền riêng tư', level: 1})).toBeVisible();
  await expect(page.locator('main')).toContainText('Google Analytics 4');
  const banner = page.getByRole('complementary', {name: 'Lựa chọn thống kê truy cập'});
  await expect(banner).toHaveCount(0);
  await page.getByRole('button', {name: 'Tùy chọn thống kê'}).click();
  await expect(banner).toBeVisible();
  const {violations} = await new AxeBuilder({page})
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)}))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
