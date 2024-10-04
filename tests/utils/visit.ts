import type { Page } from '@playwright/test';

export async function visit(page: Page, pathname: string) {
  console.log('GOING TO URL:', pathname);
  await page.waitForTimeout(5000);
  const pageFinal = await page.goto(`${pathname}`);
  await page.waitForTimeout(2000);
  return pageFinal;
}

export async function reload(page: Page) {
  await page.reload();
  await page.waitForTimeout(2000);
  return page;
}
