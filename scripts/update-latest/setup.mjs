import { updateSubmodule, setupUser } from './gitUtils.mjs';

export async function setup() {
  // setup git
  await setupUser();

  // checkout the nightly gh-pages branch of fuelup
  const fuelupFolder = 'docs/nightly/fuelup';
  await updateSubmodule(fuelupFolder);
  console.log('UPDATED FUELUP SUBMODLE');
}
