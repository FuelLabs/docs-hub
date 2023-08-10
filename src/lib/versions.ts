import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import toml from 'toml';

import { DOCS_DIRECTORY } from '../config/constants';

async function itemFromPackageJson(filename: string) {
  const file = await fs.readFile(join(DOCS_DIRECTORY, filename), 'utf-8');
  const json = JSON.parse(file);
  return json;
}

async function getWalletVersion() {
  const { homepage } = await itemFromPackageJson('fuels-wallet/package.json');
  const json = await itemFromPackageJson(
    'fuels-wallet/packages/sdk/package.json'
  );
  return {
    name: 'fuels-wallet',
    version: json.version,
    category: 'Wallet',
    url: homepage,
  };
}

async function getTSSDKVersion() {
  const { homepage } = await itemFromPackageJson('fuels-ts/package.json');
  const json = await itemFromPackageJson(
    'fuels-ts/packages/fuels/package.json'
  );
  return {
    name: 'fuels-ts',
    version: json.version,
    category: 'TypeScript SDK',
    url: homepage,
  };
}

async function getRustSDKVersion() {
  const filedir = join(DOCS_DIRECTORY, 'fuels-rs/Cargo.toml');
  const file = await fs.readFile(filedir, 'utf-8');
  const tomfile = toml.parse(file);
  return {
    name: 'fuels-rs',
    category: 'Rust SDK',
    version: tomfile.workspace.package.version,
    url: tomfile.workspace.package.repository,
  };
}

async function getFuelupVersion() {
  const filedir = join(DOCS_DIRECTORY, 'fuelup/Cargo.toml');
  const file = await fs.readFile(filedir, 'utf-8');
  const tomfile = toml.parse(file);

  return {
    name: 'fuelup',
    category: 'Fuelup',
    version: tomfile.package.version,
    url: tomfile.package.repository,
  };
}

async function getForcVersion() {
  const swayfile = join(DOCS_DIRECTORY, 'sway/Cargo.toml');
  const file = await fs.readFile(swayfile, 'utf-8');
  const swaitomfile = toml.parse(file);
  const forcfiledir = join(DOCS_DIRECTORY, 'sway/forc-pkg/Cargo.toml');
  const forcfile = await fs.readFile(forcfiledir, 'utf-8');
  const version = forcfile?.match(/version = "(.*)"/)?.[1];

  return {
    name: 'forc',
    category: 'Forc',
    version,
    url: swaitomfile.workspace.package.repository,
  };
}

async function getIndexerVersion() {
  const filedir = join(DOCS_DIRECTORY, 'fuel-indexer/Cargo.toml');
  const file = await fs.readFile(filedir, 'utf-8');
  const tomfile = toml.parse(file);
  return {
    name: 'fuel-indexer',
    category: 'Indexer',
    version: tomfile.workspace.package.version,
    url: tomfile.workspace.package.repository,
  };
}

export async function getVersions() {
  const wallet = await getWalletVersion();
  const tsSDK = await getTSSDKVersion();
  const rust = await getRustSDKVersion();
  const fuelup = await getFuelupVersion();
  const forc = await getForcVersion();
  const indexer = await getIndexerVersion();

  return {
    forc,
    fuelup,
    indexer,
    rust,
    tsSDK,
    wallet,
  };
}
