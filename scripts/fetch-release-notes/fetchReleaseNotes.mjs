import { getAllVersions } from '../../dist/lib/versions.js';
import fs from 'fs';
import exec from '@actions/exec';
import dotenv from 'dotenv';
dotenv.config();

const versions = getAllVersions();

const REPOS = [
  {
    repoName: 'sway',
    docName: 'Sway',
    defaultVersionDocLink: `https://fuellabs.github.io/sway/v${versions.versions.Sway.version}/book/`,
    nightlyVersionDocLink: `https://fuellabs.github.io/sway/v${versions.nightlyVersions.Sway.version}/book/`,
    defaultVersion: versions.versions.Sway,
    nightlyVersion: versions.nightlyVersions.Sway,
  },
  {
    repoName: 'fuel-core',
    docName: 'Fuel Core',
    defaultVersionDocLink: `https://docs.rs/fuel-core/${versions.versions['GraphQL API'].version}/fuel_core/`,
    nightlyVersionDocLink: `https://docs.rs/fuel-core/${versions.nightlyVersions['GraphQL API'].version}/fuel_core/`,
    defaultVersion: versions.versions['GraphQL API'],
    nightlyVersion: versions.nightlyVersions['GraphQL API'],
  },
  {
    repoName: 'fuels-rs',
    docName: 'Rust SDK',
    defaultVersionDocLink: `https://rust.fuel.network/v${versions.versions['Fuel Rust SDK'].version}`,
    nightlyVersionDocLink: `https://rust.fuel.network/v${versions.nightlyVersions['Fuel Rust SDK'].version}`,
    defaultVersion: versions.versions['Fuel Rust SDK'],
    nightlyVersion: versions.nightlyVersions['Fuel Rust SDK'],
  },
  {
    repoName: 'fuels-ts',
    docName: 'TS SDK',
    defaultVersionDocLink: `https://fuellabs.github.io/fuels-ts/`,
    nightlyVersionDocLink: `https://fuellabs.github.io/fuels-ts/`,
    defaultVersion: versions.versions['Fuel TS SDK'],
    nightlyVersion: versions.nightlyVersions['Fuel TS SDK'],
  },
  {
    repoName: 'fuels-wallet',
    docName: 'Fuel Wallet',
    defaultVersionDocLink: 'https://docs.fuel.network/docs/fuels-ts/',
    nightlyVersionDocLink: 'https://docs.fuel.network/docs/fuels-ts/',
    defaultVersion: versions.versions['Fuel Wallet'],
    nightlyVersion: versions.nightlyVersions['Fuel Wallet'],
  },
  {
    repoName: 'fuel-explorer',
    docName: 'Fuel Explorer',
    defaultVersionDocLink: 'https://app.fuel.network/',
    nightlyVersionDocLink: 'https://app.fuel.network/',
    defaultVersion: 'latest', // TODO: do we need a default version?
    nightlyVersion: 'latest',
  },
];

const re = /^#+\s$/g;

async function fetchReleaseNotes(repoName, repoVersion) {
  const url = `https://api.github.com/repos/FuelLabs/${repoName}/releases/${
    repoVersion === 'latest' ? repoVersion : `tags/v${repoVersion}`
  }`;
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_AUTH}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    redirect: 'follow',
  });
  return await response.json();
}

function constructReleaseNotes(responseJson, docName, docLink) {
  // Escape angled brackets for mdx
  const releaseNotes = responseJson.body
    .replaceAll('<', '\\<')
    .replaceAll('>', '\\>')
    .replaceAll(re, (match) => {
      return `#${match}`;
    });
  const releaseName = responseJson.name;
  const releaseNoteContent = `## <a href={"${docLink}"} target="_blank">${docName}</a>
### ${releaseName}
${releaseNotes}\n`;
  return releaseNoteContent;
}

export async function writeReleaseNotes() {
  let defaultVersionContent = '';
  let nightlyVersionContent = '';
  let defaultVersionTOC = '';
  let nightlyVersionTOC = '';
  for (const [index, repo] of REPOS.entries()) {
    defaultVersionTOC += `<div style={{ fontSize: "20px" }}>${index + 1}. [${
      repo.docName
    }](#${repo.docName.toLowerCase().replaceAll(' ', '-')})</div>\n`;
    nightlyVersionTOC += `<div style={{ fontSize: "20px" }}>${index + 1}. [${
      repo.docName
    }](#${repo.docName.toLowerCase().replaceAll(' ', '-')}-1)</div>\n`;

    const defaultVersionResponse = await fetchReleaseNotes(
      repo.repoName,
      repo.defaultVersion === 'latest'
        ? repo.defaultVersion
        : repo.defaultVersion.version
    );
    defaultVersionContent += constructReleaseNotes(
      defaultVersionResponse,
      repo.docName,
      repo.defaultVersionDocLink
    );

    const nightlyVersionResponse = await fetchReleaseNotes(
      repo.repoName,
      repo.nightlyVersion === 'latest'
        ? repo.nightlyVersion
        : repo.nightlyVersion.version
    );
    nightlyVersionContent += constructReleaseNotes(
      nightlyVersionResponse,
      repo.docName,
      repo.nightlyVersionDocLink
    );
  }
  let content = `---
title: Release Notes and Changelogs
category: Notices
---
    
<ConditionalContent versionSet={props.versionSet} showForVersions={["default"]}>
# Beta-5 Release Notes and Changelogs

`;

  content += defaultVersionTOC;
  content += defaultVersionContent;
  content += `</ConditionalContent>
<ConditionalContent versionSet={props.versionSet} showForVersions={["nightly"]}>
# Nightly Release Notes and Changelogs

`;
  content += nightlyVersionTOC;
  content += nightlyVersionContent;
  content += '</ConditionalContent>';

  fs.writeFileSync('./docs/notices/releasenotes-changelogs.mdx', content);
  try {
    await exec.exec('pnpm lint:guides:fix');
  } catch (_) {}
}
