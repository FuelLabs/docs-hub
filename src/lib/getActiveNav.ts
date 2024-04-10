import type { DocType, NavOrder, VersionSet } from '../types';

export function getActiveNav(
  versionSet: VersionSet,
  allNavs: NavOrder[],
  allNightlyNavs: NavOrder[],
  allBeta4Navs: NavOrder[],
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
    } else if (versionSet === 'beta-4') {
      navs = allBeta4Navs;
    } else {
      navs = allNavs;
    }
  }

  return navs;
}
