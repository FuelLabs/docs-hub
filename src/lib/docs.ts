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
  let paths: string[] = [];
  const cache = pathsCache.get(config.slug);
  if (cache) return cache;
  switch (config.slug) {
    case 'sway':
      paths = await globby(
        [
          // SWAY DOCS
          './sway/docs/book/src/**/*.md',
          // IGNORE ALL SUMMARY PAGES
          '!**/SUMMARY.md',
          // IGNORE FORC PAGES
          '!./sway/docs/book/src/forc/*.md',
          '!./sway/docs/book/src/forc/**/*.md',
        ],
        {
          cwd: DOCS_DIRECTORY,
        }
      );
      break;
    case 'forc':
      paths = await globby(
        [
          // FORC DOCS
          './sway/docs/book/src/forc/*.md',
          './sway/docs/book/src/forc/**/*.md',
          // REMOVE UNUSED FILES
          // TODO: REMOVE FROM SWAY BOOK
          '!./sway/docs/book/src/forc/commands/forc_deploy.md',
          '!./sway/docs/book/src/forc/commands/forc_run.md',
        ],
        {
          cwd: DOCS_DIRECTORY,
        }
      );
      break;
    case 'fuels-rs':
      paths = await globby(
        [
          // RUST SDK DOCS
          './fuels-rs/docs/src/**/*.md',
          './fuels-rs/docs/src/*.md',
          // IGNORE ALL SUMMARY PAGES
          '!**/SUMMARY.md',
        ],
        {
          cwd: DOCS_DIRECTORY,
        }
      );
      break;
    case 'fuels-ts':
      paths = await globby(
        [
          // TS SDK DOCS
          './fuels-ts/apps/docs/src/*.md',
          './fuels-ts/apps/docs/src/**/*.md',
          './fuels-ts/apps/docs/src/**/*.md',
        ],
        {
          cwd: DOCS_DIRECTORY,
        }
      );
      break;
    case 'fuels-wallet':
      paths = await globby(
        [
          // WALLET DOCS
          './fuels-wallet/packages/docs/docs/**/*.mdx',
          './fuels-wallet/packages/docs/docs/*.mdx',
        ],
        {
          cwd: DOCS_DIRECTORY,
        }
      );
      break;
    case 'fuel-graphql-docs':
      paths = await globby(
        [
          // GRAPHQL DOCS
          './fuel-graphql-docs/docs/*.mdx',
          './fuel-graphql-docs/docs/**/*.mdx',
        ],
        {
          cwd: DOCS_DIRECTORY,
        }
      );
      break;
    case 'fuelup':
      paths = await globby(
        [
          // FUELUP DOCS
          './fuelup/docs/src/*.md',
          './fuelup/docs/src/**/*.md',
          // IGNORE ALL SUMMARY PAGES
          '!**/SUMMARY.md',
        ],
        {
          cwd: DOCS_DIRECTORY,
        }
      );
      break;
    case 'fuel-indexer':
      paths = await globby(
        [
          // INDEXER DOCS
          './fuel-indexer/docs/src/*.md',
          './fuel-indexer/docs/src/**/*.md',
          // IGNORE ALL SUMMARY PAGES
          '!**/SUMMARY.md',
        ],
        {
          cwd: DOCS_DIRECTORY,
        }
      );
      break;
    case 'fuel-specs':
      paths = await globby(
        [
          // SPECS DOCS
          './fuel-specs/src/*.md',
          './fuel-specs/src/**/*.md',
          // IGNORE ALL SUMMARY PAGES
          '!**/SUMMARY.md',
        ],
        {
          cwd: DOCS_DIRECTORY,
        }
      );
      break;
    default:
      paths = await globby(
        [
          // PORTAL DOCS
          '../portal/*.md',
          '../portal/*.mdx',
          '../portal/**/*.mdx',
        ],
        {
          cwd: DOCS_DIRECTORY,
        }
      );
      break;
  }

  const final = paths.map((path) => {
    return {
      slug: removeDocsPath(path),
      path,
    };
  });
  pathsCache.set(config.slug, final);
  return final;
}

export async function getDocFromSlug(
  slug: string,
  config: Config
): Promise<DocPathType> {
  const slugs = await getDocs(config);
  let slugPath = slugs.find(
    ({ slug: pathSlug }) => pathSlug === `./${slug}.md`
  );
  if (!slugPath) {
    slugPath = slugs.find(({ slug: pathSlug }) => pathSlug.includes(slug));
  }
  if (!slugPath) {
    throw new Error(`${slug} not found`);
  }
  return slugPath;
}

export async function getDocPath({ path }: DocPathType) {
  return join(DOCS_DIRECTORY, path);
}

const docConfigPath = join(DOCS_DIRECTORY, '../portal/docs.json');
const configFile = JSON.parse(readFileSync(docConfigPath, 'utf8'));

export async function getDocConfig(slug: string): Promise<Config> {
  try {
    let book = slug;
    if (slug.startsWith('.')) {
      book = slug.split('/')[1].replace('.md', '');
    } else if (slug.includes('/')) {
      book = slug.split('/')[0];
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
    const title = paths
      .pop()
      ?.replace(/\.(md|mdx)$/, '')
      .replaceAll(/[_-]/g, ' ');
    data.title = title;
    const category = paths.pop()?.replaceAll('-', ' ');
    data.category = category;
  }
  return {
    data,
    content,
  };
}

export async function getRepositoryLink(config: Config, doc: DocPathType) {
  return join(config.repository, doc.path);
}

export function splitSlug(slug?: string) {
  return (slug || '').split('/');
}

export function joinSlug(slugs?: string[]) {
  return (slugs || []).join('/');
}
