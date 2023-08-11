import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import { EOL } from 'os';

interface Instruction {
  text: string;
  output: string;
}

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

  async function appendToFile(buttonName: string, filePath: string) {
    const content = await clickCopyButton(buttonName);
    fs.appendFileSync(filePath, content.text + '\n\n');
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

  // TODO: use this in the CI
  // get the default toolchain command
  // const setDefaultFuelupToolchain = await clickCopyButton(
  //   'set-default-fuelup-toolchain'
  // );

  setupFolders();

  // get the command to make a new folder
  const createProjectFolder = await clickCopyButton('create-project-folder');
  const goToTestingFolder = 'cd guides-testing && ';
  const goToProjectFolder = 'cd guides-testing/fuel-project && ';
  const goToContractFolder =
    'cd guides-testing/fuel-project/counter-contract && ';

  execSync(goToTestingFolder + createProjectFolder.text, {
    encoding: 'utf-8',
  });

  // get the command to make a new forc project
  await runCommand('create-contract', goToTestingFolder);

  // get the command to show the contract tree
  await runCommand('contract-tree', goToProjectFolder);

  const CONTRACT_PATH =
    'guides-testing/fuel-project/counter-contract/src/main.sw';

  // add part 1 to contract
  await writeToFile('program-type', CONTRACT_PATH);
  // add part 2 to contract
  await appendToFile('storage', CONTRACT_PATH);
  // add part 3 to contract
  await appendToFile('abi', CONTRACT_PATH);
  //  add part 4 to contract
  await appendToFile('impl', CONTRACT_PATH);

  // check the whole contract
  await compareToFile('entire-contract', CONTRACT_PATH);

  // // build the contract
  // await runCommand('build-contract', goToContractFolder);

  // // built contract tree
  // await runCommand('built-contract-tree', goToContractFolder);

  // // command to show install cargo generate
  // const installCargoGen = await clickCopyButton('install-cargo-generate');
  // print('INSTALL CARGO GENERATE', installCargoGen);

  // // command to use cargo generate
  // const useCargoGen = await clickCopyButton('cargo-generate-test');
  // print('CARGO GENERATE TEST', useCargoGen);

  // // command to show the tree after using cargo generate
  // const cargoTestTree = await clickCopyButton('cargo-test-tree');
  // print('CARGO GENERATE TREE', cargoTestTree);

  // // code for the test harness
  // const testHarnessCode = await clickCopyButton('test-harness');
  // print('TEST HARNESS CODE', testHarnessCode);

  // // command to run the cargo test
  // const runCargoTest = await clickCopyButton('run-cargo-test');
  // print('RUN TEST HARNESS', runCargoTest);
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
  const split1 = expected.trim().split(EOL);
  const split2 = actual.trim().split(EOL);
  expect(split1.length === split2.length).toBeTruthy();
  split1.forEach((line, i) => {
    const trimmedLineA = line.trim().replace(/\u00A0/g, ' ');
    const trimmedLineB = split2[i].trim().replace(/\u00A0/g, ' ');
    expect(trimmedLineA).toEqual(trimmedLineB);
  });
}
