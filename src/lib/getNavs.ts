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
  const allBeta4NavsPath = join(
    DOCS_DIRECTORY,
    '../src/generated/sidebar-links/all-beta-4-orders.json'
  );
  const allNavs = JSON.parse(readFileSync(allNavsPath, 'utf8'));
  const allNightlyNavs = JSON.parse(readFileSync(allnightlyNavsPath, 'utf8'));
  const allBeta4Navs = JSON.parse(readFileSync(allBeta4NavsPath, 'utf8'));

  return { allNavs, allNightlyNavs, allBeta4Navs };
}
