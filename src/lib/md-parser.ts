import { readFileSync } from 'fs';
import { join } from 'path';

import { DOCS_DIRECTORY } from '../config/constants';

import { getTSAPIDuplicates } from './ts-api';

const configPath = join(DOCS_DIRECTORY, '../src/config/paths.json');
const pathsConfig = JSON.parse(readFileSync(configPath, 'utf8'));

export class DocParser {
  static createSlug(path: string) {
    let slug = path;
    if (path.includes('/api/') && path.includes('fuels-ts')) {
      const duplicates = getTSAPIDuplicates();
      duplicates.forEach(
        ({ path: apiPath, originalCategory: cat, newCategory: category }) => {
          if (path.includes(apiPath)) {
            slug = path.replace(cat, category);
          }
        }
      );
    }

    for (const key in pathsConfig) {
      const value = pathsConfig[key];
      slug = slug.replaceAll(key, value as string);
    }

    if (slug.endsWith('/src')) {
      slug = slug.replace('/src', '');
    }

    return slug.toLowerCase();
  }
}
