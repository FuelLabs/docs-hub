import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import { EOL } from 'os';

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
  // const createProjectFolder = await clickCopyButton('create-project-folder');
  // // print('MAKE NEW DIR', createProjectFolder);

  // if (!fs.existsSync('guides-testing')) {
  //   fs.mkdirSync('guides-testing');
  // }

  // const goToTestingFolder = 'cd guides-testing && ';
  const goToProjectFolder = 'cd guides-testing/fuel-project && ';
  // const goToContractFolder =
  //   'cd guides-testing/fuel-project/counter-contract && ';

  // execSync(goToTestingFolder + createProjectFolder.text, {
  //   encoding: 'utf-8',
  // });

  // // get the command to make a new forc project
  // const createContract = await clickCopyButton('create-contract');
  // // print('MAKE NEW CONTRACT', createContract);

  // const createContractOutput = execSync(
  //   goToTestingFolder + createContract.text,
  //   {
  //     encoding: 'utf-8',
  //   }
  // );
  // if (createContract.output !== '') {
  //   expect(createContractOutput === createContract.output).toBeTruthy();
  // }

  // get the command to show the contract tree
  const contractTree = await clickCopyButton('contract-tree');
  // print('TREE', contractTree);
  const contractTreeCommand = goToProjectFolder + contractTree.text;
  // console.log(contractTreeCommand);
  const contractTreeOutput = execSync(contractTreeCommand, {
    encoding: 'utf-8',
  });
  // console.log('contractTree.text', contractTree.text);
  // console.log('createContract.output', createContract.output);
  const first = contractTreeOutput.trim();
  const second = contractTree.output.trim();
  console.log(first);
  console.log(second);
  console.log('all equal1?', first === second);
  console.log('all equal2?', first == second);
  const split1 = first.split(EOL);
  const split2 = second.split(EOL);
  console.log('split1.length', split1.length);
  console.log('split2.length', split2.length);
  if (split1.length === split2.length) {
    split1.forEach((l, i) => {
      console.log('--------------');
      console.log('A: ', `"${l}"`);
      console.log('B: ', `"${split2[i]}"`);
      // console.log('equal1?', l === split2[i]);
      // console.log('equal2?', l == split2[i]);
      if (l != split2[i]) {
        console.log('LENGTH A', l.length);
        console.log('LENGTH B', split2[i].length);
      }
      console.log('--------------');
    });
  }

  // expect(contractTreeOutput === contractTree.output).toBeTruthy();

  // const CONTRACT_PATH =
  //   'guides-testing/fuel-project/counter-contract/src/main.sw';
  // // get part 1 of the contract
  // const contractPart1 = await clickCopyButton('program-type');
  // fs.writeFileSync(CONTRACT_PATH, contractPart1.text + '\n\n');
  // // // print('CONTRACT PART 1', contractPart1);

  // // // get part 2 of the contract
  // const contractPart2 = await clickCopyButton('storage');
  // // // print('CONTRACT PART 2', contractPart2);
  // fs.appendFileSync(CONTRACT_PATH, contractPart2.text + '\n\n');

  // // get part 3 of the contract
  // const contractPart3 = await clickCopyButton('abi');
  // // print('CONTRACT PART 3', contractPart3);
  // fs.appendFileSync(CONTRACT_PATH, contractPart3.text + '\n\n');

  // // get part 4 of the contract
  // const contractPart4 = await clickCopyButton('impl');
  // // print('CONTRACT PART 4', contractPart4);
  // fs.appendFileSync(CONTRACT_PATH, contractPart4.text + '\n');

  // // get the whole contract
  // const entireContract = await clickCopyButton('entire-contract');
  // const newContract = fs.readFileSync(CONTRACT_PATH, { encoding: 'utf8' });
  // console.log('newContract', newContract);
  // console.log('entireContract.text', entireContract.text);
  // expect(newContract === entireContract.text).toBeTruthy();
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

// function compareOutputs(expected: string, actual: string){
//   const split1 = expected.split(EOL);
//   const split2 = actual.split(EOL);
//   const bigger = split1.length >= split2.length ? split1 : split2;
//   const smaller = bigger === split1 ? split1 : split2;
//   bigger.forEach((line, i) => {
//     console.log("smaller[i]: ", smaller[i])
//     if(smaller[i] !== undefined){
//       assert(line === smaller[i])
//     }
//   })
// }
