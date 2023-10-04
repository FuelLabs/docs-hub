import fs from 'fs';
import { join } from 'path';
import toml from 'toml';

export function getExistingVersions() {
  return {
    forc: getForcVersion(),
    indexer: getIndexerVersion(),
    rust: getRustSDKVersion(),
    ts: getTSSDKVersion(),
  };
}

export async function getLatestVersions(latestFileName, dir) {
  const versions = {};
  console.log('Most recently created file:', latestFileName);
  const content = fs.readFileSync(join(dir, latestFileName), 'utf-8');
  const forcMatches = content.match(/pkg\.forc.*?version\s*=\s*"([^"]+)"/s);
  if (forcMatches) {
    versions.forc = forcMatches[1];
  } else {
    throw 'ERROR: forc version not found!';
  }

  const indexerMatches = content.match(
    /pkg\.fuel-indexer.*?version\s*=\s*"([^"]+)"/s
  );
  if (indexerMatches) {
    versions.indexer = indexerMatches[1];
  } else {
    throw 'ERROR: indexer version not found!';
  }

  versions.rust = await getLatestRelease('fuels-rs');
  versions.ts = await getLatestRelease('fuels-ts');
  return versions;
}

function getForcVersion() {
  const forcfiledir = 'docs/latest/sway/forc-pkg/Cargo.toml';
  const forcfile = fs.readFileSync(forcfiledir, 'utf-8');
  const version = forcfile?.match(/version = "(.*)"/)?.[1];
  return version;
}

function getIndexerVersion() {
  const filedir = 'docs/latest/fuel-indexer/Cargo.toml';
  const file = fs.readFileSync(filedir, 'utf-8');
  const tomfile = toml.parse(file);
  return tomfile.workspace.package.version;
}

function getTSSDKVersion() {
  const file = fs.readFileSync(
    'docs/latest/fuels-ts/packages/fuels/package.json',
    'utf-8'
  );
  const json = JSON.parse(file);
  return json.version;
}

function getRustSDKVersion() {
  const filedir = 'docs/latest/fuels-rs/Cargo.toml';
  const file = fs.readFileSync(filedir, 'utf-8');
  const tomfile = toml.parse(file);
  return tomfile.workspace.package.version;
}

async function getLatestRelease(repoName) {
  const url = `https://api.github.com/repos/FuelLabs/${repoName}/releases/latest`;
  const response = await fetch(url);
  const release = await response.json();
  return release.tag_name.replace('v', '');
}
