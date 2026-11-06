import {chromium} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const font = async (subset) =>
  (
    await readFile(
      new URL(
        `../node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-${subset}-600-normal.woff2`,
        import.meta.url,
      ),
    )
  ).toString('base64');
const [latin, vietnamese] = await Promise.all([font('latin'), font('vietnamese')]);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport: {width: 1200, height: 630}, deviceScaleFactor: 1});
  await page.setContent(`<!doctype html><html lang="vi"><meta charset="utf-8"><style>
    @font-face{font-family:Brand;src:url(data:font/woff2;base64,${latin})} @font-face{font-family:Brand;src:url(data:font/woff2;base64,${vietnamese});unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB}
    *{box-sizing:border-box} body{margin:0;background:#f6f5f0;color:#262923;font-family:Brand,sans-serif;padding:60px 72px} header{font-size:30px;letter-spacing:-2px;display:flex;align-items:center;gap:14px} .rule{height:1px;background:#d8dad0;margin:28px 0 45px} h1{font-size:68px;line-height:1.27;letter-spacing:-4px;margin:0;max-width:800px} h1 span{color:#ad4228} p{font:18px monospace;color:#62665c;margin-top:30px} .url{position:absolute;bottom:43px;left:72px;font:18px monospace} .door{position:absolute;right:75px;top:235px}
    </style><header><svg width="29" height="34" viewBox="0 0 28 32"><path d="M4 29V3h19v26" stroke="#ad4228" stroke-width="2.5" fill="none"/><path d="m7 6 12 4v20L7 26Z" fill="#ad4228"/></svg>TechDoors</header><div class="rule"></div><h1>Mở cửa vào<br>thế giới <span>hạ tầng.</span></h1><p>DevOps · SRE · Kubernetes · Platform Engineering</p><svg class="door" width="150" height="230" viewBox="0 0 150 230"><path d="M12 210V12h125v198" stroke="#262923" stroke-width="2" fill="none"/><path d="m24 25 78 24v173l-78-23Z" fill="#ad4228"/><path d="M87 127v18" stroke="#fff" stroke-width="3"/></svg><span class="url">techdoors.io / Ghi chép kỹ thuật cá nhân</span></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: fileURLToPath(new URL('../static/img/og-default.png', import.meta.url)),
  });
  console.log('Created static/img/og-default.png (1200 × 630).');
} finally {
  await browser.close();
}
