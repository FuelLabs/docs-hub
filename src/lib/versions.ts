import fs from 'fs';
import { join } from 'path';
import toml from 'toml';

import {
  DOCS_DIRECTORY,
  NIGHTLY_DOCS_DIRECTORY,
  BETA_4_DOCS_DIRECTORY,
} from '../config/constants';
import type { VersionSet } from '../types';

function itemFromPackageJson(docsDir: string, filename: string) {
  const file = fs.readFileSync(join(docsDir, filename), 'utf-8');
  const json = JSON.parse(file);
  return json;
}

function getWalletVersion(docsDir: string) {
  const json = itemFromPackageJson(
    docsDir,
    'fuels-wallet/packages/sdk/package.json'
  );
  return {
    name: 'fuels-wallet',
    version: json.version,
    category: 'Wallet',
    url: `https://github.com/FuelLabs/fuels-wallet/tree/v${json.version}`,
  };
}

function getTSSDKVersion(docsDir: string) {
  const json = itemFromPackageJson(
    docsDir,
    'fuels-ts/packages/fuels/package.json'
  );
  return {
    name: 'fuels-ts',
    version: json.version,
    category: 'TypeScript SDK',
    url: `https://github.com/FuelLabs/fuels-ts/tree/v${json.version}`,
  };
}

export function getRustSDKVersion(docsDir: string) {
  const filedir = join(docsDir, 'fuels-rs/Cargo.toml');
  const file = fs.readFileSync(filedir, 'utf-8');
  const tomfile = toml.parse(file);
  return {
    name: 'fuels-rs',
    category: 'Rust SDK',
    version: tomfile.workspace.package.version,
    url: `https://github.com/FuelLabs/fuels-rs/tree/v${tomfile.workspace.package.version}`,
  };
}

function getForcVersion(docsDir: string) {
  const swayfile = join(docsDir, 'sway/Cargo.toml');
  const file = fs.readFileSync(swayfile, 'utf-8');
  const swaitomfile = toml.parse(file);
  const forcfiledir = join(docsDir, 'sway/forc-pkg/Cargo.toml');
  const forcfile = fs.readFileSync(forcfiledir, 'utf-8');
  const version = forcfile?.match(/version = "(.*)"/)?.[1];

  return {
    name: 'forc',
    category: 'Forc',
    version,
    url: `https://github.com/FuelLabs/sway/tree/v${version}`,
  };
}

export function getFuelCoreVersion() {
  const filedir = join(DOCS_DIRECTORY, 'fuel-core/Cargo.toml');
  const file = fs.readFileSync(filedir, 'utf-8');
  const tomfile = toml.parse(file);
  return tomfile.workspace.package.version;
}

// returns the version of the node required by fuels-ts
export function getNodeVersion() {
  const filedir = join(DOCS_DIRECTORY, 'fuels-ts/packages/fuels/package.json');
  const file = fs.readFileSync(filedir, 'utf-8');
  const json = JSON.parse(file);
  return json.engines.node;
}

export function getVersions(versionSet: VersionSet) {
  let docsDir = DOCS_DIRECTORY;
  if (versionSet === 'nightly') {
    docsDir = NIGHTLY_DOCS_DIRECTORY;
  } else if (versionSet === 'beta-4') {
    docsDir = BETA_4_DOCS_DIRECTORY;
  }
  const wallet = getWalletVersion(docsDir);
  const tsSDK = getTSSDKVersion(docsDir);
  const rust = getRustSDKVersion(docsDir);
  const forc = getForcVersion(docsDir);

  return {
    Forc: forc,
    Sway: forc,
    'Fuel Rust SDK': rust,
    'Fuel TS SDK': tsSDK,
    'Fuel Wallet': wallet,
  };
}

export function getAllVersions() {
  const versions = getVersions('default');
  const nightlyVersions = getVersions('nightly');
  const beta4Versions = getVersions('beta-4');

  return { versions, nightlyVersions, beta4Versions };
}
