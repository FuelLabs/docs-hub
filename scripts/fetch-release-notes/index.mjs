import { fetchReleaseNotes } from "./fetchReleaseNotes.mjs";

await main();

async function main() {
    await fetchReleaseNotes();
}
