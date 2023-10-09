import fs from 'fs';
import { join } from 'path';

const DOCS_DIRECTORY = join(process.cwd(), './docs');
const LATEST_DOCS_DIRECTORY = join(process.cwd(), './docs/latest');

export function getFile(path, isLatest = false, isJSON = false) {
  const docsDir = isLatest ? LATEST_DOCS_DIRECTORY : DOCS_DIRECTORY;
  const fullPath = join(docsDir, path);
  const file = fs.readFileSync(fullPath, 'utf8');
  if (isJSON) {
    return JSON.parse(file);
  }
  return file;
}
