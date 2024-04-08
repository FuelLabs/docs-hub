import { getAllVersions } from "../../src/lib/versions.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const versions = getAllVersions();

const REPOS = [
  {
    repoName: "sway",
    docName: "Sway",
    defaultVersion: versions.versions.Sway,
    nightlyVersion: versions.nightlyVersions.Sway,
  },
  {
    repoName: "fuel-core",
    docName: "Fuel Core",
    defaultVersion: versions.versions["GraphQL API"],
    nightlyVersion: versions.nightlyVersions["GraphQL API"],
  },
  {
    repoName: "fuels-rs",
    docName: "Rust SDK",
    defaultVersion: versions.versions["Fuel Rust SDK"],
    nightlyVersion: versions.nightlyVersions["Fuel Rust SDK"],
  },
  {
    repoName: "fuels-ts",
    docName: "TS SDK",
    defaultVersion: versions.versions["Fuel TS SDK"],
    nightlyVersion: versions.nightlyVersions["Fuel TS SDK"],
  },
  {
    repoName: "fuels-wallet",
    docName: "Fuel Wallet",
    defaultVersion: versions.versions["Fuel Wallet"],
    nightlyVersion: versions.nightlyVersions["Fuel Wallet"],
  },
  {
    repoName: "block-explorer-v2",
    docName: "Fuel Explorer",
    defaultVersion: "latest", // TODO: do we need a default version?
    nightlyVersion: "latest",
  },
];

const re = new RegExp("#+ ", "g");

async function fetchReleaseNotes(repoName, repoVersion) {
  const url = `https://api.github.com/repos/FuelLabs/${repoName}/releases/${repoVersion}`;
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_AUTH}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    redirect: "follow",
  });
  return await response.json();
}

function constructReleaseNotes(reponseJson) {
  // Escape angled brackets for mdx
  const releaseNotes = responseJson.body
    .replaceAll("<", "\\<")
    .replaceAll(">", "\\>")
    .replaceAll(re, (match) => {
      return `#${match}`;
    });
  const releaseName = responseJson.name;
  const releaseNoteContent = `## ${repo.docName}
  ### ${releaseName}
  ${releaseNotes}]\n`;
  return releaseNoteContent;
}

export async function writeReleaseNotes() {
  let defaultVersionContent = "";
  let toc = "";
  for (const [index, repo] of REPOS.entries()) {
    toc += `<div style={{ fontSize: "20px" }}>${index + 1}. [${
      repo.docName
    }](#${repo.docName.toLowerCase().replaceAll(" ", "-")})</div>\n`;
    const defaultVersionResponse = await fetchReleaseNotes(
      repo.repoName,
      repo.defaultVersion
    );
    defaultVersionContent += constructReleaseNotes(defaultVersionResponse);
  }
  let content = `---
title: Release Notes and Changelogs
category: Understanding Fuel
---
    
# Nightly Release Notes and Changelogs

`;

  content += toc;
  content += defaultVersionContent;
  console.log(content);

  fs.writeFileSync("./docs/fuel-101/releasenotes-changelogs.mdx", content);
}
