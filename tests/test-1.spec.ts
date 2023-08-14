import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import { EOL } from 'os';

interface Instruction {
  text: string;
  output: string;
}

const CONTRACT_PATH =
  'guides-testing/fuel-project/counter-contract/src/main.sw';
const TEST_CONTRACT_TEST_PATH =
  'guides-testing/fuel-project/counter-contract/tests/harness.rs';
const ACTUAL_CONTRACT_TEST_PATH =
  'docs/guides/examples/quickstart/counter-contract/tests/harness.rs';

const goToTestingFolder = 'cd guides-testing && ';
const goToProjectFolder = 'cd guides-testing/fuel-project && ';
const goToContractFolder =
  'cd guides-testing/fuel-project/counter-contract && ';

test('test dev quickstart', async ({ page, context }) => {
  async function clickCopyButton(id: string) {
    let clipboardText = { text: '', output: '' };
    const selector = `#${id} + div > div > div > button[aria-label="Copy to Clipboard"]`;
    await page.locator(selector).click();
    const rawText: string = await page.evaluate(
      'navigator.clipboard.readText()'
    );
    if (rawText.startsWith('$')) {
      clipboardText = separateCommand(rawText);
    } else {
      clipboardText.text = rawText;
      clipboardText.output = '';
    }
    return clipboardText;
  }

  async function runCommand(buttonName: string, goToFolder?: string) {
    const copied = await clickCopyButton(buttonName);
    const command = goToFolder ? goToFolder + copied.text : copied.text;
    const commandOutput = execSync(command, {
      encoding: 'utf-8',
    });
    if (copied.output !== '') {
      compareOutputs(commandOutput, copied.output);
    }
  }

  async function writeToFile(buttonName: string, filePath: string) {
    const content = await clickCopyButton(buttonName);
    fs.writeFileSync(filePath, content.text + '\n\n');
  }

  async function modifyFile(
    buttonName: string,
    filePath: string,
    atLine?: number,
    removeLines?: number[]
  ) {
    const content = await clickCopyButton(buttonName);
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

  async function compareToFile(buttonName: string, pathName: string) {
    const expected = await clickCopyButton(buttonName);
    const actual = fs.readFileSync(pathName, { encoding: 'utf8' });
    compareOutputs(expected.text, actual);
  }

  await page.goto(
    'http://localhost:3000/guides/quickstart/building-a-smart-contract/'
  );
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  setupFolders();

  // set default toolchain
  await runCommand('set-default-fuelup-toolchain');

  // get the command to make a new folder
  await runCommand('create-project-folder', goToTestingFolder);

  // get the command to make a new forc project
  await runCommand('create-contract', goToTestingFolder);

  // get the command to show the contract tree
  await runCommand('contract-tree', goToProjectFolder);

  // add part 1 to contract
  await writeToFile('program-type', CONTRACT_PATH);

  // add part 2 to contract
  await modifyFile('storage', CONTRACT_PATH);

  // add part 3 to contract
  await modifyFile('abi', CONTRACT_PATH);

  //  add part 4 to contract
  await modifyFile('impl', CONTRACT_PATH);

  // check the whole contract
  await compareToFile('entire-contract', CONTRACT_PATH);

  // build the contract
  await runCommand('build-contract', goToContractFolder);

  // built contract tree
  await runCommand('built-contract-tree', goToContractFolder);

  // // install cargo generate ??
  // // await runCommand('install-cargo-generate', goToProjectFolder);

  //  use cargo generate
  await runCommand('cargo-generate-test', goToContractFolder);

  // show the tree after using cargo generate
  await runCommand('cargo-test-tree', goToContractFolder);

  // code for the test harness
  await modifyFile(
    'test-harness',
    TEST_CONTRACT_TEST_PATH,
    37,
    [37, 38, 39, 40, 41, 42]
  );

  // the test harness is run and checked in the CI already
  // this will just compare the files to make sure they are the same
  await compareFiles(TEST_CONTRACT_TEST_PATH, ACTUAL_CONTRACT_TEST_PATH);
});

function setupFolders() {
  if (!fs.existsSync('guides-testing')) {
    fs.mkdirSync('guides-testing');
  }

  if (fs.existsSync('guides-testing/fuel-project')) {
    fs.rmSync('guides-testing/fuel-project', { recursive: true, force: true });
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
