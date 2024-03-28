import { checkDefault } from './checkDefault.mjs';
import { checkIfNightlyIsNew } from './checkNightly.mjs';
import { createNewBranch, setupUser } from './gitUtils.mjs';
import { handleNewPR, updateSubmodules } from './updateSubmodules.mjs';
import { getExistingVersions } from './versions.mjs';

main();

async function main() {
  const isWorkflow = process.argv.includes('--from-workflow');
  const isNightly = process.argv.includes('--nightly');

  let branchName = null;
  let newDefaultVersions = null;
  const existingVersions = getExistingVersions();
  console.log('EXISTING VERSIONS:', existingVersions);

  if (isWorkflow) {
    console.log('SETTING UP GIT USER');
    await setupUser();
  }

  if (!isNightly) {
    newDefaultVersions = await checkDefault(existingVersions.default);
  }

  const newNightlyVersions = await checkIfNightlyIsNew(
    existingVersions.nightly
  );

  if (isWorkflow) {
    // create a new branch of docs-hub
    console.log('CREATING A NEW BRANCH');
    branchName = await createNewBranch(isNightly);
  }

  await updateSubmodules(newDefaultVersions, newNightlyVersions);

  if (isWorkflow) {
    // create a new PR
    console.log('CREATING A NEW PR');
    await handleNewPR(branchName, isNightly);
  }
}
