import { test } from './utils/fixtures';
import { runTest } from './utils/runTest';
import { setupFolders, startServers, stopServers } from './utils/setup';
import { useFuelWallet } from './utils/wallet';

const testCases = [
  {
    name: 'quickstart',
    urls: ['guides/contract-quickstart'],
  },
  {
    name: 'counter-dapp',
    urls: [
      'guides/counter-dapp/building-a-smart-contract',
      'guides/counter-dapp/building-a-frontend',
    ],
  },
  {
    name: 'intro to sway',
    urls: [
      'guides/intro-to-sway/prerequisites',
      'guides/intro-to-sway/contract-imports',
      'guides/intro-to-sway/contract-structs',
      'guides/intro-to-sway/contract-abi',
      'guides/intro-to-sway/contract-storage',
      'guides/intro-to-sway/contract-errors',
      'guides/intro-to-sway/contract-functions',
      'guides/intro-to-sway/checkpoint',
      'guides/intro-to-sway/rust-sdk',
      'guides/intro-to-sway/typescript-sdk',
    ],
  },
  {
    name: 'intro to predicates',
    urls: [
      'guides/intro-to-predicates/prerequisites',
      'guides/intro-to-predicates/predicate-root',
      'guides/intro-to-predicates/imports',
      'guides/intro-to-predicates/configurables',
      'guides/intro-to-predicates/signature-verification',
      'guides/intro-to-predicates/main',
      'guides/intro-to-predicates/checkpoint',
      'guides/intro-to-predicates/debugging-with-scripts',
      'guides/intro-to-predicates/debugging-with-scripts-rust',
      'guides/intro-to-predicates/rust-sdk',
    ],
  },
];

// Utility functions for setup and cleanup
async function setupEnvironment(context, extensionId, page, folderName = 'fuel-project') {
  stopServers();
  await useFuelWallet(context, extensionId, page);
  await setupFolders(folderName);
  await startServers(page);
}

async function cleanupEnvironment() {
  stopServers();
}

// Run tests with logging for better debugging
async function runTestWithLogging(page, context, url) {
  try {
    console.log(`Starting test for: ${url}`);
    await runTest(page, context, url);
    console.log(`Test passed for: ${url}`);
  } catch (error) {
    console.error(`Test failed for: ${url}`);
    console.error(error);
    throw error;
  }
}

// Parameterized tests
testCases.forEach(({ name, urls }) => {
  test(name, async ({ context, extensionId, page }) => {
    await setupEnvironment(context, extensionId, page);

    for (const url of urls) {
      await runTestWithLogging(page, context, url);
    }

    await cleanupEnvironment();
  });
});
