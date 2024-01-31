import type { Page } from '@playwright/test';

interface Instruction {
  text: string;
  output: string;
}

export function getButtonByText(page: Page, selector: string | RegExp) {
  return page.locator('button').getByText(selector);
}

export async function clickByLocator(page: Page, locator: string) {
  await page.locator(locator).click();
}

export async function clickCopyButton(page: Page, id: string) {
  let clipboardText = { text: '', output: '' };
  const selector = `#${id} + div > div > div > button[aria-label="Copy to Clipboard"]`;
  await page.locator(selector).click();
  const rawText: string = await page.evaluate('navigator.clipboard.readText()');
  if (rawText.startsWith('$')) {
    clipboardText = separateCommand(rawText);
  } else {
    clipboardText.text = rawText;
    clipboardText.output = '';
  }
  return clipboardText;
}

function separateCommand(text: string): Instruction {
  const lines = text.trim().split('\n');
  // The first line contains the command
  const command = lines[0].replace('$', '').trim();
  // The rest of the lines contain the console output
  const consoleOutput = lines.slice(1).join('\n');
  return {
    text: command,
    output: consoleOutput,
  };
}
