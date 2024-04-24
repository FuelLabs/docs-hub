import { readFileSync } from 'fs';
import { join } from 'path';
import { DOCS_DIRECTORY } from '../config/constants';

export function getNavs() {
  const allNavsPath = join(
    DOCS_DIRECTORY,
    '../src/generated/sidebar-links/all-orders.json'
  );
  const allnightlyNavsPath = join(
    DOCS_DIRECTORY,
    '../src/generated/sidebar-links/all-nightly-orders.json'
  );
  const allBeta5NavsPath = join(
    DOCS_DIRECTORY,
    '../src/generated/sidebar-links/all-beta-5-orders.json'
  );
  const allNavs = JSON.parse(readFileSync(allNavsPath, 'utf8'));
  const allNightlyNavs = JSON.parse(readFileSync(allnightlyNavsPath, 'utf8'));
  const allBeta5Navs = JSON.parse(readFileSync(allBeta5NavsPath, 'utf8'));

  return { allNavs, allNightlyNavs, allBeta5Navs };
}
