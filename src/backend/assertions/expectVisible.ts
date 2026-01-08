import type { Page } from 'playwright';

export async function expectVisible(page: Page, selector: string, timeout = 2000) {
  const el = await page.waitForSelector(selector, { state: 'visible', timeout });
  if (!el) throw new Error(`Element ${selector} not visible`);
}
