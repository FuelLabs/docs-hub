import { getExistingVersions, getLatestVersions } from './versions.mjs';

export async function checkIfLatestIsNew() {
  let updatedVersions = null;
  const existingVersions = getExistingVersions();
  const latestVersions = await getLatestVersions();
  updatedVersions = checkIfVersionsAreDifferent(
    existingVersions,
    latestVersions
  );
  return updatedVersions;
}

function checkIfVersionsAreDifferent(existingVersions, latestVersions) {
  console.log('LATEST VERSIONS:', latestVersions);
  console.log('EXISTING VERSIONS:', existingVersions);
  let newVersions = null;
  for (const key of Object.keys(existingVersions)) {
    if (existingVersions[key] !== latestVersions[key]) {
      console.log(
        'DIFFERENT VERSIONS:',
        key,
        existingVersions[key],
        '-->',
        latestVersions[key]
      );
      if (!newVersions) {
        newVersions = {};
      }
      newVersions[key] = latestVersions[key];
    }
  }
  return newVersions;
}
