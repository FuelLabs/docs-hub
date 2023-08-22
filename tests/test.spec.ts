/* eslint-disable no-case-declarations */
import type { BrowserContext, Page } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import type { WalletUnlocked } from 'fuels';
import { Wallet } from 'fuels';
import { EOL } from 'os';
import { join } from 'path';

import { test, expect } from './utils/fixtures';
import { FUEL_MNEMONIC } from './utils/mocks';
import { visit, reload } from './utils/visit';
import { walletSetup, walletConnect, walletApprove } from './utils/wallet';

interface Instruction {
  text: string;
  output: string;
}

const QUICKSTART_TEST_CONFIG = JSON.parse(
  fs.readFileSync(join(process.cwd(), '/tests/quickstart.json'), 'utf8')
);

const START_SERVER_COMMAND = "pnpm pm2 start npm --name 'docs-hub' -- run dev";
const STOP_SERVERS = 'pnpm pm2 delete all';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let saved: any[] = [];

test.describe('Guides', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let fuelWallet: WalletUnlocked;

  async function useFuelWallet(
    context: BrowserContext,
    extensionId: string,
    page: Page
  ) {
    await walletSetup(context, extensionId, page);
    fuelWallet = Wallet.fromMnemonic(FUEL_MNEMONIC);
  }

  test('dev quickstart', async ({ context, extensionId, page }) => {
    let isRunning = checkIfServersRunning();
    if (isRunning) {
      stopServers();
    }
    saved = [];
    // if (QUICKSTART_TEST_CONFIG.needs_wallet) {
    //   console.log('SETTING UP WALLET');
    //   await useFuelWallet(context, extensionId, page);
    // }
    // console.log('SETTING UP FOLDERS');
    // await setupFolders(QUICKSTART_TEST_CONFIG.project_folder);
    console.log('STARTING DEV SERVER');
    const startOutput = execSync(START_SERVER_COMMAND, {
      encoding: 'utf-8',
    });
    console.log('START SERVER OUTPUT:', startOutput);
    await page.waitForTimeout(10000);
    console.log('WAITED 10 SECONDS');
    // console.log('RUNNING TEST');
    // await runTest(page, QUICKSTART_TEST_CONFIG, context);
    // console.log('DONE RUNNING TEST');

    await visit(page, 'guides/quickstart/building-a-smart-contract');

    isRunning = checkIfServersRunning();
    if (isRunning) {
      stopServers();
    }
  });
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function runTest(page: Page, config: any, context: BrowserContext) {
  await visit(page, config.start_url);

  for (const step of config.steps) {
    console.log('STEP:', step);
    switch (step.action) {
      case 'runCommand':
        if (step.inputs.length === 1) {
          await runCommand(page, step.inputs[0]);
        } else {
          await runCommand(page, step.inputs[0], step.inputs[1]);
        }
        break;
      case 'wait':
        await page.waitForTimeout(step.inputs[0]);
        break;
      case 'reload':
        await reload(page);
        break;
      case 'goToUrl':
        await visit(page, step.inputs[0]);
        break;
      case 'compareFiles':
        await compareFiles(step.inputs[0], step.inputs[1]);
        break;
      case 'compareToFile':
        await compareToFile(page, step.inputs[0], step.inputs[1]);
        break;
      case 'writeToFile':
        await writeToFile(page, step.inputs[0], step.inputs[1]);
        break;
      case 'modifyFile':
        if (step.inputs.length === 2) {
          await modifyFile(page, step.inputs[0], step.inputs[1]);
        } else if (step.inputs.length === 3) {
          await modifyFile(
            page,
            step.inputs[0],
            step.inputs[1],
            step.inputs[2]
          );
        } else {
          await modifyFile(
            page,
            step.inputs[0],
            step.inputs[1],
            step.inputs[2],
            step.inputs[3]
          );
        }
        break;
      case 'getByLocator-save':
        const locatorVal = await page.locator(step.inputs[0]).allInnerTexts();
        saved.push(locatorVal);
        break;
      case 'clickByRole':
        await page.getByRole(step.inputs[0], { name: step.inputs[1] }).click();
        break;
      case 'walletApproveConnect':
        await walletConnect(context);
        break;
      case 'walletApprove':
        await walletApprove(context);
        break;
      case 'checkIfIsIncremented':
        console.log('SAVED:', saved);
        console.log('INITAL INPUT:', parseInt(step.inputs[0]));
        console.log('FINAL INPUT:', parseInt(step.inputs[1]));
        checkIfIsIncremented(
          parseInt(step.inputs[0]),
          parseInt(step.inputs[1])
        );
        break;
      default:
    }
  }
}

async function clickCopyButton(page: Page, id: string) {
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

async function runCommand(page: Page, buttonName: string, goToFolder?: string) {
  const copied = await clickCopyButton(page, buttonName);
  console.log('COPIED', copied.text);
  let command = copied.text;
  if (goToFolder) {
    if (goToFolder.includes('<COMMAND>')) {
      command = goToFolder.replace('<COMMAND>', copied.text);
    } else {
      command = goToFolder + copied.text;
    }
  }
  console.log('COMMAND', command);
  const commandOutput = execSync(command, {
    encoding: 'utf-8',
  });
  console.log('COMMAND OUTPUT', commandOutput);
  if (copied.output !== '') {
    compareOutputs(commandOutput, copied.output);
  }
}

async function writeToFile(page: Page, buttonName: string, filePath: string) {
  const content = await clickCopyButton(page, buttonName);
  fs.writeFileSync(filePath, content.text + '\n\n');
}

async function modifyFile(
  page: Page,
  buttonName: string,
  filePath: string,
  atLine?: number,
  removeLines?: number[]
) {
  const content = await clickCopyButton(page, buttonName);
  if (!atLine && !removeLines) {
    fs.appendFileSync(filePath, content.text + '\n\n');
  } else {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    if (removeLines) {
      removeLines.forEach((lineNumber) => {
        lines[lineNumber - 1] = '~~~REMOVE~~~';
      });
    }
    if (atLine) {
      lines.splice(atLine - 1, 0, content.text);
    }
    const modifiedContent = lines
      .filter((line) => line !== '~~~REMOVE~~~')
      .join('\n');

    fs.writeFileSync(filePath, modifiedContent, 'utf8');
  }
}

async function compareToFile(page: Page, buttonName: string, pathName: string) {
  const expected = await clickCopyButton(page, buttonName);
  const actual = fs.readFileSync(pathName, { encoding: 'utf8' });
  compareOutputs(expected.text, actual);
}

async function setupFolders(projectFolder: string) {
  if (!fs.existsSync('guides-testing')) {
    await fs.promises.mkdir('guides-testing');
  }
  const projectPath = `guides-testing/${projectFolder}`;
  if (fs.existsSync(projectPath)) {
    await fs.promises.rm(projectPath, {
      recursive: true,
      force: true,
    });
  }
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

function compareOutputs(expected: string, actual: string) {
  const split1 = expected
    .trim()
    .split(EOL)
    .filter((line) => !line.startsWith('// ANCHOR'));
  const split2 = actual.trim().split(EOL);
  expect(split1.length === split2.length).toBeTruthy();
  split1.forEach((line, i) => {
    const trimmedLineA = line.trim().replace(/\u00A0/g, ' ');
    const trimmedLineB = split2[i].trim().replace(/\u00A0/g, ' ');
    expect(trimmedLineA).toEqual(trimmedLineB);
  });
}

async function compareFiles(testPathName: string, refPathName: string) {
  const actual = fs.readFileSync(testPathName, { encoding: 'utf8' });
  const expected = fs.readFileSync(refPathName, { encoding: 'utf8' });
  compareOutputs(expected, actual);
}

function checkIfIsIncremented(initialIndex: number, finalIndex: number) {
  const initial: number = parseInt(saved[initialIndex]);
  const final: number = parseInt(saved[finalIndex]);
  console.log('INITIAL:', initial);
  console.log('FINAL:', final);
  const isIncremented = final === initial + 1;
  expect(isIncremented).toBeTruthy();
}

function stopServers() {
  console.log('STOPPING SERVERS');
  // stop & delete pm2 servers
  execSync(STOP_SERVERS, {
    encoding: 'utf-8',
  });
  console.log('DONE STOPPING SERVERS');
}

function checkIfServersRunning() {
  try {
    const output = execSync('pm2 list --no-color').toString();
    return output.includes('online');
  } catch (error) {
    console.error('Error checking PM2 servers:', error);
    return false;
  }
}
