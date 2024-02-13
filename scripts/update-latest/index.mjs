import { checkIfNightlyIsNew } from './checkNightly.mjs';
import { setupUser } from './gitUtils.mjs';
// import { updateNightly } from './updateNightly.mjs';

main();

async function main() {
  if (process.argv.includes('--setup-git-user')) {
    await setupUser();
  }

  if (process.argv.includes('--nightly')) {
    console.log('GETTING NEW VERSIONS');
    const newVersions = await checkIfNightlyIsNew();
    console.log('GOT NEW VERSIONS', newVersions);
    // await updateNightly(newVersions);
  }
}
