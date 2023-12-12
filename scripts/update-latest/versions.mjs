import fs from 'fs';
import toml from 'toml';

export function getExistingVersions() {
  return {
    forc: getForcVersion(),
    indexer: getIndexerVersion(),
    rust: getRustSDKVersion(),
    ts: getTSSDKVersion(),
    wallet: getWalletVersion(),
  };
}

export async function getLatestVersions() {
  const versions = {};
  versions.forc = await getLatestRelease('sway');
  versions.indexer = await getLatestRelease('fuel-indexer');
  versions.rust = await getLatestRelease('fuels-rs');
  versions.ts = await getLatestRelease('fuels-ts');
  versions.wallet = await getLatestRelease('fuels-wallet');
  return versions;
}

function getForcVersion() {
  const forcfiledir = 'docs/latest/sway/forc-pkg/Cargo.toml';
  const forcfile = fs.readFileSync(forcfiledir, 'utf-8');
  const version = forcfile?.match(/version = "(.*)"/)?.[1];
  return version;
}

function getIndexerVersion() {
  return getVersionFromTOMLFile('docs/latest/fuel-indexer/Cargo.toml');
}

function getTSSDKVersion() {
  return getVersionFromJSONFile(
    'docs/latest/fuels-ts/packages/fuels/package.json'
  );
}

function getRustSDKVersion() {
  return getVersionFromTOMLFile('docs/latest/fuels-rs/Cargo.toml');
}

function getWalletVersion() {
  return getVersionFromJSONFile(
    'docs/latest/fuels-wallet/packages/sdk/package.json'
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
  return tomlFile.workspace.package.version;
}

async function getLatestRelease(repoName) {
  const url = `https://api.github.com/repos/FuelLabs/${repoName}/releases/latest`;
  const response = await fetch(url);
  const release = await response.json();
  return release.tag_name.replace('v', '');
}
