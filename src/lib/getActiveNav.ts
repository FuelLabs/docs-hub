import type { DocType, NavOrder, VersionSet } from '../types';

export function getActiveNav(
  versionSet: VersionSet,
  allNavs: NavOrder[],
  allNightlyNavs: NavOrder[],
  allBeta5Navs: NavOrder[],
  doc?: DocType
) {
  let navs = undefined;
  if (
    !doc ||
    (!doc.originalSlug.includes('guides') &&
      !doc.originalSlug.includes('docs/contributing'))
  ) {
    if (versionSet === 'nightly') {
      navs = allNightlyNavs;
    } else if (versionSet === 'beta-5') {
      navs = allBeta5Navs;
    } else {
      navs = allNavs;
    }
  }

  return navs;
}
