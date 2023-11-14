import type { Page } from '@playwright/test';

import { expect } from './fixtures';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let saved: any[] = [];

export function checkIncrementAndReset(
  initialIndex: number,
  finalIndex: number
) {
  console.log('INITIAL Index:', initialIndex);
  console.log('FINAL Index:', finalIndex);
  const savedInitial = saved[initialIndex];
  const savedFinal = saved[finalIndex];
  const initial: number = parseInt(savedInitial);
  const final: number = parseInt(savedFinal);
  console.log('INITIAL:', initial);
  console.log('FINAL:', final);
  const isIncremented = final === initial + 1;
  saved.length = 0;
  expect(isIncremented).toBeTruthy();
}

export async function getByLocator(
  page: Page,
  locator: string,
  removeFromValue: string
) {
  const locatorVals = await page.locator(locator).allInnerTexts();
  let locatorVal = locatorVals[0];
  if (removeFromValue) {
    locatorVal = locatorVal.replace(removeFromValue, '');
  }
  saved.push(locatorVal);
  console.log('SAVED:', saved);
}
