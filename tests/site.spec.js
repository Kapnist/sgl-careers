// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const PAGES = [
  { path: '/index.html', lang: 'en', apply: 'Apply by email' },
  { path: '/fr.html', lang: 'fr-CA', apply: 'Postuler par courriel' },
];
const WIDTHS = [320, 375, 768, 1024, 1440, 1920];

// Keep the tests fast and deterministic: block every request that leaves the local server
// (links to www.sgl.com are checked as markup, not fetched).
test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
});

/** Go to a page without the first-visit language redirect getting in the way. */
async function open(page, path) {
  await page.addInitScript((lang) => {
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }, path.includes('fr') ? 'fr' : 'en');
  await page.goto(path);
}

for (const p of PAGES) {
  test.describe(p.path, () => {
    test('declares its language and links to the other version', async ({ page }) => {
      await open(page, p.path);
      await expect(page.locator('html')).toHaveAttribute('lang', p.lang);
      for (const hl of ['en', 'fr', 'x-default']) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${hl}"]`)).toHaveCount(1);
      }
      await expect(page.locator('.lang a[hreflang="en"]')).toBeVisible();
      await expect(page.locator('.lang a[hreflang="fr"]')).toBeVisible();
      await expect(page.locator('.lang a[aria-current="page"]')).toHaveCount(1);
    });

    test('has no WCAG 2.1 A/AA violations (mobile and desktop)', async ({ page }) => {
      for (const width of [375, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await open(page, p.path);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        const summary = results.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.help}`);
        expect(summary, `axe violations at ${width}px`).toEqual([]);
      }
    });

    test('never scrolls sideways, from 320 to 1920 px', async ({ page }) => {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await open(page, p.path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth
        );
        expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);
      }
    });

    test('loads every local file and logs no errors', async ({ page }) => {
      const errors = [];
      const failed = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|net::/.test(m.text())) errors.push(m.text()); });
      page.on('response', (r) => {
        if (r.url().startsWith('http://127.0.0.1') && r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
      });
      await open(page, p.path);
      await page.waitForLoadState('networkidle');
      const brokenImages = await page.$$eval('img', (imgs) =>
        imgs.filter((i) => i.complete && i.naturalWidth === 0 && !/^https?:\/\/(?!127)/.test(i.src)).map((i) => i.src)
      );
      expect(failed, 'local requests that failed').toEqual([]);
      expect(brokenImages, 'images that did not load').toEqual([]);
      expect(errors, 'JavaScript errors').toEqual([]);
    });

    test('every relative link points to a file that exists', async ({ page, request }) => {
      await open(page, p.path);
      const refs = await page.$$eval('a[href], link[href], img[src], script[src]', (els) =>
        els.map((e) => e.getAttribute('href') || e.getAttribute('src'))
      );
      const local = [...new Set(refs.filter((r) => r && !/^(https?:|mailto:|tel:|#|data:)/.test(r)))];
      expect(local.length).toBeGreaterThan(0);
      for (const ref of local) {
        const res = await request.get(new URL(ref, `http://127.0.0.1:4173${p.path}`).href);
        expect(res.status(), `${ref} on ${p.path}`).toBe(200);
      }
    });

    test('apply buttons open an email with the position title as subject', async ({ page }) => {
      await open(page, p.path);
      const hrefs = await page.$$eval('a[href^="mailto:careers@sgl.com?subject="]', (as) => as.map((a) => a.getAttribute('href')));
      expect(hrefs.length).toBeGreaterThanOrEqual(2);
      for (const h of hrefs) expect(decodeURIComponent(h)).toContain('subject=Web Developer - IT Assistant');
      await expect(page.getByRole('link', { name: p.apply }).first()).toBeVisible();
    });

    test('mobile menu opens, reports its state and closes with Escape', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await open(page, p.path);
      const toggle = page.locator('.nav-toggle');
      const nav = page.locator('#site-nav');
      await expect(nav).toBeHidden();
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(nav).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(nav).toBeHidden();
    });
  });
}

test.describe('language selection', () => {
  test.use({ locale: 'fr-CA' });

  test('a French browser lands on the French page, and an explicit EN choice is kept', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page).toHaveURL(/fr\.html$/);
    await page.locator('.lang a[hreflang="en"]').click();
    await expect(page).toHaveURL(/index\.html$/);
    await page.reload();
    await expect(page).toHaveURL(/index\.html$/);
  });
});

test('an English browser stays on the English page', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page).toHaveURL(/index\.html$/);
  await expect(page.locator('h1')).toHaveText(/Web Developer/);
});
