import fs from 'fs';
import { globby } from 'globby';
import matter from 'gray-matter';
import { join } from 'path';

const DOCS_DIRECTORY = join(process.cwd(), './docs');

export async function getDocs(key, order) {
  let paths = [];
  switch (key) {
    case 'sway':
      paths = [
        // SWAY DOCS
        './sway/docs/book/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
        // IGNORE FORC PAGES
        '!./sway/docs/book/src/forc/*.md',
        '!./sway/docs/book/src/forc/**/*.md',
      ];
      break;
    case 'latest-sway':
      paths = [
        // SWAY DOCS
        './latest/sway/docs/book/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
        // IGNORE FORC PAGES
        '!./latest/sway/docs/book/src/forc/*.md',
        '!./latest/sway/docs/book/src/forc/**/*.md',
      ];
      break;
    case 'forc':
      paths = [
        // FORC DOCS
        './sway/docs/book/src/forc/*.md',
        './sway/docs/book/src/forc/**/*.md',
      ];
      break;
    case 'latest-forc':
      paths = [
        // FORC DOCS
        './latest/sway/docs/book/src/forc/*.md',
        './latest/sway/docs/book/src/forc/**/*.md',
      ];
      break;
    case 'fuels-rs':
      paths = [
        // RUST SDK DOCS
        './fuels-rs/docs/src/**/*.md',
        './fuels-rs/docs/src/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    case 'latest-fuels-rs':
      paths = [
        // RUST SDK DOCS
        './latest/fuels-rs/docs/src/**/*.md',
        './latest/fuels-rs/docs/src/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    case 'fuels-ts':
      paths = [
        // TS SDK DOCS
        './fuels-ts/apps/docs/src/*.md',
        './fuels-ts/apps/docs/src/**/*.md',
        './fuels-ts/apps/docs/src/**/*.md',
      ];
      break;
    case 'latest-fuels-ts':
      paths = [
        // TS SDK DOCS
        './latest/fuels-ts/apps/docs/src/*.md',
        './latest/fuels-ts/apps/docs/src/**/*.md',
        './latest/fuels-ts/apps/docs/src/**/*.md',
      ];
      break;
    case 'wallet':
      paths = [
        // WALLET DOCS
        './fuels-wallet/packages/docs/docs/**/*.mdx',
        './fuels-wallet/packages/docs/docs/*.mdx',
      ];
      break;
    case 'latest-wallet':
      paths = [
        // WALLET DOCS
        './latest/fuels-wallet/packages/docs/docs/**/*.mdx',
        './latest/fuels-wallet/packages/docs/docs/*.mdx',
      ];
      break;
    case 'graphql':
      paths = [
        // GRAPHQL DOCS
        './fuel-graphql-docs/docs/*.mdx',
        './fuel-graphql-docs/docs/**/*.mdx',
      ];
      break;
    case 'latest-graphql':
      paths = [
        // GRAPHQL DOCS
        './latest/fuel-graphql-docs/docs/*.mdx',
        './latest/fuel-graphql-docs/docs/**/*.mdx',
      ];
      break;
    case 'fuelup':
      paths = [
        // FUELUP DOCS
        './fuelup/docs/src/*.md',
        './fuelup/docs/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    case 'latest-fuelup':
      paths = [
        // FUELUP DOCS
        './latest/fuelup/docs/src/*.md',
        './latest/fuelup/docs/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    case 'indexer':
      paths = [
        // INDEXER DOCS
        './fuel-indexer/docs/src/*.md',
        './fuel-indexer/docs/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    case 'latest-indexer':
      paths = [
        // INDEXER DOCS
        './latest/fuel-indexer/docs/src/*.md',
        './latest/fuel-indexer/docs/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    case 'specs':
      paths = [
        // SPECS DOCS
        './fuel-specs/src/*.md',
        './fuel-specs/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    case 'latest-specs':
      paths = [
        // SPECS DOCS
        './latest/fuel-specs/src/*.md',
        './latest/fuel-specs/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    case 'guides':
      paths = [
        // GUIDES
        './guides/**/*.mdx',
      ];
      break;
    // case 'latest-guides':
    //   paths = [
    //     // LATEST GUIDES
    //     // TODO: update guides to use latest
    //     './guides/**/*.mdx',
    //     // './latest/guides/**/*.mdx',
    //   ];
    //   break;
    // case 'about-fuel':
    // case 'latest-about-fuel':
    //   paths = [
    //     // ABOUT FUEL DOCS
    //     './about-fuel/*.md',
    //     './about-fuel/**/*.md',
    //   ];
    //   break;
    default:
      break;
  }

  paths = await globby(paths, {
    cwd: DOCS_DIRECTORY,
  });

  const duplicateAPIItems = [];
  const duplicateAPICategories = [];
  order.menu.forEach((item) => {
    if (item.startsWith('API-')) {
      duplicateAPIItems.push(item);
    }
  });

  duplicateAPIItems.forEach((item) => {
    const split = item.split('-');
    split.shift();
    const category = split.join('-');
    duplicateAPICategories.push(category);
  });

  const final = paths.map((path) => {
    return {
      slug: removeDocsPath(path, duplicateAPICategories),
      path,
    };
  });
  return final;
}

function removeDocsPath(path, duplicateAPICategories) {
  // clean up the url paths
  const configPath = join(DOCS_DIRECTORY, `../src/config/paths.json`);
  const pathsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  let newPath = path;
  duplicateAPICategories.forEach((category) => {
    const cat = category.replace(' ', '-');
    const apiPath = `/api/${cat}`;
    if (path.includes(apiPath)) {
      newPath = path.replace(category, `API-${category}`);
    }
  });

  Object.keys(pathsConfig).forEach((key) => {
    newPath = newPath.replaceAll(key, pathsConfig[key]);
  });

  // handle mdbooks folders that use a same name file instead of index.md
  if (
    newPath.includes('/sway/') ||
    newPath.includes('/fuels-rs/') ||
    newPath.includes('/forc/') ||
    newPath.includes('/indexer/') ||
    newPath.includes('/fuelup/') ||
    newPath.includes('/specs/')
  ) {
    const paths = newPath.split('/');
    const length = paths.length - 1;
    const last = paths[length].split('.')[0];
    const cat = paths[length - 1];
    if (last === cat) {
      paths.pop();
      newPath = `${paths.join('/')}/`;
    }
  }

  return newPath;
}

export function getDocBySlug(slug, slugs) {
  let slugPath = slugs.find(
    ({ slug: pathSlug }) => pathSlug === `./${slug}.md`
  );
  if (!slugPath) {
    slugPath = slugs.find(({ slug: pathSlug }) => pathSlug.includes(slug));
  }
  if (!slugPath) {
    throw new Error(`${slug} not found`);
  }

  const fullpath = join(DOCS_DIRECTORY, slugPath.path);
  const document = fs.readFileSync(fullpath, 'utf8');
  const { data } = matter(document);
  if (!data.title) {
    const paths = fullpath.split('/');
    data.title = paths
      .pop()
      ?.replace(/\.(md|mdx)$/, '')
      .replaceAll(/[_-]/g, ' ');
    data.category = paths.pop()?.replaceAll('-', ' ');
  }

  const doc = {};
  const FIELDS = ['title', 'slug', 'content', 'category'];

  // Ensure only the minimal needed data is exposed
  FIELDS.forEach((field) => {
    if (field === 'slug') {
      doc[field] = data.slug || slug.replace(/(\.mdx|\.md)$/, '');
    }
    if (typeof data[field] !== 'undefined') {
      doc[field] = data[field];
    }
  });

  if (doc.category === 'forc_client') {
    doc.category = 'plugins';
  }
  if (doc.title === 'index') {
    doc.title =
      doc.category === 'src'
        ? slug.replace('./', '').replace('.md', '')
        : doc.category;
    if (slug.endsWith('/forc_client.md')) doc.title = 'forc_client';
  }

  if (doc.title === 'README') {
    const arr = doc.slug.split('/');
    const newLabel = arr[arr.length - 1];
    doc.title = newLabel;
  }

  if (doc.slug.includes('fuels-ts/API-')) {
    doc.category = `API-${doc.category}`;
  }

  return {
    ...doc,
  };
}
