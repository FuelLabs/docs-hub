import {
  switchToNewBranch,
  updateSubmodule,
  checkoutVersion,
  checkDiff,
  commitAll,
  push,
  createPR,
  fetchTag,
  fetchBranch,
  checkoutBranch,
} from './gitUtils.mjs';

export async function updateNightly(newVersions) {
  // create a new branch of docs-hub
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const branchName = `ci/nightly-update-${formattedDate}`;
  await switchToNewBranch(branchName);

  // update nightly submodules
  console.log('UPDATING SUBMODULES', newVersions);
  await updateSubmodules(newVersions);

  // check if there are any differences
  // if yes, commit the changes and create a PR
  const isDifferent = await checkDiff();
  console.log('IS DIFFERENT:', isDifferent);
  if (isDifferent) {
    const title = 'chore: update nightly docs';

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
    'docs/nightly/fuel-specs',
    'docs/nightly/fuel-graphql-docs',
    'docs/guides/docs/migration-guide/breaking-change-log',
  ];
  await Promise.all(
    updateRegardless.map(async (sub) => {
      console.log('UPDATING SUB:', sub);
      await updateSubmodule(sub);
    })
  );

  // update versions branches if new for sway, indexer, fuelup, fuels-rs, & fuels-ts
  if (newVersions) {
    console.log('GOING TO UPDATE NIGHTLY TOOLCHAIN VERSIONS');
    await Promise.all(
      Object.keys(newVersions).map(async (key) => {
        console.log('UPDATING SUB:', key);
        const version = `v${newVersions[key]}`;
        console.log('NEW VERSION:', version);
        let submoduleName;
        let branch;
        switch (key) {
          case 'forc':
            submoduleName = 'docs/nightly/sway';
            await update(version, 'docs/nightly/builds/sway', 'gh-pages');
            break;
          case 'indexer':
            submoduleName = 'docs/nightly/fuel-indexer';
            break;
          case 'rust':
            submoduleName = 'docs/nightly/fuels-rs';
            break;
          case 'ts':
            submoduleName = 'docs/nightly/fuels-ts';
            branch = 'docs';
            break;
          case 'wallet':
            submoduleName = 'docs/nightly/fuels-wallet';
            break;
          case 'fuelup':
            submoduleName = 'docs/nightly/fuelup';
            break;
          default:
        }
        await update(version, submoduleName, branch);
      })
    );
  }
}

// use the nightly commit on the docs branch of fuels-ts
export async function update(version, dir, branch) {
  await updateSubmodule(dir);
  if (dir !== 'docs/nightly/fuels-ts') {
    await fetchTag(version, dir);
    await checkoutVersion(version, dir);
  }
  if (branch) {
    await fetchBranch(branch, dir);
    await checkoutBranch(branch, dir);
  }
}
