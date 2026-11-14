import {test, expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const vi = '/blog/the-invisible-computer/';
const en = '/en/blog/the-invisible-computer/';
const origin = 'https://techdoors.io';

async function setTheme(page: Page, theme: 'light' | 'dark') {
  if ((await page.locator('html').getAttribute('data-theme')) === theme) return;
  const toggle = page.getByRole('button', {name: /Chuyển đổi chế độ sáng và tối/});
  if (!(await toggle.filter({visible: true}).count())) {
    await page.locator('.navbar__toggle').click();
  }
  await toggle.filter({visible: true}).click();
  const close = page.locator('.navbar-sidebar__close');
  if (await close.isVisible()) await close.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

for (const theme of ['light', 'dark'] as const) {
  test('reader switches between the original and English article in ' + theme, async ({page}, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.goto(vi);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await setTheme(page, theme);

    const viSwitch = page.getByRole('navigation', {name: 'Ngôn ngữ bài viết'});
    await expect(viSwitch.getByRole('link', {name: 'VI'})).toHaveAttribute('aria-current', 'page');
    await expect(viSwitch.getByRole('link', {name: 'EN'})).toHaveAttribute('href', en);
    await expect(page.locator('link[rel="alternate"][hreflang="en-US"]'))
      .toHaveAttribute('href', origin + en);
    await viSwitch.getByRole('link', {name: 'EN'}).click();
    await expect(page).toHaveURL(new RegExp(en + '$'));

    await expect(page.locator('html')).toHaveAttribute('lang', /^en/);
    await expect(page.getByRole('heading', {level: 1})).toHaveText('The Invisible Computer');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', origin + en);
    await expect(page.locator('link[rel="alternate"][hreflang="vi-VN"]'))
      .toHaveAttribute('href', origin + vi);
    await expect(page.locator('link[rel="alternate"][hreflang="en-US"]'))
      .toHaveAttribute('href', origin + en);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
    const enSwitch = page.getByRole('navigation', {name: 'Article language'});
    await expect(enSwitch.getByRole('link', {name: 'EN'})).toHaveAttribute('aria-current', 'page');
    await expect(enSwitch.getByRole('link', {name: 'VI'})).toHaveAttribute('href', vi);
    await expect(page.getByTestId('article-byline')).toContainText('min read');
    await expect(page.locator('.markdown')).toContainText('Imagine two people speaking different languages.');
    await expect(page.locator('.markdown')).toContainText('With QEMU and KVM working together');
    await expect(page.locator('.markdown')).toContainText('Perhaps the story isn');
    await expect(page.locator('.markdown')).not.toContainText('QEMY');
    await expect(page.locator('.markdown')).not.toContainText('With the coordination');
    const images = page.locator('.markdown img');
    await expect(images).toHaveCount(2);
    for (const img of await images.all()) {
      await expect(img).toHaveAttribute('alt', /.+/);
      await expect.poll(() => img.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0))
        .toBe(true);
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
      .toBeLessThanOrEqual(1);
    const {violations} = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations.map(({id, nodes}) => ({id, targets: nodes.map(({target}) => target)})))
      .toEqual([]);
    expect(errors).toEqual([]);

    const header = page.locator('.blog-post-page article header').first();
    const screenshot = await header.screenshot({path: testInfo.outputPath('article-switch-' + theme + '.png')});
    await testInfo.attach('article-switch-' + theme, {body: screenshot, contentType: 'image/png'});

    await enSwitch.getByRole('link', {name: 'VI'}).click();
    await expect(page).toHaveURL(new RegExp(vi + '$'));
    await expect(page.locator('html')).toHaveAttribute('lang', /^vi/);
    await expect(page.getByRole('heading', {level: 1})).toHaveText('Chiếc máy tính vô hình');
  });
}

test('English blog listing and feeds contain only the published translation', async ({page, request}) => {
  await page.goto('/en/blog/');
  await expect(page.locator('html')).toHaveAttribute('lang', /^en/);
  await expect(page.getByRole('heading', {level: 1})).toHaveText('Notes from the inside.');
  const posts = page.getByRole('region', {name: 'Articles'}).getByRole('article');
  await expect(posts).toHaveCount(1);
  await expect(posts.first()).toContainText('Under the Hood');
  await expect(posts.first().getByRole('link', {name: 'The Invisible Computer'})).toHaveAttribute('href', en);

  for (const feed of ['rss.xml', 'atom.xml']) {
    const response = await request.get('/en/blog/' + feed);
    expect(response.status()).toBe(200);
    const xml = await response.text();
    expect(xml).toContain('The Invisible Computer');
    expect(xml).not.toContain('Chiếc máy tính vô hình');
  }
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain(origin + vi);
  expect(xml).toContain(origin + en);
});
