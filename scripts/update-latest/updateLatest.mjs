import {
  switchToNewBranch,
  switchToExistingBranch,
  updateSubmodule,
  checkoutVersion,
  checkDiff,
  commitAll,
  push,
  createPR,
  fetchTag,
  fetchBranch,
  getVersionCommit,
  gitResetCommit,
} from './gitUtils.mjs';

export async function updateLatest(newVersions) {
  // fuelup checkout master
  await switchToExistingBranch('master', 'docs/latest/fuelup');

  // create a new branch of docs-hub
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const branchName = `ci/latest-update-${formattedDate}`;
  await switchToNewBranch(branchName);

  // update latest submodules
  console.log('UPDATING SUBMODULES', newVersions);
  await updateSubmodules(newVersions);

  // check if there are any differences
  // if yes, commit the changes and create a PR
  const isDifferent = await checkDiff();
  console.log('IS DIFFERENT:', isDifferent);
  if (isDifferent) {
    const title = 'chore: update latest docs';

    // add changes & commit
    await commitAll(title);

    // push branch & open PR
    await push(branchName);
    await createPR(title, branchName);
  }
}

async function updateSubmodules(newVersions) {
  // update everything that doesn't have a version
  const updateRegardless = [
    'docs/latest/fuel-specs',
    'docs/latest/fuel-graphql-docs',
    'docs/latest/fuelup',
    'docs/guides/docs/migration-guide/breaking-change-log',
  ];
  console.log('GOING TO UPDATE REGARDLESS');
  await Promise.all(
    updateRegardless.map(async (sub) => {
      console.log('UPDATING SUB:', sub);
      await updateSubmodule(sub);
    })
  );

  // update versions branches if new for sway, indexer, fuels-rs, & fuels-ts
  if (newVersions) {
    console.log('GOING TO UPDATE LATEST TOOLCHAIN VERSIONS');
    await Promise.all(
      Object.keys(newVersions).map(async (key) => {
        console.log('UPDATING SUB:', key);
        const version = `v${newVersions[key]}`;
        console.log('NEW VERSION:', version);
        let submoduleName;
        let branch;
        switch (key) {
          case 'forc':
            submoduleName = 'docs/latest/sway';
            await update(version, 'docs/latest/builds/sway', 'gh-pages');
            break;
          case 'indexer':
            submoduleName = 'docs/latest/fuel-indexer';
            break;
          case 'rust':
            submoduleName = 'docs/latest/fuels-rs';
            break;
          case 'ts':
            submoduleName = 'docs/latest/fuels-ts';
            branch = 'docs';
            break;
          case 'wallet':
            submoduleName = 'docs/latest/fuels-wallet';
            break;
          default:
        }
        await update(version, submoduleName, branch);
      })
    );
  }
}

// use the latest commit on the docs branch of fuels-ts
export async function update(version, dir, branch) {
  await updateSubmodule(dir);
  if (dir !== 'docs/latest/fuels-ts') {
    await fetchTag(version, dir);
    await checkoutVersion(version, dir);
  }
  if (branch) {
    let releaseCommit;
    if (dir !== 'docs/latest/fuels-ts') {
      releaseCommit = await getVersionCommit(version, dir);
    }
    await fetchBranch(branch, dir);
    await switchToExistingBranch(branch, dir);
    if (dir !== 'docs/latest/fuels-ts') {
      // go to the version commit in the right branch;
      await gitResetCommit(releaseCommit, dir);
    }
  }
}
