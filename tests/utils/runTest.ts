import type { BrowserContext, Page } from '@playwright/test';

import { clickByLocator, clickByLabel } from './button';
import { checkIfIsIncremented, getByLocator } from './checks';
import { compareFiles, compareToFile, writeToFile, modifyFile } from './files';
import { getTestActions } from './getTestActions';
import { runCommand } from './runCommand';
import { reload, visit } from './visit';
import { walletApprove, walletConnect } from './wallet';

export async function runTest(
  page: Page,
  context: BrowserContext,
  url: string
) {
  await visit(page, url);
  console.log('GETTING TEST ACTIONS');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const steps: any[] = await getTestActions(page);

  console.log('STARTING TEST');
  for (const step of steps) {
    console.log('STEP:', step);
    await page.waitForTimeout(1000);
    switch (step['data-name']) {
      case 'runCommand':
        if (step['data-pre-command']) {
          await runCommand(
            page,
            step.id,
            step['data-command-folder'],
            step['data-pre-command']
          );
        } else if (step['data-command-folder']) {
          await runCommand(page, step.id, step['data-command-folder']);
        } else {
          await runCommand(page, step.id);
        }
        break;
      case 'wait':
        await page.waitForTimeout(parseInt(step['data-timeout']));
        break;
      case 'reload':
        await reload(page);
        break;
      case 'goToUrl':
        await visit(page, step['data-url']);
        break;
      case 'compareFiles':
        await compareFiles(
          step['data-test-path-name'],
          step['data-ref-path-name']
        );
        break;
      case 'compareToFile':
        await compareToFile(page, step.id, step['data-filepath']);
        break;
      case 'writeToFile':
        await writeToFile(page, step.id, step['data-filepath']);
        break;
      case 'modifyFile':
        await modifyFile(
          page,
          step.id,
          step['data-filepath'],
          parseInt(step['data-add-spaces-before']),
          step['data-add-spaces-after'],
          parseInt(step['data-at-line']),
          step['data-remove-lines'],
          step['data-use-set-data']
        );
        break;
      case 'getByLocator-save':
        await getByLocator(
          page,
          step['data-locator'],
          step['data-remove-from-value']
        );
        break;
      case 'clickByRole':
        await page
          .getByRole(step['data-role'], { name: step['data-element-name'] })
          .click();
        break;
      case 'clickByTestId':
        await page.getByTestId(step['data-testid']).click();
        break;
      case 'clickByLocator':
        await clickByLocator(page, step['data-click-by-locator']);
        break;
      case 'clickByLabel':
        await clickByLabel(page, step['data-click-by-label']);
        break;
      case 'writeBySelector':
        await page.fill(step['data-selector'], 'hello world');
        break;
      case 'walletApproveConnect':
        await walletConnect(context);
        break;
      case 'walletApprove':
        await walletApprove(context);
        break;
      case 'checkIfIsIncremented':
        checkIfIsIncremented(
          parseInt(step['data-initial-index']),
          parseInt(step['data-final-index'])
        );
        break;
      default:
        console.log('STEP NOT FOUND:', step);
    }
  }
}
