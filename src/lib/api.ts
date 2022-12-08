import fs from 'fs';
import { globby } from 'globby';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { join, relative } from 'path';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';

import { codeImport } from './code-import';
import { rehypeExtractHeadings } from './toc';

import { FIELDS } from '~/src/constants';
import type { DocType, NodeHeading, SidebarLinkItem } from '~/src/types';

const DOCS_DIRECTORY = join(process.cwd(), './docs');

export async function getDocsSlugs() {
  const paths = await globby(['./**/*.mdx', './**/**.md'], {
    cwd: DOCS_DIRECTORY,
  });
  return paths.map(path => ({
    slug: path.replace('docs/', ''),
    path,
  }));
}

export async function getDocSlugPath(slug: string) {
  const slugs = await getDocsSlugs();
  const slugPath = slugs.find(({ slug: pathSlug }) => pathSlug.includes(slug));
  if (!slugPath) {
    throw new Error(`${slug} not found`);
  }
  return slugPath;
}

export async function getDocFullPath(slugPath: { slug: string; path: string; }) {
  return join(DOCS_DIRECTORY, slugPath.path);
}

export async function getDocBySlug(
  slug: string
): Promise<DocType> {
  const realSlug = slug.replace(/\.md?x$/, '');
  const slugPath = await getDocSlugPath(slug);
  const fullpath = await getDocFullPath(slugPath);
  const docsConfig = JSON.parse(fs.readFileSync(join(DOCS_DIRECTORY, 'graphql/docs.json'), 'utf8'));
  const fileContents = fs.readFileSync(fullpath, 'utf8');
  const { data, content } = matter(fileContents);
  const pageLink = join(
    docsConfig.repository,
    '/docs/',
    slugPath.path
  );
  const doc = {
    pageLink,
  };

  // Ensure only the minimal needed data is exposed
  FIELDS.forEach((field) => {
    if (field === 'slug') {
      doc[field] = data.slug || realSlug;
    }
    if (field === 'content') {
      doc[field] = content;
    }
    if (typeof data[field] !== 'undefined') {
      doc[field] = data[field];
    }
  });

  const headings: NodeHeading[] = [];
  const source = await serialize(content, {
    scope: data,
    mdxOptions: {
      format: 'mdx',
      remarkPlugins: [
        remarkSlug,
        remarkGfm,
        [codeImport, { filepath: fullpath }],
      ],
      rehypePlugins: [[rehypeExtractHeadings, { headings }]],
    },
  });

  return {
    ...doc,
    source,
    headings,
    docsConfig,
  } as DocType;
}

export async function getAllDocs() {
  const slugs = await getDocsSlugs();
  return Promise.all(slugs.map(({ slug }) => getDocBySlug(slug)));
}

export async function getSidebarLinks(order: string[]) {
  const docs = await getAllDocs();
  const links = docs.reduce((list, doc) => {
    if (!doc.category) {
      return list.concat({ slug: doc.slug, label: doc.title });
    }

    const categoryIdx = list.findIndex((l) => l?.label === doc.category);
    /** Insert category item based on order prop */
    if (categoryIdx > 0) {
      const submenu = list[categoryIdx]?.submenu || [];
      submenu.push({ slug: doc.slug, label: doc.title });
      return list;
    }

    const categorySlug = doc.slug.split('/')[0];
    const submenu = [{ slug: doc.slug, label: doc.title }];
    return list.concat({
      subpath: categorySlug,
      label: doc.category,
      submenu,
    });
    /** Insert inside category submenu if category is already on array */
  }, [] as SidebarLinkItem[]);

  const sortedLinks = links
    /** Sort first level links */
    .sort((a, b) => {
      const aIdx = order.indexOf(a.label);
      const bIdx = order.indexOf(b.label);
      if (!a.subpath && !b.subpath) {
        return aIdx - bIdx;
      }
      if (a.subpath && b.subpath) {
        const aFirst = order.filter((i) => i.startsWith(a.label))?.[0];
        const bFirst = order.filter((i) => i.startsWith(b.label))?.[0];
        return order.indexOf(aFirst) - order.indexOf(bFirst);
      }
      const category = a.subpath ? a.label : b.label;
      const first = order.filter((i) => i.startsWith(category))?.[0];
      const idx = order.indexOf(first);
      return a.subpath ? idx - bIdx : aIdx - idx;
    })
    /** Sort categoried links */
    .map((link) => {
      if (!link.submenu) return link;
      const catOrder = order.filter((i) => i.startsWith(link.label));
      const submenu = link.submenu.sort(
        (a, b) =>
          catOrder.indexOf(`${link.label}/${a.label}`) -
          catOrder.indexOf(`${link.label}/${b.label}`)
      );
      return { ...link, submenu };
    });

  const withNextAndPrev = [...sortedLinks].map((doc, idx) => {
    if (doc.submenu) {
      return {
        ...doc,
        submenu: doc.submenu.map((childDoc, cIdx) => {
          const prev = doc.submenu?.[cIdx - 1] ?? sortedLinks[idx - 1] ?? null;
          const next = doc.submenu?.[cIdx + 1] ?? sortedLinks[idx + 1] ?? null;
          return {
            ...childDoc,
            prev: prev?.submenu ? prev.submenu[prev.submenu.length - 1] : prev,
            next: next?.submenu ? next.submenu[0] : next,
          };
        }),
      };
    }
    const prev = sortedLinks[idx - 1] ?? null;
    const next = sortedLinks[idx + 1] ?? null;
    return {
      ...doc,
      prev: prev?.submenu ? prev.submenu[prev.submenu.length - 1] : prev,
      next: next?.submenu ? next.submenu[0] : next,
    };
  });

  return withNextAndPrev;
}
