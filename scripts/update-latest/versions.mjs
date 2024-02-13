import fs from 'fs';
import toml from 'toml';

export function getExistingVersions() {
  return {
    forc: getForcVersion(),
    rust: getRustSDKVersion(),
    ts: getTSSDKVersion(),
    wallet: getWalletVersion(),
    fuelup: getFuelupVersion(),
  };
}

export async function getNightlyVersions() {
  const versions = {};
  versions.forc = await getNightlyRelease('sway');
  versions.rust = await getNightlyRelease('fuels-rs');
  versions.ts = await getNightlyRelease('fuels-ts');
  versions.wallet = await getNightlyRelease('fuels-wallet');
  versions.fuelup = await getNightlyRelease('fuelup');
  return versions;
}

function getForcVersion() {
  const forcfiledir = 'docs/nightly/sway/forc-pkg/Cargo.toml';
  const forcfile = fs.readFileSync(forcfiledir, 'utf-8');
  const version = forcfile?.match(/version = "(.*)"/)?.[1];
  return version;
}

function getFuelupVersion() {
  return getVersionFromTOMLFile('docs/fuelup/Cargo.toml');
}

function getTSSDKVersion() {
  return getVersionFromJSONFile(
    'docs/nightly/fuels-ts/packages/fuels/package.json'
  );
}

function getRustSDKVersion() {
  return getVersionFromTOMLFile('docs/nightly/fuels-rs/Cargo.toml');
}

function getWalletVersion() {
  return getVersionFromJSONFile(
    'docs/nightly/fuels-wallet/packages/sdk/package.json'
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
