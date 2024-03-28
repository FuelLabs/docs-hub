import type { Page } from '@playwright/test';

import { expect } from './fixtures';

// biome-ignore lint/suspicious/noExplicitAny:
let saved: any[] = [];

export function checkIfIsIncremented(initialIndex: number, finalIndex: number) {
  console.log('INITIAL Index:', initialIndex);
  console.log('FINAL Index:', finalIndex);
  const savedInitial = saved[initialIndex];
  const savedFinal = saved[finalIndex];
  const initial: number = Number.parseInt(savedInitial);
  const final: number = Number.parseInt(savedFinal);
  console.log('INITIAL:', initial);
  console.log('FINAL:', final);
  const isIncremented = final === initial + 1;
  saved = [];
  expect(isIncremented).toBeTruthy();
}

export function checkValue(index: number, value: string) {
  console.log('INDEX:', index);
  console.log('EXPECTED VALUE:', value);
  const savedValue = saved[index];
  console.log('ACTUAL VALUE:', savedValue);
  expect(savedValue).toEqual(value);
}

export async function getByLocator(
  page: Page,
  locator: string,
  removeFromValue: string | null | undefined
) {
  const locatorVals = await page.locator(locator).allInnerTexts();
  let locatorVal = locatorVals[0];
  if (removeFromValue) {
    locatorVal = locatorVal.replace(removeFromValue, '');
  }
  saved.push(locatorVal);
  console.log('SAVED:', saved);
}
