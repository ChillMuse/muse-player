import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const url = process.env.SITE_URL || 'http://localhost:4173/muse-player/';
for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  test(`${name}: all features visible by scrolling, enlargement and accessibility`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await expect(page).toHaveTitle('Muse. Find your frequency.');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'Explore Muse' })).toBeInViewport();
    await expect(page.getByRole('tab')).toHaveCount(0);
    await expect(page.locator('main figure')).toHaveCount(7);
    for (const screen of ['home', 'library', 'artists', 'songs', 'lyrics', 'queue', 'radio']) {
      const screenshot = page.locator(`main figure img[src$="/${screen}.jpg"]`);
      await screenshot.scrollIntoViewIfNeeded();
      await expect(screenshot).toBeInViewport();
      await screenshot.evaluate(img => img.decode());
      await screenshot.locator('..').click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.locator('dialog img')).toHaveAttribute('src', new RegExp(`/${screen}.jpg$`));
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).not.toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.evaluate(() => /[\uac00-\ud7af]/.test(document.documentElement.outerHTML))).toBe(false);
    await page.locator('summary').last().click();
    await expect(page.locator('details').last()).toHaveAttribute('open', '');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  });
}

const docsUrl = url.replace(/\/?$/, '/') + 'docs.html';
for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  test(`${name}: docs page contents, links and accessibility`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(docsUrl);
    await expect(page).toHaveTitle('Muse docs. How Muse works.');
    const toc = page.getByRole('navigation', { name: 'On this page' }).getByRole('link');
    await expect(toc).toHaveCount(11);
    for (const hash of await toc.evaluateAll(links => links.map(link => link.hash))) await expect(page.locator(hash)).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.content()).not.toContain('__MUSE_RELEASE__');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({ path: `test-results/docs-${name}.png`, fullPage: true });
  });
}
