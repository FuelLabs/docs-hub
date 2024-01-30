/* eslint-disable no-empty-pattern */
// Use a test fixture to set the context so tests have access to the wallet extension.
import { downloadFuel } from '@fuel-wallet/playwright-utils';
import type { BrowserContext } from '@playwright/test';
import { chromium, test as base } from '@playwright/test';

import { getExtensionsData } from './utils/getExtensionsData';
import { waitForExtensions } from './utils/waitForExtenssions';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    // download fuel wallet
    const fuelPathExtension = await downloadFuel('0.15.0');
    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${fuelPathExtension}`,
      `--load-extension=${fuelPathExtension}`,
      '--remote-debugging-port=9222',
    ];
    // launch browser
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: browserArgs,
    });
    // Ge extenssions data
    const extensions = await getExtensionsData(context);
    // Wait for Fuel Wallet to load
    await waitForExtensions(context, extensions);
    // Set context to playwright
    await use(context);
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent('serviceworker');
    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const expect = test.expect;
