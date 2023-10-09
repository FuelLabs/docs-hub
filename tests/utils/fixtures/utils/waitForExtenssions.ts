import type { BrowserContext } from '@playwright/test';
import { setTimeout } from 'timers/promises';

export async function waitForExtensions(
  context: BrowserContext,
  extensions: Record<
    string,
    {
      id: string;
      version: string;
    }
  >,
  attempts: number = 0
) {
  console.log('Checking extensions...');
  const pages = context.pages();
  const hasFuelWallet = pages.find((page) => {
    return page.url().includes(extensions['fuel wallet']?.id);
  });
  if (!hasFuelWallet) {
    if (attempts > 5) {
      throw new Error('Too many attempts to wait for the extensions');
    }
    await setTimeout(3000);
    return waitForExtensions(context, extensions, attempts + 1);
  }
  console.log('Extensions ready!');
  return true;
}
