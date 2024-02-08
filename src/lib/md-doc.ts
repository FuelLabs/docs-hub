/* eslint-disable @typescript-eslint/no-explicit-any */
import { compile } from '@mdx-js/mdx';
import { addRawDocumentToVFile } from 'contentlayer/core';
import type { MdDoc } from 'contentlayer/generated';
import { readFileSync } from 'fs';
import { join } from 'path';
import { codeExamples } from '~/docs/fuel-graphql-docs/src/lib/code-examples';
import { codeImport as walletCodeImport } from '~/docs/fuels-wallet/packages/docs/src/lib/code-import';
import { codeExamples as nightlyCodeExamples } from '~/docs/nightly/fuel-graphql-docs/src/lib/code-examples';
import { codeExamples as beta4CodeExamples } from '~/docs/beta-4/fuel-graphql-docs/src/lib/code-examples';
import { codeImport as nightlyWalletCodeImport } from '~/docs/nightly/fuels-wallet/packages/docs/src/lib/code-import';
import { codeImport as beta4WalletCodeImport } from '~/docs/beta-4/fuels-wallet/packages/docs/src/lib/code-import';
import { codeImport } from '~/src/lib/plugins/code-import';
import { textImport } from '~/src/lib/plugins/text-import';

import { DOCS_DIRECTORY } from '../config/constants';
import type { Config, DocType, SidebarLinkItem } from '../types';

import { Docs } from './md-docs';
import { rehypePlugins, remarkPlugins } from './md-plugins';
import { rehypeExtractHeadings } from './plugins/toc';

const isPreview = process.env.VERCEL_ENV === 'preview';
const branchUrl = `https://${process.env.VERCEL_BRANCH_URL}/`;

const docConfigPath = join(DOCS_DIRECTORY, '../src/config/docs.json');
const configFile = JSON.parse(readFileSync(docConfigPath, 'utf8'));
const BASE_URL =
  isPreview && branchUrl ? branchUrl : 'https://docs.fuel.network/';

export class Doc {
  md: MdDoc;
  item: DocType;
  config: Config;

  constructor(slug: string[], mdDocs: MdDoc[]) {
    const isIntroQuickstartContract =
      slug[slug.length - 1] === 'quickstart-contract';
    const isIntroQuickstartFrontend =
      slug[slug.length - 1] === 'quickstart-frontend';

    let actualSlug = slug;
    if (isIntroQuickstartContract) {
      actualSlug = ['guides', 'quickstart', 'building-a-smart-contract'];
    } else if (isIntroQuickstartFrontend) {
      actualSlug = ['guides', 'quickstart', 'building-a-frontend'];
    }

    const item = Docs.findDoc(actualSlug, mdDocs);
    if (!item) {
      throw new Error(`${slug} not found`);
    }

    if (isIntroQuickstartContract) {
      item.title = 'Quickstart Contract';
    } else if (isIntroQuickstartFrontend) {
      item.title = 'Quickstart Frontend';
    }

    const config = this.#getConfig(slug.join('/'));
    const splitPath = item._raw.flattenedPath.split('/');
    splitPath.splice(0, 2);
    splitPath.pop();
    const actualPath = '/tree/master/' + splitPath.join('/');
    const pageLink = `${config.repository}${actualPath}`;

    this.md = item;
    this.config = config;

    const split = item.slug.split('/');
    let category = item.category;
    if (!category && item.slug.includes('docs/')) {
      const isNotDefault =
        item.slug.includes('/nightly/') || item.slug.includes('/beta-4/');
      const index = isNotDefault ? 3 : 2;
      const isIndex = split.length === index;
      category = split[isIndex ? index - 1 : index].replaceAll('-', ' ');
    }

    let versionSet = 'default';
    if (item.slug.includes('/nightly/')) {
      versionSet = 'nightly';
    } else if (item.slug.includes('/beta-4/')) {
      versionSet = 'beta-4';
    }

    const doc = {
      pageLink,
      _raw: item._raw,
      originalSlug: slug.join('/'),
      slug: item.slug,
      title: this.#getTitle(item.title),
      parent: item.parent ?? null,
      category: category,
      headings: [],
      menu: [],
      docsConfig: {
        ...config,
        slug: item.slug,
      },
      versionSet,
    } as DocType;

    this.item = doc;
  }

  #getConfig(slug: string): Config {
    slug = slug
      .replace('docs/nightly/', 'docs/')
      .replace('docs/beta-4/', 'docs/');
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
          slug: this.item.slug,
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

  sidebarLinks(slug: string) {
    let configSlug = this.config.slug;
    if (slug.includes('/nightly/')) {
      configSlug = `nightly-${this.config.slug}`;
    } else if (slug.includes('/beta-4/')) {
      configSlug = `beta-4-${this.config.slug}`;
    }
    let guideName = this.item.slug.split('/')[0];
    const linksPath = join(
      DOCS_DIRECTORY,
      `../src/generated/sidebar-links/${configSlug}.json`
    );
    const links = JSON.parse(readFileSync(linksPath, 'utf8'));
    if (
      (configSlug === 'guides' ||
        configSlug === 'nightly-guides' ||
        configSlug === 'beta-4-guides') &&
      guideName
    ) {
      if (configSlug === 'nightly-guides') {
        guideName = `${guideName}/nightly`;
      } else if (configSlug === 'beta-4-guides') {
        guideName = `${guideName}/beta-4`;
      }
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
    const slug = this.#parseSlug(this.item.originalSlug);
    const links = this.sidebarLinks(this.item.originalSlug);

    const result = [];
    for (const link of links) {
      if (link.submenu) {
        for (const subItem of link.submenu) {
          const newItem = subItem;
          (newItem.slug = this.#parseSlug(subItem.slug) ?? subItem.slug),
            result.push(newItem);
        }
      } else {
        const newItem = link;
        (newItem.slug = this.#parseSlug(link.slug) ?? link.slug),
          result.push(newItem);
      }
    }

    const idx = result.findIndex((i) => {
      if (!i.slug) return false;
      return (
        `docs/${i.slug}`.startsWith(slug || '') || i.slug.startsWith(slug || '')
      );
    });

    const prev = idx > 0 ? result[idx - 1] : null;
    const next = idx + 1 < result.length ? result[idx + 1] : null;
    const current = result[idx];
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

    const slug = this.md.slug;

    if (slug.startsWith('docs/wallet/')) {
      plugins = plugins.concat([[walletCodeImport, { filepath }] as any]);
    } else if (slug.startsWith('docs/nightly/wallet/')) {
      plugins = plugins.concat([
        [nightlyWalletCodeImport, { filepath }] as any,
      ]);
    } else if (slug.startsWith('docs/beta-4/wallet/')) {
      plugins = plugins.concat([[beta4WalletCodeImport, { filepath }] as any]);
    } else if (slug.startsWith('docs/graphql/')) {
      plugins = plugins.concat([[codeExamples, { filepath }] as any]);
    } else if (slug.startsWith('docs/nightly/graphql/')) {
      plugins = plugins.concat([[nightlyCodeExamples, { filepath }] as any]);
    } else if (slug.startsWith('docs/beta-4/graphql/')) {
      plugins = plugins.concat([[beta4CodeExamples, { filepath }] as any]);
    } else if (slug.includes('guides') || slug.includes('/intro/')) {
      plugins = plugins.concat([[codeImport, { filepath }] as any]);
      plugins = plugins.concat([[textImport, { filepath }] as any]);
    }

    return plugins;
  }
}
