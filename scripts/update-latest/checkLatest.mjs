import { getExistingVersions, getNightlyVersions } from './versions.mjs';

export async function checkIfNightlyIsNew() {
  let updatedVersions = null;
  const existingVersions = getExistingVersions();
  const nightlyVersions = await getNightlyVersions();
  updatedVersions = checkIfVersionsAreDifferent(
    existingVersions,
    nightlyVersions
  );
  return updatedVersions;
}

function checkIfVersionsAreDifferent(existingVersions, nightlyVersions) {
  console.log('NIGHTLY VERSIONS:', nightlyVersions);
  console.log('EXISTING VERSIONS:', existingVersions);
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
