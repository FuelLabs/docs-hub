/* eslint-disable no-empty-pattern */
// Use a test fixture to set the context so tests have access to the wallet extension.
import type { BrowserContext } from '@playwright/test';
import { chromium, test as base } from '@playwright/test';
import admZip from 'adm-zip';
import * as fs from 'fs';
import https from 'https';
import path from 'path';

const pathToExtension = path.join(__dirname, '../../test-results/wallet-dist');
console.log('PATH TO EXTENSION:', pathToExtension);

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    const extensionUrl = 'https://wallet.fuel.network/app/fuel-wallet.zip';

    const zipFile = path.join(__dirname, '../../test-results/fuel-wallet.zip');
    console.log('ZIP FILE', zipFile);
    const zipFileStream = fs.createWriteStream(zipFile);
    const zipPromise = new Promise((resolve, reject) => {
      https
        .get(extensionUrl, (res) => {
          res.pipe(zipFileStream);
          // after download completed close filestream
          zipFileStream.on('finish', async () => {
            zipFileStream.close();
            console.log('Download Completed extracting zip...');
            const zipPath = pathToExtension;
            const zip = new admZip(zipFile);
            zip.extractAllTo(zipPath, true);
            console.log('zip extracted');
            resolve(true);
          });
        })
        .on('error', (error) => {
          console.log('error: ', error);
          reject(error);
        });
    });
    await zipPromise;

    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      '--remote-debugging-port=9222',
    ];

    // launch browser
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: browserArgs,
    });

    await context.pages()[0].waitForTimeout(3000);
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent('serviceworker');
    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const expect = test.expect;
