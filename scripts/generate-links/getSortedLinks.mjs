// doc slugs that start with a path in this array
// won't be capitalized in the navigation sidebar
const LOWER_CASE_NAV_PATHS = [
  'docs/forc/commands/',
  'docs/forc/plugins/',
  'docs/indexer/forc-index/',
  'docs/indexer/forc-postgres/',
];

function editLabel(label) {
  return label
    .replaceAll(/[_-]/g, ' ')
    .replace(/(b|B)eta (\d+)/, (_, p1, p2) => `${p1}eta-${p2}`);
}

export default function getSortedLinks(config, docs) {
  const links = [];
  const lcOrder = config.menu.map((o) =>
    o.toLowerCase().replaceAll('-', '_').replaceAll(' ', '_')
  );

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    if (doc.category === 'forc_client') {
      doc.category = 'plugins';
    }

    if (doc.category === 'about fuel') {
      doc.category = 'src';
    }

    const isExternal = doc.slug.startsWith('http');
    doc.slug = doc.slug.replace('../', '').replace('./', '') || '';
    if (!doc.slug.startsWith('guides/') && !isExternal) {
      doc.slug = `docs/${doc.slug}`;
    }
    const shouldBeLowerCase = LOWER_CASE_NAV_PATHS.some((prefix) =>
      doc.slug.toLowerCase().startsWith(prefix)
    );

    if (
      !doc.category ||
      doc.category === 'src' ||
      doc.category === 'forc' ||
      (doc.category === 'guide' && doc.title === 'guide') ||
      (doc.category === 'api' && doc.title === 'api')
    ) {
      let newLabel = doc.title;
      if (doc.title === 'index' || doc.title === 'README') {
        const arr = doc.slug.split('/');
        newLabel = arr[arr.length - 1];
      }
      links.push({
        slug: doc.slug,
        label: editLabel(newLabel),
        isExternal,
        shouldBeLowerCase,
      });
      continue;
    }

    const categoryIdx = links.findIndex((l) => {
      return l?.label === doc.category;
    });
    /** Insert category item based on order prop */
    if (categoryIdx >= 0) {
      const submenu = links[categoryIdx]?.submenu || [];
      let newLabel = doc.title;
      if (doc.title === 'index') {
        const arr = doc.slug.split('/');
        newLabel = arr[arr.length - 1];
      }
      submenu.push({
        slug: doc.slug.toLowerCase(),
        label: editLabel(newLabel),
        isExternal,
        shouldBeLowerCase,
      });
      continue;
    }
    const subpath = doc.slug.split('/')[1];
    const submenu = [
      {
        slug: doc.slug.toLowerCase(),
        label: editLabel(doc.title),
        isExternal,
        shouldBeLowerCase,
      },
    ];
    links.push({
      subpath,
      label: doc.category,
      isExternal,
      shouldBeLowerCase,
      submenu,
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
