import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const mode of ['light', 'dark'] as const) {
  test(`compact footer remains readable and aligned in ${mode} mode`, async ({page}, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);

    const theme = page.locator('html');
    if ((await theme.getAttribute('data-theme')) !== mode) {
      const toggle = page.getByRole('button', {name: /Chuyển đổi chế độ sáng và tối/});
      if (!(await toggle.filter({visible: true}).count())) {
        await page.locator('.navbar__toggle').click();
      }
      await toggle.filter({visible: true}).click();
      const close = page.locator('.navbar-sidebar__close');
      if (await close.isVisible()) await close.click();
      await expect(theme).toHaveAttribute('data-theme', mode);
    }

    const footer = page.locator('footer');
    const nav = footer.getByRole('navigation', {name: 'Liên kết cuối trang'});
    await expect(footer.getByRole('link', {name: 'TechDoors', exact: true})).toBeVisible();
    await expect(footer.getByText('Ghi chép về hạ tầng.', {exact: true})).toBeVisible();
    await expect(nav.getByRole('link')).toHaveCount(4);
    for (const name of ['Bài viết', 'Dự án', 'Giới thiệu']) {
      await expect(nav.getByRole('link', {name, exact: true})).toBeVisible();
    }
    await expect(nav.getByRole('link', {name: /GitHub/})).toHaveAttribute(
      'href', 'https://github.com/branlabs/techdoors-blog',
    );
    await expect(nav.getByRole('link', {name: /GitHub/})).toHaveAttribute('target', '_blank');
    await expect(footer).not.toContainText('Mở thêm một cánh cửa.');
    await expect(footer).not.toContainText('Được viết bằng sự tò mò.');
    await expect(footer).not.toContainText('Được xây với Docusaurus.');
    await expect(nav).not.toContainText('Chủ đề');
    await expect(footer).not.toContainText(/RSS|Atom/);
    await expect(footer.getByText('Keep opening doors.', {exact: true})).toBeVisible();
    await expect(footer).toContainText(/© \d{4} TechDoors/);

    const size = await footer.boundingBox();
    expect(size).not.toBeNull();
    const isNarrow = testInfo.project.name === 'mobile' || testInfo.project.name === 'narrow-mobile';
    expect(size!.height).toBeLessThanOrEqual(isNarrow ? 280 : 215);

    if (!isNarrow) {
      const brandTop = (await footer.getByRole('link', {name: 'TechDoors', exact: true}).boundingBox())!.y;
      const navTop = (await nav.boundingBox())!.y;
      expect(Math.abs(brandTop - navTop)).toBeLessThanOrEqual(8);
    }

    if (testInfo.project.name === 'narrow-mobile') {
      const linkBoxes = await Promise.all(
        (await nav.getByRole('link').all()).map((link) => link.boundingBox()),
      );
      const linkTopEdges = linkBoxes.map((box) => box!.y);
      // Four navigation items should share one row at 320px.
      expect(Math.max(...linkTopEdges) - Math.min(...linkTopEdges)).toBeLessThanOrEqual(4);
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    const {violations} = await new AxeBuilder({page})
      .include('footer')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations.map((item) => ({id: item.id, nodes: item.nodes.map((node) => node.target)}))).toEqual([]);
    expect(errors).toEqual([]);

    const screenshot = await footer.screenshot({path: testInfo.outputPath(`footer-${mode}.png`)});
    await testInfo.attach(`footer-${mode}`, {body: screenshot, contentType: 'image/png'});
  });
}
