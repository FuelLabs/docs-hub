import {
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

export async function handleNewPR(branchName, isNightly) {
  // check if there are any differences
  // if yes, commit the changes and create a PR
  const isDifferent = await checkDiff();
  console.log('IS DIFFERENT:', isDifferent);
  if (isDifferent) {
    const title = `chore: update ${isNightly ? 'nightly' : 'default'} docs`;

    // add changes & commit
    await commitAll(title);

    // push branch & open PR
    await push(branchName);
    await createPR(title, branchName);
  }
}

export async function updateSubmodules(newDefaultVersions, newNightlyVersions) {
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

  if (newNightlyVersions) {
    await updateDocs(newNightlyVersions, true);
  }

  if (newDefaultVersions) {
    await updateDocs(newDefaultVersions, false);
  }
}

async function updateDocs(versions, isNightly) {
  await Promise.all(
    Object.keys(versions).map(async (key) => {
      console.log('UPDATING SUB:', key);
      const version = `v${versions[key]}`;
      console.log('NEW VERSION:', version);
      let submoduleName;
      let branch;
      switch (key) {
        case 'forc':
          submoduleName = `docs${isNightly ? '/nightly' : ''}/sway`;
          await update(
            version,
            `docs${isNightly ? '/nightly' : ''}/builds/sway`,
            'gh-pages'
          );
          break;
        case 'rust':
          submoduleName = `docs${isNightly ? '/nightly' : ''}/fuels-rs`;
          break;
        case 'ts':
          submoduleName = `docs${isNightly ? '/nightly' : ''}/fuels-ts`;
          branch = 'docs';
          break;
        case 'wallet':
          submoduleName = `docs${isNightly ? '/nightly' : ''}/fuels-wallet`;
          break;
        case 'fuelup':
          submoduleName = 'docs/fuelup';
          break;
        default:
      }
      await update(version, submoduleName, branch);
    })
  );
}

// use the nightly commit on the docs branch of fuels-ts
export async function update(version, dir, branch) {
  await updateSubmodule(dir);
  if (branch) {
    await fetchBranch(branch, dir);
    await checkoutBranch(branch, dir);
    // TODO: get old version at the branch
  } else {
    await fetchTag(version, dir);
    await checkoutVersion(version, dir);
  }
}
