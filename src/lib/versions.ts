import fs from 'fs';
import { join } from 'path';
import toml from 'toml';

import { DOCS_DIRECTORY, NIGHTLY_DOCS_DIRECTORY } from '../config/constants';

function itemFromPackageJson(docsDir: string, filename: string) {
  const file = fs.readFileSync(join(docsDir, filename), 'utf-8');
  const json = JSON.parse(file);
  return json;
}

function getWalletVersion(docsDir: string) {
  const { homepage } = itemFromPackageJson(
    docsDir,
    'fuels-wallet/package.json'
  );
  const json = itemFromPackageJson(
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

function getTSSDKVersion(docsDir: string) {
  const { homepage } = itemFromPackageJson(docsDir, 'fuels-ts/package.json');
  const json = itemFromPackageJson(
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

export function getRustSDKVersion(docsDir: string) {
  const filedir = join(docsDir, 'fuels-rs/Cargo.toml');
  const file = fs.readFileSync(filedir, 'utf-8');
  const tomfile = toml.parse(file);
  return {
    name: 'fuels-rs',
    category: 'Rust SDK',
    version: tomfile.workspace.package.version,
    url: tomfile.workspace.package.repository,
  };
}

function getFuelupVersion(docsDir: string) {
  const filedir = join(docsDir, 'fuelup/Cargo.toml');
  const file = fs.readFileSync(filedir, 'utf-8');
  const tomfile = toml.parse(file);

  return {
    name: 'fuelup',
    category: 'Fuelup',
    version: tomfile.package.version,
    url: tomfile.package.repository,
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
    url: swaitomfile.workspace.package.repository,
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

export function getVersions(isNightly: boolean) {
  const docsDir = isNightly ? NIGHTLY_DOCS_DIRECTORY : DOCS_DIRECTORY;
  const wallet = getWalletVersion(docsDir);
  const tsSDK = getTSSDKVersion(docsDir);
  const rust = getRustSDKVersion(docsDir);
  const fuelup = getFuelupVersion(docsDir);
  const forc = getForcVersion(docsDir);

  return {
    Forc: forc,
    Sway: forc,
    Fuelup: fuelup,
    'Fuel Rust SDK': rust,
    'Fuel TS SDK': tsSDK,
    'Fuel Wallet': wallet,
  };
}
