import fs from 'fs';
import path from 'path';

import { DOCS_DIRECTORY } from '../config/constants';

const configPath = path.join(DOCS_DIRECTORY, `../src/config/paths.json`);
const pathsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

export class DocParser {
  static createSlug(path: string) {
    let slug = path;
    for (const [key, value] of Object.entries(pathsConfig)) {
      slug = slug.replaceAll(key, value as string);
    }
    return slug.toLowerCase();
  }
}
