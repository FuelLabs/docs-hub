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
      '../portal/*.md',
      '../portal/*.mdx',
      '../portal/**/*.mdx',
      './sway/docs/book/src/sway-program-types/*.md',
    ],
    {
      cwd: DOCS_DIRECTORY,
    }
  );
  return paths.map((path) => {
    return {
      slug: removeDocsPath(path),
      path,
    };
  });
}

export async function getDocFromSlug(slug: string): Promise<DocPathType> {
  const slugs = await getDocs();
  const realSlug = slug;
  const slugPath = slugs.find(({ slug: pathSlug }) =>
    pathSlug.includes(realSlug)
  );
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
    const title = paths.pop()?.replace('.md', '').replaceAll('_', ' ');
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
