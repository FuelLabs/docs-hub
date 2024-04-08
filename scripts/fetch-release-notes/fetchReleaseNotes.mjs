import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const REPOS = [
  { repoName: "sway", docName: "Sway" },
  { repoName: "fuel-core", docName: "Fuel Core" },
  { repoName: "fuels-rs", docName: "Rust SDK" },
  { repoName: "fuels-ts", docName: "TS SDK" },
  { repoName: "fuels-wallet", docName: "Fuel Wallet" },
  { repoName: "block-explorer-v2", docName: "Fuel Explorer" },
];

const re = new RegExp("#+ ", "g");

export async function fetchReleaseNotes() {
  let releaseNoteContent = "";
  let toc = "";
  for (const [index, repo] of REPOS.entries()) {
    toc += `<div style={{ fontSize: "20px" }}>${index + 1}. [${repo.docName}](#${repo.docName.toLowerCase().replaceAll(" ", "-")})</div>\n`
    const url = `https://api.github.com/repos/FuelLabs/${repo.repoName}/releases/latest`;
    const response = await fetch(url, {
      credentials: "include",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_AUTH}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      redirect: "follow",
    });
    const responseJson = await response.json();
    // Escape angled brackets for mdx
    const releaseNotes = responseJson.body
      .replaceAll("<", "\\<")
      .replaceAll(">", "\\>")
      .replaceAll(re, (match) => {
        return `#${match}`;
      });
    const releaseName = responseJson.name;
    releaseNoteContent += `## ${repo.docName}
        ### ${releaseName}
        ${releaseNotes}]\n`;
  }
  let content = `---
title: Release Notes and Changelogs
category: Understanding Fuel
---
    
# Nightly Release Notes and Changelogs

`;

  content += toc;
  content += releaseNoteContent;
  console.log(content);

  fs.writeFileSync("./docs/fuel-101/releasenotes-changelogs.mdx", content);
}
