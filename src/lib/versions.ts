import fs from 'fs';
import { join } from 'path';
import toml from 'toml';

import {
  DOCS_DIRECTORY,
  NIGHTLY_DOCS_DIRECTORY,
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
    'fuels-wallet/packages/app/package.json'
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

export function getFullFuelCoreVersion(versionSet: VersionSet) {
  const filedir = join(DOCS_DIRECTORY, 'fuel-core/Cargo.toml');
  const file = fs.readFileSync(filedir, 'utf-8');
  const tomfile = toml.parse(file);
  return {
    name: 'fuel-graphql-docs',
    category: 'GraphQL API',
    version: tomfile.workspace.package.version,
    url: `https://github.com/FuelLabs/fuel-core/tree/v${tomfile.workspace.package.version}`,
  };
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
  }
  const wallet = getWalletVersion(docsDir);
  const tsSDK = getTSSDKVersion(docsDir);
  const rust = getRustSDKVersion(docsDir);
  const forc = getForcVersion(docsDir);
  const fuelCore = getFullFuelCoreVersion(versionSet);

  return {
    Forc: forc,
    Sway: forc,
    'Fuel Rust SDK': rust,
    'Fuel TS SDK': tsSDK,
    'Fuel Wallet': wallet,
    'GraphQL API': fuelCore,
  };
}

export function getAllVersions() {
  const versions = getVersions('default');
  const nightlyVersions = getVersions('nightly');

  return { versions, nightlyVersions };
}

// gets the correct url tag for github links
export default function getDocVersion(link: string, versionSet: VersionSet) {
  const versions = getVersions(versionSet);
  if (link.includes('/fuels-ts/')) {
    return `v${versions['Fuel TS SDK'].version}`;
  }

  if (link.includes('/fuels-rs/')) {
    return `v${versions['Fuel Rust SDK'].version}`;
  }

  if (link.includes('/sway/')) {
    return `v${versions.Sway.version}`;
  }

  if (link.includes('/fuels-wallet/')) {
    return `v${versions['Fuel Wallet'].version}`;
  }
  return 'master';
}
