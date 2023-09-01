import { readFileSync } from 'fs';
import { join } from 'path';

import { DOCS_DIRECTORY } from '../config/constants';

const linksPath = join(
  DOCS_DIRECTORY,
  `../src/generated/sidebar-links/fuels-ts.json`
);

const links = JSON.parse(readFileSync(linksPath, 'utf8'));

export interface DuplicateAPIItem {
  path: string;
  originalCategory: string;
  newCategory: string;
}

export function getTSAPIDuplicates() {
  const duplicateAPICategories: string[] = [];
  const duplicateAPIPaths: DuplicateAPIItem[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  links.forEach((linkItem: any) => {
    if (linkItem.label.startsWith('API-')) {
      duplicateAPICategories.push(linkItem.label);
    }
  });

  duplicateAPICategories.forEach((category) => {
    const split = category.split('-');
    split.shift();
    const cat = split.join('-');
    const apiPath = `/api/${cat}`;
    duplicateAPIPaths.push({
      path: apiPath,
      originalCategory: cat,
      newCategory: category,
    });
  });
  return duplicateAPIPaths;
}
