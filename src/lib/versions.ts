import fs from 'fs';
import { join } from 'path';
import toml from 'toml';

import { DOCS_DIRECTORY, NIGHTLY_DOCS_DIRECTORY } from '../config/constants';
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
  const forcfiledir = join(docsDir, 'sway/Cargo.toml');
  const forcfileContent = fs.readFileSync(forcfiledir, 'utf-8');
  const forcfile = toml.parse(forcfileContent);
  const version = forcfile.workspace.package.version;

  return {
    name: 'forc',
    category: 'Forc',
    version,
    url: `https://github.com/FuelLabs/sway/tree/v${version}`,
  };
}

function getSwayLibsVersion(docsDir: string) {
  const filedir = join(docsDir, 'sway-libs/Cargo.toml');
  const file = fs.readFileSync(filedir, 'utf-8');
  const tomfile = toml.parse(file);
  const version = tomfile.package.version;
  return {
    name: 'sway-libs',
    category: 'Sway Libraries',
    version,
    url: `https://github.com/FuelLabs/sway-libs/tree/v${version}`,
  };
}

function getSwayStandardsVersion(docsDir: string) {
  const filedir = join(docsDir, 'sway-standards/Cargo.toml');
  const file = fs.readFileSync(filedir, 'utf-8');
  const tomfile = toml.parse(file);
  return {
    name: 'sway-standards',
    category: 'Sway Standards',
    version: tomfile.package.version,
    url: `https://github.com/FuelLabs/sway-standards/tree/v${tomfile.package.version}`,
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
  const swayStandards = getSwayStandardsVersion(docsDir);
  const swayLibraries = getSwayLibsVersion(docsDir);

  return {
    Forc: forc,
    Sway: forc,
    'Fuel Rust SDK': rust,
    'Fuel TS SDK': tsSDK,
    'Fuel Wallet': wallet,
    'GraphQL API': fuelCore,
    'Sway Standards': swayStandards,
    'Sway Libraries': swayLibraries,
  };
}

export class VersionsSingleton {
  static #instance: VersionsSingleton;
  #versions: ReturnType<typeof getAllGeneratedVersions>;

  private constructor() {
    this.#versions = getAllGeneratedVersions();
  }

  public static get instance(): VersionsSingleton {
    if (!VersionsSingleton.#instance) {
      VersionsSingleton.#instance = new VersionsSingleton();
    }

    return VersionsSingleton.#instance;
  }

  public getAllVersions() {
    return this.#versions;
  }
}

export function getAllGeneratedVersions() {
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

  if (link.includes('/sway-standards/')) {
    return `v${versions['Sway Standards'].version}`;
  }

  if (link.includes('/sway-libs/')) {
    return `v${versions['Sway Libraries'].version}`;
  }

  if (link.includes('/sway/')) {
    return `v${versions.Sway.version}`;
  }

  if (link.includes('/fuels-wallet/')) {
    return `v${versions['Fuel Wallet'].version}`;
  }
  return 'master';
}
