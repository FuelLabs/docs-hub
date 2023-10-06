import { checkIfLatestIsNew } from './checkLatest.mjs';
import { setup } from './setup.mjs';
import { updateLatest } from './updateLatest.mjs';

main();

async function main() {
  await setup();
  console.log('GETTING NEW VERSIONS');
  const newVersions = await checkIfLatestIsNew();
  console.log('GOT NEW VERSIONS', newVersions);
  await updateLatest(newVersions);
}
