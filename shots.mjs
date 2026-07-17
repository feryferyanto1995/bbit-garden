// Screenshot harness for design iteration (dev-only, not shipped).
import { chromium } from 'playwright';

const OUT = process.env.OUT_DIR ?? 'shots';
const url = 'http://localhost:5199/';
const theme = process.env.THEME ?? 'day';
const width = Number(process.env.W ?? 1440);
const height = Number(process.env.H ?? 900);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height },
  colorScheme: theme === 'dusk' ? 'dark' : 'light',
});
const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600); // let the wordmark settle

const tag = `${theme}-${width}`;
await page.screenshot({ path: `${OUT}/01-cover-${tag}.png` });

// scroll through sections
for (const [i, sel] of ['#about', '#specimens', '#photographs', '#garden'].entries()) {
  await page.locator(sel).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${OUT}/0${i + 2}-${sel.slice(1)}-${tag}.png` });
}

// plant a few seeds in the garden
const bed = page.locator('.garden-bed');
const box = await bed.boundingBox();
if (box) {
  for (const f of [0.3, 0.45, 0.62]) {
    await page.mouse.click(box.x + box.width * f, box.y + box.height * 0.5);
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${OUT}/06-garden-planted-${tag}.png` });
}

// lightbox
await page.locator('.photo-feature').click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/07-lightbox-${tag}.png` });
await page.keyboard.press('Escape');

// full page
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/08-full-${tag}.png`, fullPage: true });

console.log('console errors:', errors.length ? errors : 'none');
await browser.close();
