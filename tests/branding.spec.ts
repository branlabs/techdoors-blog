import {readFile} from 'node:fs/promises';
import {test, expect} from '@playwright/test';

test('tab uses TechDoors as its concise title and the high-contrast door favicon', async ({page, request}) => {
  await page.goto('/');
  await expect(page).toHaveTitle('TechDoors');

  const icon = page.locator('head link[rel="icon"]');
  await expect(icon).toHaveAttribute('href', '/img/favicon-door.svg');

  const response = await request.get('/img/favicon-door.svg');
  expect(response.ok()).toBeTruthy();
  const svg = await response.text();
  expect(svg).toContain('viewBox="0 0 64 64"');
  expect(svg).toContain('fill="#ad4228"');
  expect(svg).toContain('fill="#f6f5f0"');
});

test('public README introduces the blog and links to the current first article', async () => {
  const readme = await readFile('README.md', 'utf8');
  expect(readme).toContain('Brandon');
  expect(readme).toContain('https://techdoors.io/blog/the-invisible-computer/');
  expect(readme).toContain('docs/deployment.md');
  expect(readme).not.toContain('Tiểu sử chờ nội dung');
  expect(readme).not.toContain('Khung dự án chờ nội dung');
});
