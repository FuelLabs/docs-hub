import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const REPOS = ["sway", "fuel-core", "fuels-rs", "fuels-ts", "fuels-wallet", "block-explorer-v2"]

export async function fetchReleaseNotes() {
    let releaseNoteContent = "";
    for (const repo of REPOS) {
        const url = `https://api.github.com/repos/FuelLabs/${repo}/releases/latest`;
        const response = await fetch(url, {
            credentials: "include",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${process.env.GITHUB_AUTH}`,
                "X-GitHub-Api-Version": "2022-11-28"
            },
            redirect: "follow"
        });
        const responseJson = await response.json();
        const releaseNotes = responseJson.body.replaceAll("<", "\\<").replaceAll(">", "\\>");
        const releaseName = responseJson.name;
        releaseNoteContent += `## ${repo}
        ## ${releaseName}
        ${releaseNotes}]\n`;
    }
    let content = `---
title: Release Notes and Changelogs
category: Understanding Fuel
---
    
# Release Notes and Changelogs

`;
    content += releaseNoteContent;
    console.log(content);

    fs.writeFileSync("./docs/fuel-101/releasenotes-changelogs.mdx", content);
}
