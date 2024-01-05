import { checkIfNightlyIsNew } from './checkNightly.mjs';
import { setupUser } from './gitUtils.mjs';
import { updateNightly } from './updateNightly.mjs';

main();

async function main() {
  await setupUser();
  console.log('GETTING NEW VERSIONS');
  const newVersions = await checkIfNightlyIsNew();
  console.log('GOT NEW VERSIONS', newVersions);
  await updateNightly(newVersions);
}
