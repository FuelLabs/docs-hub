import type { BrowserContext, Page } from '@playwright/test';

import { getButtonByText } from './button';
import { expect } from './fixtures';

export const FUEL_MNEMONIC =
  'demand fashion unaware upgrade upon heart bright august panel kangaroo want gaze';
export const FUEL_WALLET_PASSWORD = '$123Ran123Dom123!';

export async function walletSetup(
  context: BrowserContext,
  fuelExtensionId: string,
  page: Page
) {
  await page.goto(`chrome-extension://${fuelExtensionId}/popup.html`);

  const signupPage = await context.waitForEvent('page', {
    predicate: (page) => page.url().includes('sign-up'),
  });
  expect(signupPage.url()).toContain('sign-up');

  const button = signupPage.locator('h3').getByText('Import seed phrase');
  await button.click();

  // Agree to T&S
  await signupPage.getByRole('checkbox').click();
  const toSeedPhrase = getButtonByText(signupPage, 'Next: Seed Phrase');
  await toSeedPhrase.click();

  // Copy and paste seed phrase
  /** Copy words to clipboard area */
  await signupPage.evaluate(
    `navigator.clipboard.writeText('${FUEL_MNEMONIC}')`
  );
  const pasteButton = signupPage.locator('button').getByText('Paste');
  await pasteButton.click();
  const toPassword = signupPage
    .locator('button')
    .getByText('Next: Your password');
  await toPassword.click();

  // Enter password
  const enterPassword = signupPage.locator(`[aria-label="Your Password"]`);
  await enterPassword.type(FUEL_WALLET_PASSWORD);
  // Confirm password
  const confirmPassword = signupPage.locator(`[aria-label="Confirm Password"]`);
  await confirmPassword.type(FUEL_WALLET_PASSWORD);
  const toFinish = getButtonByText(signupPage, 'Next: Finish set-up');
  await toFinish.click();

  await signupPage
    .locator('h2')
    .getByText('Wallet created successfully')
    .waitFor({ state: 'visible', timeout: 20000 });

  await signupPage.close();
}

export async function useFuelWallet(
  context: BrowserContext,
  extensionId: string,
  page: Page
) {
  await walletSetup(context, extensionId, page);
}

export async function walletConnect(context: BrowserContext) {
  const walletPage = await getWalletPage(context);
  await walletPage.getByRole('button', { name: 'Next' }).click();
  console.log('CLICKED NEXT BUTTON');
  await walletPage.getByRole('button', { name: 'Connect' }).click();
  console.log('CLICKED CONNECT BUTTON');
}

export async function walletApprove(context: BrowserContext) {
  const walletPage = await getWalletPage(context);
  if (walletPage) console.log('FOUND WALLET PAGE');
  await walletPage.getByRole('button', { name: 'Approve' }).click();
  console.log('CLICKED APPROVE BUTTON');
}

async function getWalletPage(context: BrowserContext) {
  let walletPage = context.pages().find((p) => p.url().includes('/popup'));
  if (!walletPage) {
    walletPage = await context.waitForEvent('page', {
      predicate: (page) => page.url().includes('/popup'),
    });
  }

  return walletPage;
}
