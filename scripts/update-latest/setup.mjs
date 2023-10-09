import {
  updateSubmodule,
  setupUser,
  switchToExistingBranch,
  fetchBranch,
} from './gitUtils.mjs';

export async function setup() {
  // setup git
  await setupUser();

  // checkout the latest gh-pages branch of fuelup
  const fuelupFolder = 'docs/latest/fuelup';
  const publishBranch = 'gh-pages';
  await updateSubmodule(fuelupFolder);
  console.log('UPDATED FUELUP SUBMODLE');
  await fetchBranch(publishBranch, fuelupFolder);
  console.log(`FETCHED ${publishBranch} BRANCH`);
  await switchToExistingBranch(publishBranch, fuelupFolder);
  console.log(`SWITCHED TO ${publishBranch} BRANCH`);
}
