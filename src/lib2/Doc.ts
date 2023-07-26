/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MdDoc } from 'contentlayer/generated';
import { allMdDocs } from 'contentlayer/generated';
import { readFileSync } from 'fs';
import { join } from 'path';

import { DOCS_DIRECTORY } from '../constants';
import type { Config, DocType, SidebarLinkItem } from '../types';

const docConfigPath = join(DOCS_DIRECTORY, '../src/docs.json');
const configFile = JSON.parse(readFileSync(docConfigPath, 'utf8'));

export class Doc {
  md: MdDoc;
  item: DocType;
  config: Config;

  constructor(slug: string[]) {
    const path = slug.join('/');
    const item = allMdDocs.find((doc) => doc.slug === path);

    if (!item) {
      throw new Error(`${slug} not found`);
    }

    const config = this.#getConfig(item.slug);
    const pageLink = join(config.repository, item._raw.flattenedPath);

    const doc = {
      title: item.title || '',
      slug: item.slug,
      category: '',
      pageLink,
      headings: [],
      source: null as any,
      menu: [],
      docsConfig: config,
    };

    this.config = config;
    this.item = doc;
    this.md = item;
  }

  #getConfig(slug: string): Config {
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

  get sidebarLinks() {
    const configSlug = this.config.slug;
    const guideName = this.item.slug.split('/')[0];
    const linksPath = join(
      DOCS_DIRECTORY,
      `../src/sidebar-links/${configSlug}.json`
    );
    const links = JSON.parse(readFileSync(linksPath, 'utf8'));
    if (configSlug === 'guides' && guideName) {
      return [links[guideName.replaceAll('-', '_')]];
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
}
