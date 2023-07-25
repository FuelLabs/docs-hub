import { readFileSync } from 'fs';
import { globby } from 'globby';
import matter from 'gray-matter';
import { join } from 'path';

import { DOCS_DIRECTORY } from '../constants';
import type { Config } from '../types';

import { removeDocsPath } from './urls';

type DocPathType = {
  slug: string;
  path: string;
};

const pathsCache = new Map<string, DocPathType[]>();

export async function getDocs(config: Config): Promise<DocPathType[]> {
  const cache = pathsCache.get(config?.slug);
  if (cache) return cache;
  let paths: string[] = [];
  paths = [
    // SWAY DOCS
    './sway/docs/book/src/**/*.md',
    // IGNORE ALL SUMMARY PAGES
    '!**/SUMMARY.md',
    // IGNORE FORC PAGES
    '!./sway/docs/book/src/forc/*.md',
    '!./sway/docs/book/src/forc/**/*.md',
  ];
  paths = [
    // FORC DOCS
    './sway/docs/book/src/forc/*.md',
    './sway/docs/book/src/forc/**/*.md',
    // REMOVE UNUSED FILES
    '!./sway/docs/book/src/forc/commands/forc_deploy.md',
    '!./sway/docs/book/src/forc/commands/forc_run.md',
  ];
  paths = [
    // RUST SDK DOCS
    './fuels-rs/docs/src/**/*.md',
    './fuels-rs/docs/src/*.md',
    // IGNORE ALL SUMMARY PAGES
    '!**/SUMMARY.md',
  ];
  paths = [
    // TS SDK DOCS
    './fuels-ts/apps/docs/src/*.md',
    './fuels-ts/apps/docs/src/**/*.md',
    './fuels-ts/apps/docs/src/**/*.md',
  ];
  paths = [
    // WALLET DOCS
    './fuels-wallet/packages/docs/docs/**/*.mdx',
    './fuels-wallet/packages/docs/docs/*.mdx',
  ];
  paths = [
    // GRAPHQL DOCS
    './fuel-graphql-docs/docs/*.mdx',
    './fuel-graphql-docs/docs/**/*.mdx',
  ];
  paths = [
    // FUELUP DOCS
    './fuelup/docs/src/*.md',
    './fuelup/docs/src/**/*.md',
    // IGNORE ALL SUMMARY PAGES
    '!**/SUMMARY.md',
  ];
  paths = [
    // INDEXER DOCS
    './fuel-indexer/docs/src/*.md',
    './fuel-indexer/docs/src/**/*.md',
    // IGNORE ALL SUMMARY PAGES
    '!**/SUMMARY.md',
  ];
  paths = [
    // SPECS DOCS
    './fuel-specs/src/*.md',
    './fuel-specs/src/**/*.md',
    // IGNORE ALL SUMMARY PAGES
    '!**/SUMMARY.md',
  ];
  paths = [
    // GUIDES
    '../guides/*.mdx',
    '../guides/**/*.mdx',
  ];

  paths = await globby(paths, {
    cwd: DOCS_DIRECTORY,
  });

  const final = paths
    .map((path) => {
      const p = path.replace(/.(mdx?)$/, '');
      if (p.includes('SUMMARY')) return;
      return {
        slug: removeDocsPath(p),
        path,
      };
    })
    .filter(Boolean) as DocPathType[];

  pathsCache.set(config?.slug, final);
  return final;
}

export async function getDocFromSlug(
  slug: string,
  config: Config
): Promise<DocPathType> {
  const slugs = await getDocs(config);
  let slugPath = slugs.find(({ slug: pathSlug }) => {
    const realSlug = slug.startsWith('guides/')
      ? `../${slug}.mdx`
      : `./${slug}.md`;
    return pathSlug === realSlug;
  });
  if (!slugPath) {
    slugPath = slugs.find(({ slug: pathSlug }) => pathSlug.includes(slug));
  }
  if (!slugPath) {
    throw new Error(`${slug} not found`);
  }
  return slugPath;
}

const docConfigPath = join(DOCS_DIRECTORY, '../src/docs.json');
const configFile = JSON.parse(readFileSync(docConfigPath, 'utf8'));

export async function getDocConfig(slug: string): Promise<Config> {
  try {
    let book = slug;
    if (slug.startsWith('.')) {
      book = slug.split('/')[1].replace('.md', '');
    } else if (slug.includes('/')) {
      book = slug.split('/')[0];
    } else if (slug.startsWith('fuel-')) {
      book = slug.replace('fuel-', '');
    }
    return configFile[book];
  } catch (e) {
    throw new Error(`${slug} docs.json not found`);
  }
}

export async function getDocContent(path: string) {
  const document = readFileSync(path, 'utf8');
  const { data, content } = matter(document);
  if (!data.title) {
    const paths = path.split('/');
    data.title = paths
      .pop()
      ?.replace(/\.(md|mdx)$/, '')
      .replaceAll(/[_-]/g, ' ');
    data.category = paths.pop()?.replaceAll('-', ' ');
  }

  return {
    data,
    content,
  };
}
