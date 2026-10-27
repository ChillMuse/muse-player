import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const url = 'http://localhost:4173/muse-player/';
test('desktop interactions, assets and accessibility', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(url); await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle('Muse. Find your frequency.');
  await page.getByRole('tab', { name: 'Library', exact: true }).click();
  await expect(page.locator('#app-screen')).toHaveAttribute('src', /library.jpg/);
  await page.getByRole('tab', { name: 'Library', exact: true }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Radio', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Artists', exact: true }).click();
  await expect(page.locator('#app-screen')).toHaveAttribute('src', /artists.jpg/);
  await page.getByRole('button', { name: '크게 보기', exact: false }).last().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.locator('summary').last().click(); await expect(page.locator('details').last()).toHaveAttribute('open', '');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto(url); await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(img => !img.closest('dialog')).map(img => { img.loading = 'eager'; return img.decode(); })); }); await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
});
test('mobile layout and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto(url);
  await expect(page.getByRole('link', { name: 'Muse 둘러보기' })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const tab of await page.getByRole('tab').all()) { await tab.click(); await expect(page.locator('#app-screen')).toBeVisible(); }
  await page.evaluate(async () => { await Promise.all([...document.images].filter(img => !img.closest('dialog')).map(img => { img.loading = 'eager'; return img.decode(); })); });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto(url); await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(img => !img.closest('dialog')).map(img => { img.loading = 'eager'; return img.decode(); })); }); await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
});
