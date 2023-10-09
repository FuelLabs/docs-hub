import fs from 'fs';
import { join } from 'path';

import { getExistingVersions, getLatestVersions } from './versions.mjs';

export async function checkIfLatestIsNew() {
  const dir = 'docs/latest/fuelup/channels/latest';
  const latestFileName = getMostRecentFile(dir);
  let updatedVersions = null;
  if (latestFileName) {
    const existingVersions = getExistingVersions();
    const latestVersions = await getLatestVersions(latestFileName, dir);
    updatedVersions = checkIfVersionsAreDifferent(
      existingVersions,
      latestVersions
    );
  } else {
    console.log('Not able to find latest file.');
  }
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

function getMostRecentFile(dir) {
  const files = fs.readdirSync(dir);

  let latestFileName;
  let latestDate = new Date(0);
  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      // Extract date from the filename
      const dateMatch = file.match(/\d{4}-\d{2}-\d{2}/);
      if (dateMatch) {
        const fileDate = new Date(dateMatch[0]);
        if (fileDate > latestDate) {
          latestFileName = file;
          latestDate = fileDate;
        }
      }
    }
  });

  return latestFileName;
}
