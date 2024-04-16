import { editLabel } from './editLabel.mjs';

export function getBreadcrumbs(
  isGuide,
  isNightly,
  isBeta4,
  slug,
  type,
  hasIndex,
  splitSlug,
  shouldBeLowerCase,
  thisCategory,
  label
) {
  let breadcrumbs = [
    { label: isGuide ? 'Guides' : 'Docs', link: isGuide ? '/guides' : '/' },
  ];

  if (isNightly) {
    breadcrumbs.push({ label: 'Nightly' });
  } else if (isBeta4) {
    breadcrumbs.push({ label: 'Beta-4' });
  }

  if (slug.includes('docs/intro/')) {
    breadcrumbs.push({ label: 'Intro' });
  } else if (slug.includes('docs/fuel-101/')) {
    breadcrumbs.push({ label: 'Fuel 101', link: '/docs/fuel-101' });
  } else if (slug.includes('docs/contributing/')) {
    breadcrumbs.push({ label: 'Contributing', link: '/docs/contributing/' });
  } else if (slug.includes("docs/notices/")) {
    breadcrumbs.push({ label: "Notices", link: '/docs/notices/releasenotes-changelogs' })
  } else {
    const i = isNightly || isBeta4 ? 2 : 1;
    if (type === 'submenu') {
      breadcrumbs = handleSubmenuCrumb(
        breadcrumbs,
        hasIndex,
        isGuide,
        isNightly,
        isBeta4,
        splitSlug,
        shouldBeLowerCase,
        thisCategory,
        i
      );
    } else if (type === 'submenuItem') {
      breadcrumbs = handleSubmenuItemCrumb(
        breadcrumbs,
        isGuide,
        isNightly,
        isBeta4,
        splitSlug,
        i,
        shouldBeLowerCase
      );
    } else if (type === 'link') {
      breadcrumbs = handleLinkCrumb(
        breadcrumbs,
        splitSlug,
        i,
        shouldBeLowerCase,
        label
      );
    }
  }

  if (label) {
    breadcrumbs.push({ label });
  }

  return breadcrumbs;
}

function handleSubmenuCrumb(
  initialBreadcrumbs,
  hasIndex,
  isGuide,
  isNightly,
  isBeta4,
  splitSlug,
  shouldBeLowerCase,
  thisCategory,
  i
) {
  const breadcrumbs = initialBreadcrumbs;
  let l = hasIndex ? 1 : 2;
  if (isGuide) {
    l = l - 1;
  }
  if (!isGuide || splitSlug.length > 2) {
    const link = `/${splitSlug.slice(0, splitSlug.length - l).join('/')}`;
    breadcrumbs.push({
      label: editLabel(splitSlug[i], shouldBeLowerCase),
      link,
    });
  }
  if (!isGuide) {
    if (!hasIndex) {
      const i = isNightly || isBeta4 ? 3 : 2;
      const link = `/${splitSlug.slice(0, splitSlug.length - 1).join('/')}`;
      breadcrumbs.push({
        label: editLabel(splitSlug[i], shouldBeLowerCase),
        link,
      });
      breadcrumbs.push({
        label: editLabel(splitSlug[splitSlug.length - 1], shouldBeLowerCase),
      });
    } else {
      breadcrumbs.push({ label: editLabel(thisCategory, shouldBeLowerCase) });
    }
  } else {
    if (splitSlug.length > 2) {
      breadcrumbs.push({
        label: editLabel(splitSlug[splitSlug.length - 1], shouldBeLowerCase),
      });
    } else {
      breadcrumbs.push({ label: editLabel(thisCategory, shouldBeLowerCase) });
    }
  }

  return breadcrumbs;
}

function handleSubmenuItemCrumb(
  initialBreadcrumbs,
  isGuide,
  isNightly,
  isBeta4,
  splitSlug,
  i,
  shouldBeLowerCase
) {
  const breadcrumbs = initialBreadcrumbs;
  const l = isGuide ? 2 : isNightly || isBeta4 ? 4 : 3;
  if (splitSlug.length > l) {
    const p = isGuide ? 1 : 2;
    const link1 = `/${splitSlug.slice(0, splitSlug.length - p).join('/')}`;
    breadcrumbs.push({
      label: editLabel(splitSlug[i], shouldBeLowerCase),
      link: link1,
    });
  }
  if (!isGuide) {
    const link2 = `/${splitSlug.slice(0, splitSlug.length - 1).join('/')}`;
    let label;
    if (splitSlug.length < l + 1) {
      label = editLabel(splitSlug[i], shouldBeLowerCase);
    } else {
      label = editLabel(splitSlug[i + 1], shouldBeLowerCase);
    }
    breadcrumbs.push({
      label,
      link: link2,
    });
  }

  return breadcrumbs;
}

function handleLinkCrumb(initialBreadcrumbs, splitSlug, i, shouldBeLowerCase) {
  const breadcrumbs = initialBreadcrumbs;
  if (splitSlug.length > i + 1) {
    const link = `/${splitSlug.slice(0, splitSlug.length - 1).join('/')}`;
    breadcrumbs.push({
      label: editLabel(splitSlug[i], shouldBeLowerCase),
      link,
    });
  }
  return breadcrumbs;
}
