import fs from 'fs';
import { join } from 'path';

const DOCS_DIRECTORY = join(process.cwd(), './docs');
const NIGHTLY_DOCS_DIRECTORY = join(process.cwd(), './docs/nightly');
const BETA_4_DOCS_DIRECTORY = join(process.cwd(), './docs/beta-4');

export function getFile(path, version, isJSON = false) {
  let docsDir = DOCS_DIRECTORY;
  if (version === 'nightly') {
    docsDir = NIGHTLY_DOCS_DIRECTORY;
  } else if (version === 'beta-4') {
    docsDir = BETA_4_DOCS_DIRECTORY;
  }

  const fullPath = join(docsDir, path);
  const file = fs.readFileSync(fullPath, 'utf8');
  if (isJSON) {
    return JSON.parse(file);
  }
  return file;
}
