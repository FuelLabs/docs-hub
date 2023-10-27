import { capitalize } from './str.mjs';

// doc slugs that start with a path in this array
// won't be capitalized in the navigation sidebar
const LOWER_CASE_NAV_PATHS = [
  'docs/forc/commands/',
  'docs/latest/forc/commands/',
  'docs/forc/plugins/',
  'docs/latest/forc/plugins/',
  'docs/indexer/forc-index/',
  'docs/latest/indexer/forc-index/',
  'docs/indexer/forc-postgres/',
  'docs/latest/indexer/forc-postgres/',
];

function editLabel(label, shouldBeLowerCase) {
  let newLabel = label
    .replaceAll(/[_-]/g, ' ')
    .replace(/(b|B)eta (\d+)/, (_, p1, p2) => `${p1}eta-${p2}`);
  if (!shouldBeLowerCase) {
    newLabel = capitalize(newLabel);
  }
  return newLabel;
}

export default function getSortedLinks(config, docs) {
  const links = [];
  const lcOrder = config.menu.map((o) =>
    o.toLowerCase().replaceAll('-', '_').replaceAll(' ', '_')
  );

  const isLatest = docs[0].slug.includes('/latest/');

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    let thisCategory = doc.category;

    if (thisCategory === 'forc_client') {
      thisCategory = 'plugins';
    }

    if (thisCategory === 'about fuel') {
      thisCategory = 'src';
    }

    const isExternal = doc.slug.startsWith('http');
    doc.slug = doc.slug.replace('../', '').replace('./', '') || '';
    if (
      !doc.slug.startsWith('guides') &&
      !doc.slug.startsWith('latest/guides') &&
      !isExternal
    ) {
      doc.slug = `docs/${doc.slug}`;
    }
    const shouldBeLowerCase = LOWER_CASE_NAV_PATHS.some((prefix) => {
      const lcSlug = doc.slug.toLowerCase();
      return lcSlug.startsWith(prefix) && `${lcSlug}/` !== prefix;
    });

    const finalSlug = doc.slug
      .toLowerCase()
      .replace('latest/guides', 'guides/latest');

    if (
      !thisCategory ||
      thisCategory === 'src' ||
      thisCategory === 'forc' ||
      (thisCategory === 'guide' && doc.title === 'guide') ||
      (thisCategory === 'api' && doc.title === 'api')
    ) {
      let newLabel = doc.title.replace('latest/', '');
      if (newLabel === 'index' || newLabel === 'README') {
        const arr = doc.slug.split('/');
        newLabel = arr[arr.length - 1];
      }
      links.push({
        slug: doc.slug,
        label: editLabel(newLabel, shouldBeLowerCase),
        isExternal,
      });
      continue;
    }

    const categoryIdx = links.findIndex((l) => {
      return l?.label === thisCategory;
    });
    /** Insert category item based on order prop */
    if (categoryIdx >= 0) {
      const submenu = links[categoryIdx]?.submenu || [];
      let newLabel = doc.title;
      if (doc.title === 'index') {
        const arr = doc.slug.split('/');
        newLabel = arr[arr.length - 1];
      }
      if (
        thisCategory.toLowerCase() === doc.title.toLowerCase() ||
        doc.title.toLowerCase() === 'index'
      ) {
        links[categoryIdx].hasIndex = true;
      }
      submenu.push({
        slug: finalSlug,
        label: editLabel(newLabel, shouldBeLowerCase),
        isExternal,
      });
      continue;
    }
    let hasIndex = false;
    if (thisCategory === doc.title) {
      hasIndex = true;
    }
    const splitSlug = doc.slug.split('/');
    let subpath =
      splitSlug[1] === 'latest' ? `latest/${splitSlug[2]}` : splitSlug[1];
    subpath = subpath.replace('latest/guides', 'guides/latest');
    const submenu = [
      {
        slug: finalSlug,
        label: editLabel(doc.title, shouldBeLowerCase),
        isExternal,
      },
    ];
    links.push({
      subpath,
      label: thisCategory,
      isExternal,
      submenu,
      hasIndex,
    });
    /** Insert inside category submenu if category is already on array */
  }

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
              const pathLength = isLatest ? 4 : 3;
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

function convertKeysToLowerCase(obj) {
  const newObj = {};
  for (const key in obj) {
    const lowerKey = key.toLowerCase();
    newObj[lowerKey] = obj[key];
  }
  return newObj;
}
