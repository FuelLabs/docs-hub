import { getNightlyVersions } from './versions.mjs';

export async function checkIfNightlyIsNew(existingVersions) {
  console.log('CHECKING FOR CHANGES IN NIGHTLY VERSIONS...');
  let updatedVersions = null;
  const nightlyVersions = await getNightlyVersions();
  updatedVersions = checkIfVersionsAreDifferent(
    existingVersions,
    nightlyVersions
  );
  return updatedVersions;
}

function checkIfVersionsAreDifferent(existingVersions, nightlyVersions) {
  // console.log('NIGHTLY VERSIONS:', nightlyVersions);
  let newVersions = null;
  for (const key of Object.keys(existingVersions)) {
    if (existingVersions[key] !== nightlyVersions[key]) {
      console.log(
        'DIFFERENT VERSIONS:',
        key,
        existingVersions[key],
        '-->',
        nightlyVersions[key]
      );
      if (!newVersions) {
        newVersions = {};
      }
      newVersions[key] = nightlyVersions[key];
    }
  }
  return newVersions;
}
