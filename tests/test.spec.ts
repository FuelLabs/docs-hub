import { test } from './utils/fixtures';
import { runTest } from './utils/runTest';
import { setupFolders, startServers, stopServers } from './utils/setup';
import { useFuelWallet } from './utils/wallet';

test.describe('Guides', () => {
  // test('dev quickstart', async ({ context, extensionId, page }) => {
  //   const CONTRACT_PAGE_URL = 'guides/quickstart/building-a-smart-contract';
  //   const FRONTEND_PAGE_URL = 'guides/quickstart/building-a-frontend';

  //   // SETUP
  //   stopServers();
  //   await useFuelWallet(context, extensionId, page);
  //   await setupFolders('fuel-project');
  //   await startServers(page);

  //   // TEST CONTRACT
  //   await runTest(page, context, CONTRACT_PAGE_URL);

  //   // TEST FRONTEND
  //   await runTest(page, context, FRONTEND_PAGE_URL);

  //   // SHUT DOWN
  //   stopServers();
  //   context.close();
  // });

  test('intro to sway', async ({ context, extensionId, page }) => {
    const PREREQUISITES_PAGE_URL = 'guides/intro-to-sway/prerequisites';
    const IMPORTS_PAGE_URL = 'guides/intro-to-sway/contract-imports';
    const STRUCTS_PAGE_URL = 'guides/intro-to-sway/contract-structs';
    const ABI_PAGE_URL = 'guides/intro-to-sway/contract-abi';
    const STORAGE_PAGE_URL = 'guides/intro-to-sway/contract-storage';
    const ERRORS_PAGE_URL = 'guides/intro-to-sway/contract-errors';
    const FUNCTIONS_PAGE_URL = 'guides/intro-to-sway/contract-functions';
    const CHECKPOINT_PAGE_URL = 'guides/intro-to-sway/checkpoint';
    const FUELS_RS_PAGE_URL = 'guides/intro-to-sway/rust-sdk';
    const FUELS_TS_PAGE_URL = 'guides/intro-to-sway/typescript-sdk';

    // SETUP
    stopServers();
    await useFuelWallet(context, extensionId, page);
    // await setupFolders('fuel-project');
    await startServers(page);

    // TEST CONTRACT
    // await runTest(page, context, PREREQUISITES_PAGE_URL);
    // await runTest(page, context, IMPORTS_PAGE_URL);
    // await runTest(page, context, STRUCTS_PAGE_URL);
    // await runTest(page, context, ABI_PAGE_URL);
    // await runTest(page, context, STORAGE_PAGE_URL);
    // await runTest(page, context, ERRORS_PAGE_URL);
    // await runTest(page, context, FUNCTIONS_PAGE_URL);
    // await runTest(page, context, CHECKPOINT_PAGE_URL);
    // await runTest(page, context, FUELS_RS_PAGE_URL);
    await runTest(page, context, FUELS_TS_PAGE_URL);

    // SHUT DOWN
    stopServers();
    context.close();
  });
});
