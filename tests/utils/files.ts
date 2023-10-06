import type { Page } from '@playwright/test';
import fs from 'fs';

import { clickCopyButton } from './button';
import { compareOutputs } from './runCommand';

export async function writeToFile(
  page: Page,
  buttonName: string,
  filePath: string
) {
  const content = await clickCopyButton(page, buttonName);
  fs.writeFileSync(filePath, content.text + '\n\n');
}

export async function modifyFile(
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

export async function compareToFile(
  page: Page,
  buttonName: string,
  pathName: string
) {
  const expected = await clickCopyButton(page, buttonName);
  const actual = fs.readFileSync(pathName, { encoding: 'utf8' });
  compareOutputs(expected.text, actual);
}

export async function compareFiles(testPathName: string, refPathName: string) {
  const actual = fs.readFileSync(testPathName, { encoding: 'utf8' });
  const expected = fs.readFileSync(refPathName, { encoding: 'utf8' });
  compareOutputs(expected, actual);
}
