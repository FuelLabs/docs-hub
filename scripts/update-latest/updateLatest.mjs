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
} from './gitUtils.mjs';

export async function updateLatest(newVersions) {
  // fuelup checkout master
  await switchToExistingBranch('master', 'docs/latest/fuelup');

  // create a new branch of docs-hub
  const date = new Date();
  const branchName = `latest-update-${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;
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
  // or has a release branch
  const updateRegardless = [
    // 'docs/latest/fuels-wallet',
    'docs/latest/fuel-specs',
    'docs/latest/fuel-graphql-docs',
    'docs/latest/fuelup',
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
        switch (key) {
          case 'forc':
            submoduleName = 'docs/latest/sway';
            await update(version, 'docs/latest/builds/sway');
            break;
          case 'indexer':
            submoduleName = 'docs/latest/fuel-indexer';
            break;
          case 'rust':
            submoduleName = 'docs/latest/fuel-rs';
            break;
          case 'ts':
            submoduleName = 'docs/latest/fuel-ts';
            break;
          default:
        }
        await update(version, submoduleName);
      })
    );
  }
}

export async function update(version, dir) {
  await updateSubmodule(dir);
  await fetchTag(version, dir);
  await checkoutVersion(version, dir);
}
