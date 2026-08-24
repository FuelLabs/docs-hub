import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// The generated index.mjs imports its JSON with `assert { type: 'json' }`,
// which Node.js 22+ rejects, so read the generated document list directly.
const allMdDocs = JSON.parse(
  readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      '../../.contentlayer/generated/MdDoc/_index.json'
    ),
    'utf8'
  )
);

export function generateSiteMap() {
  const paths = getAllPaths(allMdDocs).map((p) => {
    const itemSlug = getDocSlug(p?.params.slug, allMdDocs);

    return slugForSitemap(itemSlug);
  });

  const uniquePaths = [...new Set(paths)];
  return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${uniquePaths.map((p) => `<url><loc>${p}</loc></url>`).join('')}
      </urlset>
    `;
}

function getAllPaths(mdDocs) {
  const paths = mdDocs
    .map((doc) => {
      const path = doc.slug;
      let slug = path.split('/').filter((s) => s.length);

      if (slug.length === 1) {
        return null;
      }
      if (slug.slice(-1)[0] === 'index') {
        slug = slug.slice(0, -1);
      }

      return {
        params: {
          slug,
          path,
        },
      };
    })
    .filter(Boolean);

  return Array.from(new Set(paths));
}

function slugForSitemap(itemSlug) {
  let slug = itemSlug;
  if (slug.endsWith('/index')) {
    slug = slug.replace('/index', '');
  }
  return createUrl(slug);
}

function createUrl(slug) {
  const BASE_URL = 'https://docs.fuel.network/';

  return `${BASE_URL}${slug.replace('../', '').replace('./', '')}`;
}

function getDocSlug(slug, mdDocs) {
  const actualSlug = slug;

  const item = findDoc(actualSlug, mdDocs);
  if (!item) {
    throw new Error(`${slug} not found`);
  }

  return item.slug;
}

function findDoc(slug, mdDocs) {
  const path = slug.join('/');

  const item = mdDocs.find((doc) => {
    return (
      doc.slug === path ||
      doc.slug === `${path}/index` ||
      doc.slug === `${path}/`
    );
  });

  if (!item) {
    throw new Error(`${slug} not found`);
  }

  return item;
}
