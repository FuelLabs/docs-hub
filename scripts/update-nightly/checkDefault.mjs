import { readFileSync } from 'fs';
import { join } from 'path';

export async function checkDefault(existingVersions) {
  console.log('CHECKING FOR CHANGES IN DEFAULT VERSIONS...');
  let newDefaultVersions = null;
  const versionConfigFile = readFileSync(
    join(process.cwd(), 'src/config/versions.json'),
    'utf-8',
  );
  const versionConfig = JSON.parse(versionConfigFile);
  Object.keys(existingVersions).forEach((key) => {
    const isSame = existingVersions[key] === versionConfig.default[key];
    if (!isSame) {
      console.log('DIFFERENT VERSION FOUND FOR', key);
      console.log('Version:', existingVersions[key]);
      if (!newDefaultVersions) {
        newDefaultVersions = {};
      }
      newDefaultVersions[key] = versionConfig.default[key];
    }
  });

  return newDefaultVersions;
}
