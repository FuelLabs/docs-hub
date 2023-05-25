import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';

import { codeImport } from './code-import';
import {
  getDocConfig,
  getDocContent,
  getDocFromSlug,
  getDocPath,
  getDocs,
  getRepositoryLink,
} from './docs';
import { mdBookExampleImport } from './mdbook-example-import';
import { rehypeExtractHeadings } from './toc';

import { FIELDS } from '~/src/constants';
import type {
  Config,
  DocType,
  NodeHeading,
  SidebarLinkItem,
} from '~/src/types';

export async function getDocBySlug(slug: string): Promise<DocType> {
  const [rootFolder] = slug.split('/');
  const realSlug = slug.replace(/(\.mdx|\.md)$/, '');
  const slugPath = await getDocFromSlug(slug);
  const fullpath = await getDocPath(slugPath);
  const docsConfig = await getDocConfig(rootFolder);
  const pageLink = await getRepositoryLink(docsConfig, slugPath);
  const { data, content } = await getDocContent(fullpath);
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
      format: 'md',
      remarkPlugins: [
        remarkSlug,
        remarkGfm,
        [codeImport, { filepath: fullpath }],
        [mdBookExampleImport, { filepath: fullpath }],
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
  const slugs = await getDocs();
  return Promise.all(slugs.map(({ slug }) => getDocBySlug(slug)));
}

export async function getSidebarLinks(config: Config) {
  const docs = await getAllDocs();
  const links = docs.reduce((list, doc) => {
    if (doc.slug.split('/')[1] !== config.slug) {
      return list;
    }
    if (!doc.category) {
      return list.concat({ slug: doc.slug, label: doc.title });
    }

    const categoryIdx = list.findIndex((l) => {
      return l?.label === doc.category;
    });
    /** Insert category item based on order prop */
    if (categoryIdx >= 0) {
      const submenu = list[categoryIdx]?.submenu || [];
      submenu.push({ slug: doc.slug, label: doc.title });
      return list;
    }

    const subpath = doc.slug.split('/')[1];
    const submenu = [{ slug: doc.slug, label: doc.title }];
    return list.concat({
      subpath,
      label: doc.category,
      submenu,
    });
    /** Insert inside category submenu if category is already on array */
  }, [] as SidebarLinkItem[]);

  const order = config.menu;
  const sortedLinks = order
    ? links
        /** Sort first level links */
        .sort((a, b) => {
          const lcOrder = order.map((o) => o.toLowerCase());
          const aIdx = lcOrder.indexOf(a.label);
          const bIdx = lcOrder.indexOf(b.label);
          if (!a.subpath && !b.subpath) {
            return aIdx - bIdx;
          }
          if (a.subpath && b.subpath) {
            const aFirst = lcOrder.filter((i) => i.startsWith(a.label))?.[0];
            const bFirst = lcOrder.filter((i) => i.startsWith(b.label))?.[0];
            return lcOrder.indexOf(aFirst) - lcOrder.indexOf(bFirst);
          }
          const category = a.subpath ? a.label : b.label;
          const first = order.filter((i) => i.startsWith(category))?.[0];
          const idx = order.indexOf(first);
          return a.subpath ? idx - bIdx : aIdx - idx;
        })
        /** Sort categoried links */
        .map((link) => {
          if (!link.submenu) return link;
          const key = `${link.label.replaceAll(' ', '_')}_menu`;
          let catOrder = config[key];
          catOrder = catOrder?.map((title) => title.toLowerCase());
          const submenu = link.submenu.sort((a, b) => {
            return catOrder
              ? catOrder.indexOf(`${a.label.toLowerCase()}`) -
                  catOrder.indexOf(`${b.label.toLowerCase()}`)
              : 0;
          });
          return { ...link, submenu };
        })
    : links;

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

export function getDocLink(
  links: Awaited<ReturnType<typeof getSidebarLinks>>,
  slug: string
) {
  links
    .flatMap((i) => (i.submenu || i) as SidebarLinkItem | SidebarLinkItem[])
    .find((i) => {
      if (i.slug?.startsWith('../portal')) {
        return i.slug === `../${slug}`;
      }
      return i.slug === slug;
    });

  return links;
}
