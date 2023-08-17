import fs, { readFileSync } from 'fs';
import path, { join } from 'path';

import { DOCS_DIRECTORY } from '../config/constants';

const configPath = path.join(DOCS_DIRECTORY, `../src/config/paths.json`);
const pathsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const linksPath = join(
  DOCS_DIRECTORY,
  `../src/generated/sidebar-links/fuels-ts.json`
);
const links = JSON.parse(readFileSync(linksPath, 'utf8'));
const duplicateAPICategories: string[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
links.forEach((linkItem: any) => {
  if (linkItem.label.startsWith('API-')) {
    duplicateAPICategories.push(linkItem.label);
  }
});

export class DocParser {
  static createSlug(path: string) {
    let slug = path;
    if (path.includes('/api/') && path.includes('fuels-ts')) {
      duplicateAPICategories.forEach((category) => {
        const split = category.split('-');
        split.shift();
        const cat = split.join('-');
        const apiPath = `/api/${cat}`;
        if (path.includes(apiPath)) {
          slug = path.replace(cat, category);
        }
      });
    }

    for (const [key, value] of Object.entries(pathsConfig)) {
      slug = slug.replaceAll(key, value as string);
    }
    return slug.toLowerCase();
  }
}
