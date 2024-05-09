import fs from 'fs';
import path from 'path';

// List of directories to delete unused files from
const targetDirs = [
  './docs/sway',
  './docs/nightly/sway',
  './docs/builds/sway',
  './docs/nightly/builds/sway',
  './docs/fuels-rs',
  './docs/nightly/fuels-rs',
  './docs/fuels-ts',
  './docs/nightly/fuels-ts',
  './docs/fuels-wallet',
  './docs/nightly/fuels-wallet',
];

// Exclusions for each type of directory
const exclusions = {
  sway: [
    'sway/Cargo.toml',
    'sway/forc-pkg',
    'sway/sway-lib-std',
    'sway/docs/book/src',
    'sway/examples',
    'sway/master',
    'sway/test/src/sdk-harness/test_projects/run_external_proxy',
  ],
  fuels_rs: [
    'fuels-rs/Cargo.toml',
    'fuels-rs/docs',
    'fuels-rs/examples',
    'fuels-rs/packages',
  ],
  fuels_ts: [
    'fuels-ts/apps',
    'fuels-ts/packages',
    'fuels-ts/package.json',
    'fuels-ts/demo-wallet-sdk-react',
  ],
  fuels_wallet: ['fuels-wallet/package.json', 'fuels-wallet/packages'],
};

function main() {
  for (const targetDir of targetDirs) {
    if (!fs.existsSync(targetDir)) {
      return;
    }
    // Change to the target directory
    process.chdir(targetDir);
    const dirBasename = path.basename(targetDir).replace(/-/g, '_');
    const currentExclusions = exclusions[dirBasename];
    cleanupFiles(currentExclusions, '.');
    console.log(`Cleanup done for ${targetDir}!`);
    // Return to the original directory
    process.chdir(path.resolve(process.cwd(), '..'));
  }
}

function cleanupFiles(currentExclusions, dirPath) {
  // Read all items in directory
  fs.readdirSync(dirPath).forEach((item) => {
    let shouldDelete = true;
    const basePath = process.cwd().split('/docs/')[1];
    const thisFilePath = path
      .join(basePath, dirPath, item)
      .replace('nightly/', '');
    const subFilePath = `./${thisFilePath.split('/').slice(1).join('/')}`;

    if (currentExclusions?.includes(thisFilePath)) {
      shouldDelete = false;
      console.log('Excluding: ', thisFilePath);
    } else if (
      fs.existsSync(subFilePath) &&
      fs.lstatSync(subFilePath).isDirectory()
    ) {
      cleanupFiles(currentExclusions, subFilePath);
    }

    deleteFolder(shouldDelete, subFilePath);
  });
}

function deleteFolder(shouldDelete, subFilePath) {
  if (shouldDelete) {
    fs.rmSync(subFilePath, { recursive: true, force: true });
  }
}

main();
