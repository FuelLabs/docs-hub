import { existsSync, readFileSync } from 'fs';
import { globby } from 'globby';
import matter from 'gray-matter';
import { join } from 'path';

import { DOCS_DIRECTORY } from '../constants';
import type { DocsConfig } from '../types';

import { removeDocsPath } from './urls';

type DocPathType = {
  slug: string;
  path: string;
};

export async function getDocs(): Promise<DocPathType[]> {
  const paths = await globby(
    [
      // PORTAL DOCS
      '../portal/*.md',
      '../portal/*.mdx',
      '../portal/**/*.mdx',
      // SWAY DOCS
      './sway/docs/book/src/**/*.md',
      // RUST SDK DOCS
      './fuels-rs/docs/src/**/*.md',
      './fuels-rs/docs/src/*.md',
      // TS SDK DOCS
      './fuels-ts/apps/docs/src/*.md',
      './fuels-ts/apps/docs/src/**/*.md',
      './fuels-ts/apps/docs/src/**/*.md',
      // WALLET DOCS
      './fuels-wallet/packages/docs/docs/**/*.mdx',
      './fuels-wallet/packages/docs/docs/*.mdx',
      // GRAPHQL DOCS
      './fuel-graphql-docs/docs/*.mdx',
      './fuel-graphql-docs/docs/**/*.mdx',
      // FUELUP DOCS
      './fuelup/docs/src/*.md',
      './fuelup/docs/src/**/*.md',
      // INDEXER DOCS
      './fuel-indexer/docs/src/*.md',
      './fuel-indexer/docs/src/**/*.md',
      // SPECS DOCS
      './fuel-specs/src/*.md',
      './fuel-specs/src/**/*.md',
      // IGNORE ALL SUMMARY PAGES
      '!**/SUMMARY.md',
      // REMOVE UNUSED FILES
      // TODO: REMOVE FROM SWAY BOOK
      '!./sway/docs/book/src/forc/commands/forc_deploy.md',
      '!./sway/docs/book/src/forc/commands/forc_run.md',
    ],
    {
      cwd: DOCS_DIRECTORY,
    }
  );
  return paths.map((path) => {
    const finalPaths = {
      slug: removeDocsPath(path),
      path,
    };
    return finalPaths;
  });
}

export async function getDocFromSlug(slug: string): Promise<DocPathType> {
  const slugs = await getDocs();
  const slugPath = slugs.find(({ slug: pathSlug }) => {
    if (
      slug === 'forc' ||
      slug === 'forc/commands' ||
      slug === 'forc/plugins'
    ) {
      return pathSlug === `./${slug}.md`;
    }
    return pathSlug.includes(slug);
  });
  if (!slugPath) {
    throw new Error(`${slug} not found`);
  }
  return slugPath;
}

export async function getDocPath({ path }: DocPathType) {
  return join(DOCS_DIRECTORY, path);
}

export async function getDocConfig(name: string): Promise<DocsConfig> {
  const docConfigPath = join(DOCS_DIRECTORY, '../portal/docs.json');
  if (existsSync(docConfigPath)) {
    return JSON.parse(readFileSync(docConfigPath, 'utf8'));
  }
  throw new Error(`${name} docs.json not found`);
}

export async function getDocContent(path: string) {
  const document = readFileSync(path, 'utf8');
  const { data, content } = matter(document);
  if (!data.title) {
    const paths = path.split('/');
    const title = paths
      .pop()
      ?.replace('.md', '')
      .replace('.mdx', '')
      .replaceAll('_', ' ')
      .replaceAll('-', ' ');
    data.title = title;
    const category = paths.pop()?.replaceAll('-', ' ');
    data.category = category;
  }
  return {
    data,
    content,
  };
}

export async function getRepositoryLink(config: DocsConfig, doc: DocPathType) {
  const path = doc.path.split('/')[1];
  const docConfig = config[path];
  return join(docConfig.repository, doc.path);
}

export function splitSlug(slug?: string) {
  return (slug || '').split('/');
}

export function joinSlug(slugs?: string[]) {
  return (slugs || []).join('/');
}
