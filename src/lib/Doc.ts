import { compile } from '@mdx-js/mdx';
import { addRawDocumentToVFile } from 'contentlayer/core';
import type { MdDoc } from 'contentlayer/generated';
import { readFileSync } from 'fs';
import { join } from 'path';

import { DOCS_DIRECTORY } from '../constants';
import type { Config, DocType, SidebarLinkItem } from '../types';

import { Docs } from './Docs';
import { rehypePlugins, remarkPlugins } from './md-plugins';
import { rehypeExtractHeadings } from './plugins/toc';

const docConfigPath = join(DOCS_DIRECTORY, '../src/docs.json');
const configFile = JSON.parse(readFileSync(docConfigPath, 'utf8'));
const BASE_URL = 'https://docs-hub.vercel.app/';

export class Doc {
  md: MdDoc;
  item: DocType;
  config: Config;

  constructor(slug: string[], mdDocs: MdDoc[]) {
    const item = Docs.findDoc(slug, mdDocs);

    if (!item) {
      throw new Error(`${slug} not found`);
    }

    const config = this.#getConfig(item.slug);
    const pageLink = join(config.repository, item._raw.flattenedPath);

    this.md = item;
    this.config = config;

    const doc = {
      pageLink,
      _raw: item._raw,
      title: this.#getTitle(item.title),
      slug: item.slug,
      category: item.category ?? null,
      headings: [],
      menu: [],
      docsConfig: {
        ...config,
        slug: item.slug,
      },
    } as DocType;

    if (config.slug === 'guides') {
      doc.parent = {
        label: 'Guides',
        link: '/guides',
      };
    }

    this.item = doc;
  }

  #getConfig(slug: string): Config {
    try {
      if (slug.startsWith('docs/')) {
        slug = slug.replace('docs/', '');
      }
      if (slug.startsWith('.')) {
        slug = slug.split('/')[1].replace('.md', '');
      }
      if (slug.includes('/')) {
        slug = slug.split('/')[0];
      }
      if (slug.startsWith('fuel-')) {
        slug = slug.replace('fuel-', '');
      }
      console.log(slug);
      return configFile[slug];
    } catch (e) {
      throw new Error(`${slug} docs.json not found`);
    }
  }

  #getTitle(title?: string) {
    if (title) return title;
    return this.config.title || '';
  }

  async getCode() {
    const doc = this.md;
    const code = await compile(doc.body.raw, {
      outputFormat: 'function-body',
      format: doc._raw.contentType === 'markdown' ? 'md' : 'mdx',
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [addRawDocumentToVFile(this.md._raw), ...remarkPlugins],
      rehypePlugins: [
        ...rehypePlugins,
        rehypeExtractHeadings({
          headings: this.item.headings,
        }),
      ],
    });

    return String(code);
  }

  slugForSitemap() {
    let slug = this.item.slug;
    if (slug.endsWith('/index')) {
      slug = slug.replace('/index', '');
    }
    return this.#createUrl(slug);
  }

  get sidebarLinks() {
    const configSlug = this.config.slug;
    const guideName = this.item.slug.split('/')[0];
    const linksPath = join(
      DOCS_DIRECTORY,
      `../src/sidebar-links/${configSlug}.json`
    );
    const links = JSON.parse(readFileSync(linksPath, 'utf8'));
    if (configSlug === 'guides' && guideName) {
      const slug = this.item.slug
        .replace(`${guideName}/`, '')
        .replace('/index', '');

      const key = slug.split('/')[0].replaceAll('-', '_');
      const guideLinks = [links[key]];
      return guideLinks as SidebarLinkItem[];
    }
    return links as SidebarLinkItem[];
  }

  get navLinks() {
    const slug = this.#parseSlug(this.item.slug);
    const links = this.sidebarLinks;
    const flatLinks = links
      .flatMap((i) => (i.submenu || i) as SidebarLinkItem | SidebarLinkItem[])
      .map((i) => ({ ...i, slug: this.#parseSlug(i.slug) }));

    const idx = flatLinks.findIndex((i) => {
      if (!i.slug) return false;
      return i.slug.startsWith(slug || '');
    });

    const prev = flatLinks[idx - 1] ?? null;
    const next = idx + 1 < flatLinks.length ? flatLinks[idx + 1] ?? null : null;
    const current = flatLinks[idx];
    const link = { prev, next, ...current };
    return link;
  }

  #parseSlug(slug?: string) {
    if (!slug) return null;
    slug = slug.replace('../', '');
    slug = slug.startsWith('./') ? slug.slice(2) : slug;
    return slug;
  }

  #createUrl(slug: string) {
    return `${BASE_URL}${slug.replace('../', '').replace('./', '')}`;
  }
}
