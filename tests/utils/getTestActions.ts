import type { Page } from '@playwright/test';

import { expect } from './fixtures';

export async function getTestActions(page: Page) {
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
  expect(testActions.length).toBeGreaterThan(0);
  return testActions;
}
