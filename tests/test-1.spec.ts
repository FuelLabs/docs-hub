import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test('test dev quickstart', async ({ page, context }) => {
  interface Instruction {
    text: string;
    output: string;
  }

  function print(title: string, instruction: Instruction) {
    console.log(`---${title}---`);
    console.log('TEXT: ', instruction.text);
    if (instruction.output !== '') {
      console.log('OUTPUT: ', instruction.output);
    }
  }

  async function clickCopyButton(id: string) {
    let clipboardText = { text: '', output: '' };
    await page.locator(`#${id} + div > div > div > button`).first().click();
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

  await page.goto(
    'http://localhost:3000/guides/quickstart/building-a-smart-contract/'
  );
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  // get the default toolchain command
  // const setDefaultFuelupToolchain = await clickCopyButton(
  //   'set-default-fuelup-toolchain'
  // );
  // print('DEFAULT TOOLCHAIN COMMAND', setDefaultFuelupToolchain);
  // TODO: use this in the CI

  // get the command to make a new folder
  const createProjectFolder = await clickCopyButton('create-project-folder');
  // print('MAKE NEW DIR', createProjectFolder);

  if (!fs.existsSync('guides-testing')) {
    fs.mkdirSync('guides-testing');
  }

  const goToTestingFolder = 'cd guides-testing && ';
  const goToProjectFolder = 'cd guides-testing/fuel-project && ';
  const goToContractFolder =
    'cd guides-testing/fuel-project/counter-contract && ';

  execSync(goToTestingFolder + createProjectFolder.text, {
    encoding: 'utf-8',
  });

  // get the command to make a new forc project
  const creatContract = await clickCopyButton('create-contract');
  // print('MAKE NEW CONTRACT', creatContract);

  const createContractOutput = execSync(
    goToTestingFolder + creatContract.text,
    {
      encoding: 'utf-8',
    }
  );
  expect(createContractOutput === creatContract.output);

  // get the command to show the contract tree
  const contractTree = await clickCopyButton('contract-tree');
  // print('TREE', contractTree);
  const contractTreeOutput = execSync(goToProjectFolder + contractTree.text, {
    encoding: 'utf-8',
  });
  expect(contractTreeOutput === contractTree.output);

  const CONTRACT_PATH =
    'guides-testing/fuel-project/counter-contract/src/main.sw';
  // get part 1 of the contract
  const contractPart1 = await clickCopyButton('contract-1');
  fs.writeFileSync(CONTRACT_PATH, contractPart1.text + '\n\n');
  // print('CONTRACT PART 1', contractPart1);

  // get part 2 of the contract
  const contractPart2 = await clickCopyButton('contract-2');
  // print('CONTRACT PART 2', contractPart2);
  fs.appendFileSync(CONTRACT_PATH, contractPart2.text + '\n\n');

  // get part 3 of the contract
  const contractPart3 = await clickCopyButton('contract-3');
  // print('CONTRACT PART 3', contractPart3);
  fs.appendFileSync(CONTRACT_PATH, contractPart3.text + '\n\n');

  // get part 4 of the contract
  const contractPart4 = await clickCopyButton('contract-4');
  print('CONTRACT PART 4', contractPart4);
  fs.appendFileSync(CONTRACT_PATH, contractPart4.text + '\n');

  // // get the whole contract
  const entireContract = await clickCopyButton('contract-all');
  const newContract = fs.readFileSync(CONTRACT_PATH, { encoding: 'utf8' });
  console.log('newContract', newContract);
  console.log('entireContract.text', entireContract.text);
  console.log(newContract === entireContract.text);
  expect(newContract === entireContract.text);
  // print('CONTRACT ALL', entireContract);

  // // command to build the contract
  // const buildCommand = await clickCopyButton('build-contract');
  // print('BUILD COMMAND', buildCommand);

  // // command to show the built contract tree
  // const builtTree = await clickCopyButton('built-contract-tree');
  // print('BUILT CONTRACT TREE', builtTree);

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

  // fs.rmdirSync('guides-testing');
});

function separateCommand(text: string) {
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
