import type { BrowserContext, Page } from '@playwright/test';
import { getButtonByText } from './button';
import { expect } from './fixtures';

export const FUEL_MNEMONIC =
  'demand fashion unaware upgrade upon heart bright august panel kangaroo want gaze';
export const FUEL_WALLET_PASSWORD = '$123Ran123Dom123!';

// Helper to log steps
function logStep(step: string) {
  console.log(`[STEP]: ${step}`);
}

export async function walletSetup(
  context: BrowserContext,
  fuelExtensionId: string,
  page: Page
) {
  logStep(`Navigating to Chrome Extension popup page`);
  await page.goto(`chrome-extension://${fuelExtensionId}/popup.html`);

  logStep(`Waiting for sign-up page`);
  const signupPage = await context.waitForEvent('page', {
    predicate: (page) => page.url().includes('sign-up'),
  });
  expect(signupPage.url()).toContain('sign-up');
  logStep(`Sign-up page loaded`);

  logStep(`Clicking "Import seed phrase"`);
  const button = signupPage.locator('h3').getByText('Import seed phrase');
  await button.click();

  logStep(`Agreeing to Terms and Conditions`);
  await signupPage.getByRole('checkbox').click();
  const toSeedPhrase = getButtonByText(signupPage, 'Next: Seed Phrase');
  await toSeedPhrase.click();

  logStep(`Copying and pasting seed phrase`);
  await signupPage.evaluate(
    `navigator.clipboard.writeText('${FUEL_MNEMONIC}')`
  );
  const pasteButton = signupPage.locator('button').getByText('Paste');
  await pasteButton.click();
  const toPassword = signupPage
    .locator('button')
    .getByText('Next: Your password');
  await toPassword.click();

  logStep(`Entering and confirming password`);
  const enterPassword = signupPage.locator(`[aria-label="Your Password"]`);
  await enterPassword.type(FUEL_WALLET_PASSWORD);
  const confirmPassword = signupPage.locator(`[aria-label="Confirm Password"]`);
  await confirmPassword.type(FUEL_WALLET_PASSWORD);
  const toFinish = getButtonByText(signupPage, 'Next: Finish set-up');
  await toFinish.click();

  logStep(`Verifying wallet creation`);
  await signupPage
    .locator('h2')
    .getByText('Wallet created successfully')
    .waitFor({ state: 'visible', timeout: 20000 });

  logStep(`Closing sign-up page`);
  await signupPage.close();
}

export async function useFuelWallet(
  context: BrowserContext,
  extensionId: string,
  page: Page
) {
  logStep(`Starting wallet setup`);
  await walletSetup(context, extensionId, page);
  logStep(`Wallet setup completed`);
}

export async function walletConnect(context: BrowserContext) {
  logStep(`Attempting to connect wallet`);
  const walletPage = await getWalletPage(context);

  logStep(`Clicking "Next" button`);
  await walletPage.getByRole('button', { name: 'Next' }).click();

  logStep(`Clicking "Connect" button`);
  await walletPage.getByRole('button', { name: 'Connect' }).click();
  logStep(`Wallet connected`);
}

export async function walletApprove(context: BrowserContext) {
  logStep(`Attempting to approve wallet connection`);
  const walletPage = await getWalletPage(context);

  if (walletPage) {
    logStep(`Wallet page found`);
  }

  logStep(`Waiting for approval button to become available`);
  await walletPage.waitForTimeout(8000);

  logStep(`Clicking "Approve" button`);
  await walletPage.getByRole('button', { name: 'Approve' }).click();
  logStep(`Wallet connection approved`);
}

async function getWalletPage(context: BrowserContext) {
  logStep(`Searching for wallet popup page`);
  let walletPage = context.pages().find((p) => p.url().includes('/popup'));

  if (!walletPage) {
    logStep(`Wallet popup not found, waiting for page event`);
    walletPage = await context.waitForEvent('page', {
      predicate: (page) => page.url().includes('/popup'),
    });
  }

  logStep(`Wallet popup page located`);
  return walletPage;
}
