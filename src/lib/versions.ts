import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import toml from 'toml';

import { DOCS_DIRECTORY, LATEST_DOCS_DIRECTORY } from '../config/constants';

async function itemFromPackageJson(docsDir: string, filename: string) {
  const file = await fs.readFile(join(docsDir, filename), 'utf-8');
  const json = JSON.parse(file);
  return json;
}

async function getWalletVersion(docsDir: string) {
  const { homepage } = await itemFromPackageJson(
    docsDir,
    'fuels-wallet/package.json'
  );
  const json = await itemFromPackageJson(
    docsDir,
    'fuels-wallet/packages/sdk/package.json'
  );
  return {
    name: 'fuels-wallet',
    version: json.version,
    category: 'Wallet',
    url: homepage,
  };
}

async function getTSSDKVersion(docsDir: string) {
  const { homepage } = await itemFromPackageJson(
    docsDir,
    'fuels-ts/package.json'
  );
  const json = await itemFromPackageJson(
    docsDir,
    'fuels-ts/packages/fuels/package.json'
  );
  return {
    name: 'fuels-ts',
    version: json.version,
    category: 'TypeScript SDK',
    url: homepage,
  };
}

async function getRustSDKVersion(docsDir: string) {
  const filedir = join(docsDir, 'fuels-rs/Cargo.toml');
  const file = await fs.readFile(filedir, 'utf-8');
  const tomfile = toml.parse(file);
  return {
    name: 'fuels-rs',
    category: 'Rust SDK',
    version: tomfile.workspace.package.version,
    url: tomfile.workspace.package.repository,
  };
}

async function getFuelupVersion(docsDir: string) {
  const filedir = join(docsDir, 'fuelup/Cargo.toml');
  const file = await fs.readFile(filedir, 'utf-8');
  const tomfile = toml.parse(file);

  return {
    name: 'fuelup',
    category: 'Fuelup',
    version: tomfile.package.version,
    url: tomfile.package.repository,
  };
}

async function getForcVersion(docsDir: string) {
  const swayfile = join(docsDir, 'sway/Cargo.toml');
  const file = await fs.readFile(swayfile, 'utf-8');
  const swaitomfile = toml.parse(file);
  const forcfiledir = join(docsDir, 'sway/forc-pkg/Cargo.toml');
  const forcfile = await fs.readFile(forcfiledir, 'utf-8');
  const version = forcfile?.match(/version = "(.*)"/)?.[1];

  return {
    name: 'forc',
    category: 'Forc',
    version,
    url: swaitomfile.workspace.package.repository,
  };
}

async function getIndexerVersion(docsDir: string) {
  const filedir = join(docsDir, 'fuel-indexer/Cargo.toml');
  const file = await fs.readFile(filedir, 'utf-8');
  const tomfile = toml.parse(file);
  return {
    name: 'fuel-indexer',
    category: 'Indexer',
    version: tomfile.workspace.package.version,
    url: tomfile.workspace.package.repository,
  };
}

export async function getVersions(isLatest: boolean) {
  const docsDir = isLatest ? LATEST_DOCS_DIRECTORY : DOCS_DIRECTORY;
  const wallet = await getWalletVersion(docsDir);
  const tsSDK = await getTSSDKVersion(docsDir);
  const rust = await getRustSDKVersion(docsDir);
  const fuelup = await getFuelupVersion(docsDir);
  const forc = await getForcVersion(docsDir);
  const indexer = await getIndexerVersion(docsDir);

  return {
    Forc: forc,
    Sway: forc,
    Fuelup: fuelup,
    'Fuel Indexer': indexer,
    'Fuel Rust SDK': rust,
    'Fuel TS SDK': tsSDK,
    'Fuel Wallet': wallet,
  };
}
