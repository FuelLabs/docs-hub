import type { BrowserContext, Page } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import { EOL } from 'os';

import { test, expect } from './utils/fixtures';
import { visit, reload } from './utils/visit';
import { walletSetup, walletConnect, walletApprove } from './utils/wallet';

interface Instruction {
  text: string;
  output: string;
}

const START_SERVER_COMMAND = "pnpm pm2 start npm --name 'docs-hub' -- run dev";
const STOP_SERVERS = 'pnpm pm2 delete all';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let saved: any[] = [];

test.describe('Guides', () => {
  async function useFuelWallet(
    context: BrowserContext,
    extensionId: string,
    page: Page
  ) {
    await walletSetup(context, extensionId, page);
  }

  async function getTestActions(page: Page) {
    const testActions = await page.$$eval('span[data-name]', (elements) => {
      return elements.map((el) => {
        const dataAttributes = {};
        for (const attr of el.attributes) {
          dataAttributes[attr.name] = attr.value;
        }
        dataAttributes['id'] = el.id;
        return dataAttributes;
      });
    });
    console.log('FINAL TEST ACTIONS:', testActions);
    return testActions;
  }

  test('dev quickstart', async ({ context, extensionId, page }) => {
    let isRunning = checkIfServersRunning();
    if (isRunning) {
      stopServers();
    }
    saved = [];
    // await useFuelWallet(context, extensionId, page);
    console.log('SETTING UP FOLDERS');
    await setupFolders('fuel-project');

    console.log('STARTING DEV SERVER');
    const startOutput = execSync(START_SERVER_COMMAND, {
      encoding: 'utf-8',
    });
    console.log('START SERVER OUTPUT:', startOutput);
    await page.waitForTimeout(4000);
    console.log('WAITED 4 SECONDS');
    const CONTRACT_PAGE_URL = 'guides/quickstart/building-a-smart-contract';
    console.log('GOING TO URL:', CONTRACT_PAGE_URL);
    await visit(page, CONTRACT_PAGE_URL);

    console.log('GETTING CONTRACT TEST ACTIONS');
    const contractActions = await getTestActions(page);
    expect(contractActions.length).toBeGreaterThan(0);

    console.log('RUNNING TEST: CONTRACT');
    await runTest(page, contractActions, context);

    const FRONTEND_PAGE_URL = 'guides/quickstart/building-a-frontend';
    await visit(page, FRONTEND_PAGE_URL);

    console.log('GETTING FRONTEND TEST ACTIONS');
    const frontendActions = await getTestActions(page);
    expect(frontendActions.length).toBeGreaterThan(0);

    console.log('RUNNING TEST: FRONTEND');
    await runTest(page, frontendActions, context);

    isRunning = checkIfServersRunning();
    if (isRunning) {
      stopServers();
    }
    context.close();
  });
});
async function runTest(
  page: Page,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  steps: any,
  context: BrowserContext
) {
  for (const step of steps) {
    console.log('STEP:', step);
    await page.waitForTimeout(1000);
    switch (step['data-name']) {
      case 'runCommand':
        if (step['data-pre-command']) {
          await runCommand(
            page,
            step.id,
            step['data-command-folder'],
            step['data-pre-command']
          );
        } else if (step['data-command-folder']) {
          await runCommand(page, step.id, step['data-command-folder']);
        } else {
          await runCommand(page, step.id);
        }
        break;
      case 'wait':
        await page.waitForTimeout(parseInt(step['data-timeout']));
        break;
      case 'reload':
        await reload(page);
        break;
      case 'goToUrl':
        await visit(page, step['data-url']);
        break;
      case 'compareFiles':
        await compareFiles(
          step['data-test-path-name'],
          step['data-ref-path-name']
        );
        break;
      case 'compareToFile':
        await compareToFile(page, step.id, step['data-filepath']);
        break;
      case 'writeToFile':
        await writeToFile(page, step.id, step['data-filepath']);
        break;
      case 'modifyFile':
        await modifyFile(
          page,
          step.id,
          step['data-filepath'],
          parseInt(step['data-add-spaces-before']),
          step['data-add-spaces-after'],
          parseInt(step['data-at-line']),
          step['data-remove-lines'],
          step['data-use-set-data']
        );
        break;
      case 'getByLocator-save':
        // eslint-disable-next-line no-case-declarations
        const locatorVal = await page
          .locator(step['data-locator'])
          .allInnerTexts();
        saved.push(locatorVal);
        break;
      case 'clickByRole':
        await page
          .getByRole(step['data-role'], { name: step['data-element-name'] })
          .click();
        break;
      case 'walletApproveConnect':
        await walletConnect(context);
        break;
      case 'walletApprove':
        await walletApprove(context);
        break;
      case 'checkIfIsIncremented':
        checkIfIsIncremented(
          parseInt(step['data-initial-index']),
          parseInt(step['data-final-index'])
        );
        break;
      default:
        console.log('STEP NOT FOUND:', step);
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

async function runCommand(
  page: Page,
  buttonName: string,
  goToFolder?: string | null,
  preCommand?: string
) {
  const copied = await clickCopyButton(page, buttonName);
  console.log('COPIED', copied.text);
  let command = copied.text;
  if (preCommand) {
    if (preCommand.includes('<COMMAND>')) {
      command = preCommand.replace('<COMMAND>', copied.text);
    } else {
      command = preCommand + copied.text;
    }
  }
  if (goToFolder) {
    command = `cd ${goToFolder} && ` + command;
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
  addSpacesBefore?: number,
  addSpacesAfter?: number,
  atLine?: number,
  removeLines?: string,
  useSetData?: string
) {
  let contentText = useSetData;
  if (!contentText) {
    const content = await clickCopyButton(page, buttonName);
    contentText = content.text;
  }
  const spacesBefore = '\n'.repeat(addSpacesBefore ?? 0);
  const spacesAfter = '\n'.repeat(addSpacesAfter ?? 0);
  if (!atLine && !removeLines) {
    const finalContent = spacesBefore + contentText + spacesAfter;
    fs.appendFileSync(filePath, finalContent + '\n\n');
  } else {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    if (removeLines) {
      const removeLinesArray = JSON.parse(removeLines);
      removeLinesArray.forEach((lineNumber) => {
        lines[parseInt(lineNumber) - 1] = '~~~REMOVE~~~';
      });
    }
    if (atLine) {
      lines.splice(atLine - 1, 0, contentText);
    }
    let finalContent = lines
      .filter((line) => line !== '~~~REMOVE~~~')
      .join('\n');
    finalContent = spacesBefore + finalContent + spacesAfter;
    fs.writeFileSync(filePath, finalContent, 'utf8');
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
