import {
  updateSubmodule,
  setupUser,
  switchToExistingBranch,
} from './gitUtils.mjs';

export async function setup() {
  // setup git
  await setupUser();

  // checkout the latest gh-pages branch of fuelup
  const fuelupFolder = 'docs/latest/fuelup';
  await updateSubmodule(fuelupFolder);
  console.log('UPDATED FUELUP SUBMODLE');
  await switchToExistingBranch('gh-pages', fuelupFolder);
  console.log('SWITCHED TO GH-PAGES BRANCH');
}
