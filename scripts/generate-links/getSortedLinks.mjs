import { editLabel } from './editLabel.mjs';
import { getBreadcrumbs } from './getBreadcrumbs.mjs';

// doc slugs that start with a path in this array
// won't be capitalized in the navigation sidebar
const LOWER_CASE_NAV_PATHS = [
  'docs/forc/commands/',
  'docs/nightly/forc/commands/',
  'docs/forc/plugins/',
  'docs/nightly/forc/plugins/',
];

export default function getSortedLinks(config, docs) {
  const lcOrder = config.menu.map((o) =>
    o.toLowerCase().replaceAll('-', '_').replaceAll(' ', '_')
  );
  const isNightly = docs[0].slug.includes('/nightly/');
  const links = createLinks(docs, isNightly);
  const sortedLinks = sortLinks(lcOrder, links, config, isNightly);

  return sortedLinks;
}

function createLinks(docs, isNightly) {
  const links = [];

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const thisCategory = getCategory(doc.category);
    const isExternal = doc.slug.startsWith('http');
    doc.slug = updateSlug(doc.slug);

    const shouldBeLowerCase = LOWER_CASE_NAV_PATHS.some((prefix) => {
      const lcSlug = doc.slug.toLowerCase();
      return lcSlug.startsWith(prefix) && `${lcSlug}/` !== prefix;
    });

    const finalSlug = doc.slug
      .toLowerCase()
      .replace('nightly/guides', 'guides/nightly');
    const isGuide = finalSlug.startsWith('guides');

    const splitSlug = finalSlug.split('/');

    if (
      !thisCategory ||
      thisCategory === 'src' ||
      thisCategory === 'forc' ||
      (thisCategory === 'guide' && doc.title === 'guide') ||
      thisCategory === 'intro' ||
      (thisCategory === 'api' && doc.title === 'api')
    ) {
      const newLink = handleLink(
        doc.title,
        finalSlug,
        splitSlug,
        shouldBeLowerCase,
        isNightly,
        isExternal,
        isGuide
      );
      links.push(newLink);
      continue;
    }

    const categoryIdx = links.findIndex((l) => {
      return l.label === thisCategory;
    });
    if (categoryIdx >= 0) {
      links[categoryIdx].submenu = handleSubmenuItem(
        links,
        categoryIdx,
        doc.title,
        finalSlug,
        thisCategory,
        shouldBeLowerCase,
        isNightly,
        splitSlug,
        isExternal,
        isGuide
      );
      continue;
    }

    const newSubMenu = handleSubmenu(
      thisCategory,
      doc.title,
      finalSlug,
      splitSlug,
      finalSlug,
      shouldBeLowerCase,
      isExternal,
      isNightly,
      isGuide
    );
    links.push(newSubMenu);
  }

  return links;
}

function sortLinks(lcOrder, links, config, isNightly) {
  const sortedLinks = lcOrder
    ? links
        /** Sort first level links */
        .sort((a, b) => {
          const lowerA = a.label
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll('-', '_');
          const lowerB = b.label
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll('-', '_');
          const aIdx = lcOrder.indexOf(lowerA);
          const bIdx = lcOrder.indexOf(lowerB);

          if (!a.subpath && !b.subpath) {
            return aIdx - bIdx;
          }
          if (a.subpath && b.subpath) {
            const aFirst = lcOrder.filter((i) => i === lowerA)?.[0];
            const bFirst = lcOrder.filter((i) => i === lowerB)?.[0];
            return lcOrder.indexOf(aFirst) - lcOrder.indexOf(bFirst);
          }
          let category = a.subpath ? lowerA : lowerB;
          category = category.replace('-', '_');
          const first = lcOrder.filter((i) => i === category)?.[0];
          const idx = lcOrder.indexOf(first);
          return a.subpath ? idx - bIdx : aIdx - idx;
        })
        /** Sort categoried links */
        .map((link) => {
          if (!link.submenu) return link;
          let key = link.label
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll('_', '-');
          let catOrder = config[key];
          if (!catOrder) catOrder = config[key.replaceAll('-', '_')];
          if (!catOrder) {
            const regex = /\/([^/]+)\/[^/]+$/;
            const match = link.submenu[0].slug.match(regex);
            key = match[1];
            catOrder = config[key];
          }
          if (!catOrder) {
            const newConfig = convertKeysToLowerCase(config);
            catOrder = newConfig[key];
          }
          catOrder = catOrder?.map((title) =>
            title.toLowerCase().replaceAll('-', '_').replaceAll(' ', '_')
          );

          const submenu = link.submenu.sort((a, b) => {
            const lowerA = a.label
              .toLowerCase()
              .replaceAll(' ', '_')
              .replaceAll('-', '_');
            const lowerB = b.label
              .toLowerCase()
              .replaceAll(' ', '_')
              .replaceAll('-', '_');

            if (a.slug.includes('fuels-ts')) {
              const pathLength = isNightly ? 4 : 3;
              const isIndexA = a.slug.split('/').length === pathLength;
              if (isIndexA) {
                return -1;
              }
              const isIndexB = b.slug.split('/').length === pathLength;
              if (isIndexB) {
                return 1;
              }
            }

            const aIdx = catOrder ? catOrder.indexOf(lowerA) : 0;
            const bIdx = catOrder ? catOrder.indexOf(lowerB) : 0;
            const result = aIdx - bIdx;
            return result;
          });
          return { ...link, submenu };
        })
    : links;

  return sortedLinks;
}

function getCategory(category) {
  let thisCategory = category;
  if (thisCategory === 'forc_client') {
    thisCategory = 'plugins';
  }
  if (thisCategory === 'about fuel') {
    thisCategory = 'src';
  }
  return thisCategory;
}

function updateSlug(docSlug, isExternal) {
  let slug = docSlug.replace('../', '').replace('./', '') || '';

  if (
    !slug.startsWith('guides') &&
    !slug.startsWith('nightly/guides') &&
    !isExternal
  ) {
    slug = `docs/${slug}`;
  }
  return slug;
}

function convertKeysToLowerCase(obj) {
  const newObj = {};
  for (const key in obj) {
    const lowerKey = key.toLowerCase();
    newObj[lowerKey] = obj[key];
  }
  return newObj;
}

function handleLink(
  title,
  slug,
  splitSlug,
  shouldBeLowerCase,
  isNightly,
  isExternal,
  isGuide
) {
  let newLabel = title.replace('nightly/', '');
  if (newLabel === 'index' || newLabel === 'README') {
    newLabel = splitSlug[splitSlug.length - 1];
  }
  const label = editLabel(newLabel, shouldBeLowerCase);

  const breadcrumbs = getBreadcrumbs(
    isGuide,
    isNightly,
    slug,
    'link',
    false,
    splitSlug,
    shouldBeLowerCase,
    null,
    label
  );

  return {
    slug,
    label,
    isExternal,
    breadcrumbs,
  };
}

function handleSubmenuItem(
  links,
  categoryIdx,
  title,
  slug,
  thisCategory,
  shouldBeLowerCase,
  isNightly,
  splitSlug,
  isExternal,
  isGuide
) {
  const submenu = links[categoryIdx].submenu || [];
  let newLabel = title;
  if (title === 'index') {
    const arr = slug.split('/');
    newLabel = arr[arr.length - 1];
  }
  const lcCategory = thisCategory.toLowerCase();
  const lcTitle = title.toLowerCase();
  if (
    lcCategory === lcTitle ||
    lcCategory === `api-${lcTitle}` ||
    title.toLowerCase() === 'index'
  ) {
    links[categoryIdx].hasIndex = true;
  }

  const label = editLabel(newLabel, shouldBeLowerCase);

  const breadcrumbs = getBreadcrumbs(
    isGuide,
    isNightly,
    slug,
    'submenuItem',
    false,
    splitSlug,
    shouldBeLowerCase,
    thisCategory,
    label
  );

  submenu.push({
    slug,
    label,
    isExternal,
    breadcrumbs,
  });

  return submenu;
}

function handleSubmenu(
  thisCategory,
  title,
  slug,
  splitSlug,
  finalSlug,
  shouldBeLowerCase,
  isExternal,
  isNightly,
  isGuide
) {
  const hasIndex = thisCategory === title;
  const subpath = getSubmenuSubpath(splitSlug);
  const breadcrumbs = getBreadcrumbs(
    isGuide,
    isNightly,
    slug,
    'submenu',
    hasIndex,
    splitSlug,
    shouldBeLowerCase,
    thisCategory,
    null
  );

  const submenu = [
    {
      slug: finalSlug,
      label: editLabel(title, shouldBeLowerCase),
      isExternal,
      breadcrumbs,
    },
  ];

  return {
    subpath,
    label: thisCategory,
    isExternal,
    submenu,
    hasIndex,
  };
}

function getSubmenuSubpath(splitSlug) {
  let subpath;
  if (splitSlug[1] === 'nightly') {
    subpath = `nightly/${splitSlug[2]}`;
  } else {
    subpath = splitSlug[1];
  }

  subpath = subpath.replace('nightly/guides', 'guides/nightly');

  return subpath;
}
