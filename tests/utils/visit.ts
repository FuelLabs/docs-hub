import type { Page } from '@playwright/test';

export async function visit(page: Page, pathname: string) {
  await page.waitForTimeout(2000);
  const pageFinal = await page.goto(`${pathname}`);
  // Using waitUntil: 'networkidle' has interminent issues
  await page.waitForTimeout(2000);
  return pageFinal;
}

export async function reload(page: Page) {
  await page.reload();
  await page.waitForTimeout(2000);
  return page;
}
