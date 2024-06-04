// Use a test fixture to set the context so tests have access to the wallet extension.
import { downloadFuel } from '@fuel-wallet/playwright-utils';
import type { BrowserContext } from '@playwright/test';
import { test as base, chromium } from '@playwright/test';

import { getExtensionsData } from './utils/getExtensionsData';
import { waitForExtensions } from './utils/waitForExtenssions';

import { readFileSync } from 'fs';
import { join } from 'path';

const versionFile = readFileSync(join(process.cwd(), 'src/config/versions.json'), 'utf-8');
const versions = JSON.parse(versionFile);

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  // biome-ignore lint/correctness/noEmptyPattern:
  context: async ({}, use) => {
    // download fuel wallet
    console.log("DOWNLOADING WALLET VERSION", versions.default.wallet)
    const fuelPathExtension = await downloadFuel(versions.default.wallet);
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
