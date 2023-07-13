/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
import { readFileSync } from 'fs';
import { serialize } from 'next-mdx-remote/serialize';
import { join } from 'path';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import type { Pluggable } from 'unified';
import { codeExamples } from '~/docs/fuel-graphql-docs/src/lib/code-examples';
import { codeImport } from '~/docs/fuels-wallet/packages/docs/src/lib/code-import';
import { FIELDS, DOCS_DIRECTORY } from '~/src/constants';
import type { DocType, NodeHeading, SidebarLinkItem } from '~/src/types';

import { getDocConfig, getDocContent, getDocFromSlug } from './docs';
import { handlePlugins } from './plugins/plugins';
import { rehypeExtractHeadings } from './toc';
import { getMdxCode } from './plugins/rehype-code';
import { fixIndent } from './plugins/fix-indent';

const docsCache = new Map<string, DocType>();

export async function getDocBySlug(slug: string): Promise<DocType> {
  const cache = docsCache.get(`${slug}`);
  if (cache) return cache;

  const docsConfig = await getDocConfig(slug);
  const slugPath = await getDocFromSlug(slug, docsConfig);
  const fullpath = join(DOCS_DIRECTORY, slugPath.path);
  const { data, content } = await getDocContent(fullpath);
  const doc: any = {};

  // Ensure only the minimal needed data is exposed
  FIELDS.forEach((field) => {
    if (field === 'slug') {
      doc[field] = data.slug || slug.replace(/(\.mdx|\.md)$/, '');
    }
    if (field === 'content') {
      doc[field] = content;
    }
    if (typeof data[field] !== 'undefined') {
      doc[field] = data[field];
    }
  });
  let source: any = '';
  const headings: NodeHeading[] = [];

  const pageLink = join(docsConfig.repository, slugPath.path);
  doc.pageLink = pageLink;
  const isGraphQLDocs = fullpath.includes('fuel-graphql-docs/docs');
  const isWalletDocs = fullpath.includes('fuels-wallet/packages/docs/');
  // parse the wallet and graphql docs as mdx, otherwise use md
  const format = isWalletDocs || isGraphQLDocs ? 'mdx' : 'md';
  const plugins: Pluggable<any[]>[] = [[handlePlugins, { filepath: fullpath }]];
  // handle the codeExamples component in the graphql docs
  if (isGraphQLDocs) plugins.push([codeExamples, { filepath: fullpath }]);
  // handle wallet code import component
  if (isWalletDocs) plugins.push([codeImport, { filepath: fullpath }]);

  source = await serialize(content, {
    scope: data,
    mdxOptions: {
      format,
      remarkPlugins: [remarkSlug, remarkGfm, ...plugins, fixIndent(fullpath)],
      rehypePlugins: [...getMdxCode(), [rehypeExtractHeadings, { headings }]],
    },
  });

  if (doc.category === 'forc_client') {
    doc.category = 'plugins';
  }
  if (doc.title === 'index') {
    doc.title =
      doc.category === 'src'
        ? slug.replace('./', '').replace('.md', '')
        : doc.category;
  }

  if (doc.title === 'README') {
    const arr = doc.slug.split('/');
    const newLabel = arr[arr.length - 1];
    doc.title = newLabel;
  }

  const final = {
    ...doc,
    source,
    headings,
    docsConfig,
  } as DocType;
  docsCache.set(slug, final);
  return final;
}

function parseSlug(slug?: string) {
  if (!slug) return null;
  slug = slug.replace('../', '');
  slug = slug.startsWith('./') ? slug.slice(2) : slug;
  return slug;
}

export function getDocLink(
  links: Awaited<ReturnType<typeof getSidebarLinks>>,
  slug: string,
) {
  const parsedSlug = parseSlug(slug) as string;
  const flatLinks = links
    .flatMap((i) => (i.submenu || i) as SidebarLinkItem | SidebarLinkItem[])
    .map((i) => {
      return { ...i, slug: parseSlug(i.slug) };
    });

  const idx = flatLinks.findIndex((i) => {
    if (!i.slug) return false;
    return i.slug.startsWith(parsedSlug);
  });

  const prev = flatLinks[idx - 1] ?? null;
  const next = idx + 1 < flatLinks.length ? flatLinks[idx + 1] ?? null : null;
  const current = flatLinks[idx];
  const link = { prev, next, ...current };
  return link;
}

export async function getSidebarLinks(
  configSlug: string,
): Promise<SidebarLinkItem[]> {
  const linksPath = join(
    DOCS_DIRECTORY,
    `../src/sidebar-links/${configSlug}.json`,
  );
  const links = JSON.parse(readFileSync(linksPath, 'utf8'));
  return links;
}
