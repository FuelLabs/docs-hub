import { test } from './utils/fixtures';
import { runTest } from './utils/runTest';
import { setupFolders, startServers, stopServers } from './utils/setup';
import { useFuelWallet } from './utils/wallet';

test.describe('Guides', () => {
  test('dev quickstart', async ({ context, extensionId, page }) => {
    const CONTRACT_PAGE_URL = 'guides/quickstart/building-a-smart-contract';
    const FRONTEND_PAGE_URL = 'guides/quickstart/building-a-frontend';

    // SETUP
    stopServers();
    await useFuelWallet(context, extensionId, page);
    await setupFolders('fuel-project');
    await startServers(page);

    // TEST CONTRACT
    await runTest(page, context, CONTRACT_PAGE_URL);

    // TEST FRONTEND
    await runTest(page, context, FRONTEND_PAGE_URL);

    // SHUT DOWN
    stopServers();
    context.close();
  });
});
