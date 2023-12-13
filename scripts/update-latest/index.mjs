import { checkIfNightlyIsNew } from './checkNightly.mjs';
import { setup } from './setup.mjs';
import { updateNightly } from './updateNightly.mjs';

main();

async function main() {
  await setup();
  console.log('GETTING NEW VERSIONS');
  const newVersions = await checkIfNightlyIsNew();
  console.log('GOT NEW VERSIONS', newVersions);
  await updateNightly(newVersions);
}
