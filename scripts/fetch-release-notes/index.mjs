import { writeReleaseNotes } from './fetchReleaseNotes.mjs';

await main();

async function main() {
  await writeReleaseNotes();
}
