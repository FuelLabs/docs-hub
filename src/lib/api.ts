import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';

import {
  getDocConfig,
  getDocContent,
  getDocFromSlug,
  getDocPath,
  getDocs,
  getRepositoryLink,
} from './docs';
import { handlePlugins } from './plugins/plugins';
import { rehypeExtractHeadings } from './toc';

import { codeExamples } from '~/docs/fuel-graphql-docs/src/lib/code-examples';
import { FIELDS } from '~/src/constants';
import type {
  Config,
  DocType,
  NodeHeading,
  SidebarLinkItem,
} from '~/src/types';

export async function getDocBySlug(slug: string): Promise<DocType> {
  const realSlug = slug.replace(/(\.mdx|\.md)$/, '');
  const docsConfig = await getDocConfig(slug);
  const slugPath = await getDocFromSlug(slug, docsConfig);
  const fullpath = await getDocPath(slugPath);
  const pageLink = await getRepositoryLink(docsConfig, slugPath);
  const { data, content } = await getDocContent(fullpath);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = {
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

  // parse the wallet and graphql docs as mdx, otherwise use md
  const format =
    fullpath.includes('fuels-wallet/packages/docs/') ||
    fullpath.includes('fuel-graphql-docs/docs')
      ? 'mdx'
      : 'md';

  const headings: NodeHeading[] = [];
  const source = await serialize(content, {
    scope: data,
    mdxOptions: {
      format,
      remarkPlugins: [
        remarkSlug,
        remarkGfm,
        [handlePlugins, { filepath: fullpath }],
        // handle the codeExamples component in the graphql docs
        [codeExamples, { filepath: fullpath }],
      ],
      rehypePlugins: [[rehypeExtractHeadings, { headings }]],
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

  return {
    ...doc,
    source,
    headings,
    // change this to just the config, or remove if not using
    docsConfig,
  } as DocType;
}

export async function getAllDocs(config: Config) {
  const slugs = await getDocs(config);
  return Promise.all(slugs.map(({ slug }) => getDocBySlug(slug)));
}

export async function getSidebarLinks(config: Config) {
  const docs = await getAllDocs(config);
  const links = docs.reduce((list, thisDoc) => {
    const doc = thisDoc;
    if (doc.slug.split('/')[1] !== config.slug) {
      return list;
    }
    if (doc.category === 'forc_client') {
      doc.category = 'plugins';
    }

    if (
      !doc.category ||
      doc.category === 'src' ||
      doc.category === 'forc' ||
      (doc.category === 'guide' && doc.title === 'guide')
    ) {
      let newLabel = doc.title;
      if (doc.title === 'index' || doc.title === 'README') {
        const arr = doc.slug.split('/');
        newLabel = arr[arr.length - 1];
      }
      return list.concat({ slug: doc.slug, label: newLabel });
    }

    const categoryIdx = list.findIndex((l) => {
      return l?.label === doc.category;
    });
    /** Insert category item based on order prop */
    if (categoryIdx >= 0) {
      const submenu = list[categoryIdx]?.submenu || [];
      let newLabel = doc.title;
      if (doc.title === 'index') {
        const arr = doc.slug.split('/');
        newLabel = arr[arr.length - 1];
      }
      submenu.push({
        slug: doc.slug,
        label: newLabel,
      });
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
          const lowerA = a.label.toLowerCase();
          const lowerB = b.label.toLowerCase();
          const aIdx = lcOrder.indexOf(lowerA);
          const bIdx = lcOrder.indexOf(lowerB);
          if (!a.subpath && !b.subpath) {
            return aIdx - bIdx;
          }
          if (a.subpath && b.subpath) {
            const aFirst = lcOrder.filter((i) => i.startsWith(lowerA))?.[0];
            const bFirst = lcOrder.filter((i) => i.startsWith(lowerB))?.[0];
            return lcOrder.indexOf(aFirst) - lcOrder.indexOf(bFirst);
          }
          const category = a.subpath ? lowerA : lowerB;
          const first = lcOrder.filter((i) => i.startsWith(category))?.[0];
          const idx = lcOrder.indexOf(first);
          return a.subpath ? idx - bIdx : aIdx - idx;
        })
        /** Sort categoried links */
        .map((link) => {
          if (!link.submenu) return link;
          const key = `${link.label.toLowerCase().replaceAll(' ', '_')}_menu`;
          let catOrder = config[key];
          catOrder = catOrder?.map((title) => title.toLowerCase());
          const submenu = link.submenu.sort((a, b) => {
            const lowerA = a.label.toLowerCase();
            const lowerB = b.label.toLowerCase();
            const result = catOrder
              ? catOrder.indexOf(`${lowerA}`) - catOrder.indexOf(`${lowerB}`)
              : 0;
            return result;
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

// export function getDocLink(
//   links: Awaited<ReturnType<typeof getSidebarLinks>>,
//   slug: string
// ) {
//   links
//     .flatMap((i) => (i.submenu || i) as SidebarLinkItem | SidebarLinkItem[])
//     .find((i) => {
//       if (i.slug?.startsWith('../portal')) {
//         return i.slug === `../${slug}`;
//       }
//       return i.slug === slug;
//     });

//   return links;
// }
