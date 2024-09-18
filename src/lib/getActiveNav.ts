import type { DocType, NavOrder, VersionSet } from '../types';

export function getActiveNav(
  versionSet: VersionSet,
  allNavs: NavOrder[],
  allNightlyNavs: NavOrder[],
  doc?: DocType
) {
  let navs = undefined;
  if (
    !doc ||
    // (!doc.originalSlug.includes('guides') &&
    !doc.originalSlug.includes('docs/contributing')
  ) {
    if (versionSet === 'nightly') {
      navs = allNightlyNavs;
    } else {
      navs = allNavs;
    }
  }

  return navs;
}
