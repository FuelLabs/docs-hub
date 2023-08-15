import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import { EOL } from 'os';
import { join } from 'path';

interface Instruction {
  text: string;
  output: string;
}

const quickstarTestConfig = JSON.parse(
  fs.readFileSync(
    join(process.cwd(), '/tests/quickstart-contract.json'),
    'utf8'
  )
);

let thisPage: Page | null;

test('test quickstart contract', async ({ page, context }) => {
  thisPage = page;
  await page.goto(`http://localhost:3000/${quickstarTestConfig.start_url}`);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await setupFolders(quickstarTestConfig.project_folder);

  for (const step of quickstarTestConfig.steps) {
    switch (step.action) {
      case 'runCommand':
        if (step.inputs.length === 1) {
          await runCommand(step.inputs[0]);
        } else {
          await runCommand(step.inputs[0], step.inputs[1]);
        }
        break;
      case 'compareFiles':
        await compareFiles(step.inputs[0], step.inputs[1]);
        break;
      case 'compareToFile':
        await compareToFile(step.inputs[0], step.inputs[1]);
        break;
      case 'writeToFile':
        await writeToFile(step.inputs[0], step.inputs[1]);
        break;
      case 'modifyFile':
        if (step.inputs.length === 2) {
          await modifyFile(step.inputs[0], step.inputs[1]);
        } else if (step.inputs.length === 3) {
          await modifyFile(step.inputs[0], step.inputs[1], step.inputs[2]);
        } else {
          await modifyFile(
            step.inputs[0],
            step.inputs[1],
            step.inputs[2],
            step.inputs[3]
          );
        }
        break;
    }
  }
});

async function clickCopyButton(id: string) {
  let clipboardText = { text: '', output: '' };
  const selector = `#${id} + div > div > div > button[aria-label="Copy to Clipboard"]`;
  await thisPage!.locator(selector).click();
  const rawText: string = await thisPage!.evaluate(
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
