/* eslint-disable @typescript-eslint/no-explicit-any */
import { compile } from '@mdx-js/mdx';
import { addRawDocumentToVFile } from 'contentlayer/core';
import type { MdDoc } from 'contentlayer/generated';
import { readFileSync } from 'fs';
import { join } from 'path';
import { codeExamples } from '~/docs/fuel-graphql-docs/src/lib/code-examples';
import { codeImport as walletCodeImport } from '~/docs/fuels-wallet/packages/docs/src/lib/code-import';
import { capitalize } from '~/docs/fuels-wallet/packages/docs/src/lib/str';

import { DOCS_DIRECTORY } from '../config/constants';
import type { Config, DocType, SidebarLinkItem } from '../types';

import { Docs } from './md-docs';
import { rehypePlugins, remarkPlugins } from './md-plugins';
import { rehypeExtractHeadings } from './plugins/toc';

const docConfigPath = join(DOCS_DIRECTORY, '../src/config/docs.json');
const configFile = JSON.parse(readFileSync(docConfigPath, 'utf8'));
const BASE_URL = 'https://docs.fuel.network/';

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
    const splitPath = item._raw.flattenedPath.split('/');
    splitPath.splice(0, 2);
    splitPath.pop();
    const actualPath = '/tree/master/' + splitPath.join('/');
    const pageLink = `${config.repository}${actualPath}`;

    this.md = item;
    this.config = config;

    let parent;
    if (!item.parent) {
      if (
        item.slug.includes('docs/fuels-rs') ||
        item.slug.includes('docs/fuels-ts') ||
        item.slug.includes('docs/wallet')
      ) {
        parent = {
          label: 'All SDKs',
          link: '/sdk',
        };
      } else if (
        item.slug.includes('docs/graphql') ||
        item.slug.includes('docs/specs')
        // item.slug.includes('docs/about-fuel')
      ) {
        parent = {
          label: 'All Network Docs',
          link: '/network',
        };
      } else if (
        item.slug.includes('docs/fuelup') ||
        item.slug.includes('docs/forc') ||
        item.slug.includes('docs/indexer')
      ) {
        parent = {
          label: 'All Tooling',
          link: '/tooling',
        };
      } else if (item.slug.includes('docs/sway')) {
        parent = {
          label: 'All Sway Docs',
          link: '/sway',
        };
      }
    }

    const doc = {
      pageLink,
      _raw: item._raw,
      slug: item.slug,
      title: this.#getTitle(item.title),
      parent: item.parent ?? parent ?? null,
      category: item.category ?? null,
      headings: [],
      menu: [],
      docsConfig: {
        ...config,
        slug: item.slug,
      },
    } as DocType;

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
      remarkPlugins: this.#remarkPlugins(),
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
      `../src/generated/sidebar-links/${configSlug}.json`
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
      return (
        `docs/${i.slug}`.startsWith(slug || '') || i.slug.startsWith(slug || '')
      );
    });

    const prev = flatLinks[idx - 1] ?? null;
    if (prev) prev.label = capitalize(prev.label);
    const next = idx + 1 < flatLinks.length ? flatLinks[idx + 1] ?? null : null;
    if (next) next.label = capitalize(next.label);
    const current = flatLinks[idx];
    const link = { prev, next, ...current };
    return link;
  }

  #parseSlug(slug?: string) {
    if (!slug) return null;
    slug = slug.replace('../', '');
    slug = slug.startsWith('./') ? slug.slice(2) : slug;
    if (slug.endsWith('/index')) {
      slug = slug.replace('/index', '');
    }
    return slug;
  }

  #createUrl(slug: string) {
    return `${BASE_URL}${slug.replace('../', '').replace('./', '')}`;
  }

  #remarkPlugins() {
    const filepath = this.md._raw.sourceFilePath;
    let plugins = [addRawDocumentToVFile(this.md._raw), ...remarkPlugins];

    if (this.md.slug.startsWith('docs/wallet/')) {
      plugins = plugins.concat([[walletCodeImport, { filepath }] as any]);
    }
    if (this.md.slug.startsWith('docs/graphql/')) {
      plugins = plugins.concat([[codeExamples, { filepath }] as any]);
    }

    return plugins;
  }
}
