import fs from 'fs';
import { join } from 'path';

const DOCS_DIRECTORY = join(process.cwd(), './docs');
const NIGHTLY_DOCS_DIRECTORY = join(process.cwd(), './docs/nightly');

export function getFile(path, isNightly = false, isJSON = false) {
  const docsDir = isNightly ? NIGHTLY_DOCS_DIRECTORY : DOCS_DIRECTORY;
  const fullPath = join(docsDir, path);
  const file = fs.readFileSync(fullPath, 'utf8');
  if (isJSON) {
    return JSON.parse(file);
  }
  return file;
}
