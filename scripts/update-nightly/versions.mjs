import fs from 'fs';
import toml from 'toml';

export function getExistingVersions() {
  const versions = {};
  versions.default = {
    forc: getForcVersion(false),
    rust: getRustSDKVersion(false),
    ts: getTSSDKVersion(false),
    wallet: getWalletVersion(false),
    sway_libs: getSwayLibsVersion(false),
    sway_standards: getSwayStandardsVersion(false),
  };
  versions.nightly = {
    forc: getForcVersion(true),
    rust: getRustSDKVersion(true),
    ts: getTSSDKVersion(true),
    wallet: getWalletVersion(true),
    sway_libs: getSwayLibsVersion(true),
    sway_standards: getSwayStandardsVersion(true),
  };

  return versions;
}

export async function getNightlyVersions() {
  const versions = {};
  versions.forc = await getNightlyRelease('sway');
  versions.rust = await getNightlyRelease('fuels-rs');
  versions.ts = await getNightlyRelease('fuels-ts');
  versions.wallet = await getNightlyRelease('fuels-wallet');
  versions.sway_libs = await getNightlyRelease('sway-libs');
  versions.sway_standards = await getNightlyRelease('sway-standards');
  return versions;
}

function getForcVersion(isNightly) {
  const forcfiledir = `docs${
    isNightly ? '/nightly' : ''
  }/sway/forc-pkg/Cargo.toml`;
  const forcfile = fs.readFileSync(forcfiledir, 'utf-8');
  const version = forcfile?.match(/version = "(.*)"/)?.[1];
  return version;
}

function getTSSDKVersion(isNightly) {
  return getVersionFromJSONFile(
    `docs${isNightly ? '/nightly' : ''}/fuels-ts/packages/fuels/package.json`
  );
}

function getRustSDKVersion(isNightly) {
  return getVersionFromTOMLFile(
    `docs${isNightly ? '/nightly' : ''}/fuels-rs/Cargo.toml`
  );
}

function getWalletVersion(isNightly) {
  return getVersionFromJSONFile(
    `docs${isNightly ? '/nightly' : ''}/fuels-wallet/packages/app/package.json`
  );
}

function getSwayLibsVersion(isNightly) {
  return getVersionFromTOMLFile(
    `docs${isNightly ? '/nightly' : ''}/sway-libs/Cargo.toml`
  );
}

function getSwayStandardsVersion(isNightly) {
  return getVersionFromTOMLFile(
    `docs${isNightly ? '/nightly' : ''}/sway-standards/Cargo.toml`
  );
}

function getVersionFromJSONFile(path) {
  const file = fs.readFileSync(path, 'utf-8');
  const json = JSON.parse(file);
  return json.version;
}

function getVersionFromTOMLFile(path) {
  const file = fs.readFileSync(path, 'utf-8');
  const tomlFile = toml.parse(file);
  let version;
  if (tomlFile.package) {
    version = tomlFile.package.version;
  } else {
    version = tomlFile.workspace.package.version;
  }
  return version;
}

async function getNightlyRelease(repoName) {
  const url = `https://api.github.com/repos/FuelLabs/${repoName}/releases/latest`;
  const response = await fetch(url);
  const release = await response.json();
  return release.tag_name.replace('v', '');
}
