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
  './docs/fuel-graphql-docs',
  './docs/nightly/fuel-graphql-docs',
  './docs/fuel-core',
  './docs/sway-libs',
  './docs/nightly/sway-libs',
  './docs/sway-standards',
  './docs/nightly/sway-standards',
  './docs/sway-by-example-lib',
  './docs/nightly/sway-by-example-lib',
  './docs/migrations-and-disclosures',
  './docs/nightly/migrations-and-disclosures',
  './docs/fuel-book',
  './docs/nightly/fuel-book',
  './docs/verified-addresses',
  './docs/nightly/verified-addresses',
  './docs/integration-docs',
  './docs/nightly/integration-docs',
];

// Exclusions for each type of directory
const exclusions = {
  sway: [
    'sway/Cargo.toml',
    'sway/forc-pkg',
    'sway/sway-lib-std',
    'sway/docs/book/src',
    'sway/examples',
    'sway/master/book',
    'sway/test/src/sdk-harness/test_projects/run_external_proxy',
    'sway/test/src/sdk-harness/test_projects/run_external_target',
  ],
  sway_libs: ['sway-libs/docs', 'sway-libs/examples', 'sway-libs/Cargo.toml'],
  sway_standards: [
    'sway-standards/docs',
    'sway-standards/examples',
    'sway-standards/Cargo.toml',
  ],
  sway_by_example_lib: [
    'sway-by-example-lib/docs',
    'sway-by-example-lib/examples',
  ],
  fuels_rs: [
    'fuels-rs/Cargo.toml',
    'fuels-rs/docs',
    'fuels-rs/examples',
    'fuels-rs/packages',
    'fuels-rs/e2e',
  ],
  fuels_ts: [
    'fuels-ts/apps',
    'fuels-ts/packages',
    'fuels-ts/package.json',
    'fuels-ts/demo-wallet-sdk-react',
  ],
  fuels_wallet: ['fuels-wallet/package.json', 'fuels-wallet/packages'],
  fuel_core: ['fuel-core/deployment', 'fuel-core/bin', 'fuel-core/Cargo.toml'],
  fuel_graphql_docs: [
    'fuel-graphql-docs/docs',
    'fuel-graphql-docs/examples',
    'fuel-graphql-docs/src',
  ],
  migrations_and_disclosures: ['migrations-and-disclosures/docs'],
  fuel_book: ['fuel-book/docs'],
  verified_addresses: ['verified-addresses/docs'],
  integration_docs: ['integration-docs/docs'],
};

function main() {
  for (const targetDir of targetDirs) {
    if (!fs.existsSync(targetDir)) {
      //   console.log(`Directory ${targetDir} does not exist!`);
      const basePath = process.cwd();
      //   console.log(`Current directory: ${basePath}`);
      return;
    }
    // Change to the target directory
    process.chdir(targetDir);
    const dirBasename = path.basename(targetDir).replace(/-/g, '_');
    const currentExclusions = exclusions[dirBasename];
    cleanupFiles(currentExclusions, '.');
    // console.log(`Cleanup done for ${targetDir}!`);
    // Return to the original directory
    let x = '../..';
    if (process.cwd().includes('nightly')) {
      x = `${x}/..`;
    }
    if (process.cwd().includes('builds')) {
      x = `${x}/..`;
    }
    process.chdir(path.resolve(process.cwd(), x));
  }
}

function cleanupFiles(currentExclusions, dirPath) {
  // Read all items in directory
  fs.readdirSync(dirPath).forEach((item) => {
    let shouldDelete = true;
    const basePath = process.cwd().split('/docs/')[1];
    const thisFilePath = path
      .join(basePath, dirPath, item)
      .replace('builds/', '')
      .replace('nightly/', '');
    const subFilePath = `./${thisFilePath.split('/').slice(1).join('/')}`;

    if (currentExclusions?.includes(thisFilePath)) {
      shouldDelete = false;
      //   console.log('Excluding: ', thisFilePath);
    } else if (
      fs.existsSync(subFilePath) &&
      fs.lstatSync(subFilePath).isDirectory()
    ) {
      shouldDelete = false;
      cleanupFiles(currentExclusions, subFilePath);
    }

    deleteFolder(shouldDelete, subFilePath);
  });
}

function deleteFolder(shouldDelete, subFilePath) {
  if (shouldDelete) {
    // console.log('DELETING: ', subFilePath);
    fs.rmSync(subFilePath, { recursive: true, force: true });
  }
}

main();
