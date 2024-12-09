import { execSync } from 'child_process';
import fs from 'fs';
import { EOL } from 'os';
import type { Page } from '@playwright/test';

import { clickCopyButton } from './button';
import { expect } from './fixtures';

export async function runCommand(
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
    const projectPath = `guides-testing/${goToFolder}`;
    if (fs.existsSync(projectPath)) {
      console.log(`Directory ${projectPath} already exists. Deleting...`);
      await fs.promises.rm(projectPath, {
        recursive: true,
        force: true,
      });
    }
    command = `cd ${goToFolder} && ${command}`;
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

export function compareOutputs(expected: string, actual: string) {
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
