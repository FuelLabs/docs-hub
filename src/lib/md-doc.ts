import { readFileSync } from 'fs';
import { join } from 'path';
import { compile } from '@mdx-js/mdx';
import { addRawDocumentToVFile } from 'contentlayer/core';
import type { MdDoc } from 'contentlayer/generated';
import { codeExamples } from '~/docs/fuel-graphql-docs/src/lib/code-examples';
import { codeImport as gqlCodeImport } from '~/docs/fuel-graphql-docs/src/lib/code-import';
import { codeImport as walletCodeImport } from '~/docs/fuels-wallet/packages/docs/src/lib/code-import';
import { codeExamples as nightlyCodeExamples } from '~/docs/nightly/fuel-graphql-docs/src/lib/code-examples';
import { codeImport as nightlyWalletCodeImport } from '~/docs/nightly/fuels-wallet/packages/docs/src/lib/code-import';
import { codeImport } from '~/src/lib/plugins/code-import';
import { textImport } from '~/src/lib/plugins/text-import';

import { DOCS_DIRECTORY } from '../config/constants';
import type { Config, DocType, SidebarLinkItem, VersionSet } from '../types';

import { Docs } from './md-docs';
import { rehypePlugins, remarkPlugins } from './md-plugins';
import { rehypeExtractHeadings } from './plugins/toc';
import getDocVersion from './versions';

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
    const actualSlug = slug;
    const item = Docs.findDoc(actualSlug, mdDocs);
    if (!item) {
      throw new Error(`${slug} not found`);
    }

    const config = this.#getConfig(slug.join('/'));
    const splitPath = item._raw.flattenedPath.split('/');
    let fileType = '.md';

    if (
      config.repository.includes('docs-hub') ||
      config.repository.includes('graphql-docs') ||
      config.repository.includes('wallet')
    ) {
      fileType = '.mdx';
    }

    if (
      item._raw.sourceFileName === 'index.md' ||
      item._raw.sourceFileName === 'index.mdx'
    ) {
      fileType = `/index${fileType}`;
    }

    const branch = config.repository.includes('graphql-docs')
      ? 'main'
      : 'master';
    const actualPath = `/tree/${branch}/${splitPath
      .join('/')
      .replace('/nightly/', '/')
      .replace('docs/fuels-ts/', '')
      .replace('docs/fuels-rs/', '')
      .replace('docs/fuels-wallet/', '')
      .replace('docs/fuel-graphql-docs/', '')
      .replace('docs/sway/', '')
      .replace('docs/sway-standards/', '')
      .replace('docs/sway-by-example-lib/', '')
      .replace('docs/fuel-book/', '')
      .replace('docs/verified-addresses/', '')
      .replace('docs/fuel-specs/', '')}`;

    let pageLink = `${config.repository}${actualPath.replace(
      'tree/master/docs/sway-libs/docs',
      'tree/master/docs'
    )}${fileType}`;

    if (pageLink.includes('/master/')) {
      let versionSet: VersionSet = 'default';
      if (item.slug.includes('/nightly/')) {
        versionSet = 'nightly';
      }
      const version = getDocVersion(pageLink, versionSet);
      // TODO: remove the exception for sway-standards once version is bumped past 0.5.0
      if (
        version !== 'master' &&
        !pageLink.includes('/FuelLabs/sway-standards')
      ) {
        pageLink = pageLink
          .replace('/tree/master/', `/tree/${version}/`)
          .replace('/blob/master/', `/blob/${version}/`);
      }
    }

    this.md = item;
    this.config = config;

    const split = item.slug.split('/');
    let category = item.category;
    if (!category && item.slug.includes('docs/')) {
      const isNotDefault = item.slug.includes('/nightly/');
      const index = isNotDefault ? 3 : 2;
      const isIndex = split.length === index;
      category = split[isIndex ? index - 1 : index].replaceAll('-', ' ');
    }

    let versionSet = 'default';
    if (item.slug.includes('/nightly/')) {
      versionSet = 'nightly';
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
    let newSlug = slug.replace('docs/nightly/', 'docs/');
    try {
      if (newSlug.startsWith('docs/')) {
        newSlug = newSlug.replace('docs/', '');
      }
      if (newSlug.startsWith('.')) {
        newSlug = newSlug.split('/')[1].replace('.md', '');
      }
      if (newSlug.includes('/')) {
        newSlug = newSlug.split('/')[0];
      }
      return configFile[newSlug];
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
    const codeLight = await this.getCodeForTheme('light', doc);
    const codeDark = await this.getCodeForTheme('dark', doc);

    return { light: String(codeLight), dark: String(codeDark) };
  }

  async getCodeForTheme(theme: 'light' | 'dark', doc: MdDoc) {
    const plugins = rehypePlugins(theme);
    const code = await compile(doc.body.raw, {
      outputFormat: 'function-body',
      format: doc._raw.contentType === 'markdown' ? 'md' : 'mdx',
      providerImportSource: '@mdx-js/react',
      remarkPlugins: this.#remarkPlugins(),
      rehypePlugins: [
        ...plugins,
        rehypeExtractHeadings({
          headings: this.item.headings,
          slug: this.item.slug,
        }),
      ],
    });

    return code;
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
    }
    let guideName = this.item.slug.split('/')[0];
    const linksPath = join(
      DOCS_DIRECTORY,
      `../src/generated/sidebar-links/${configSlug}.json`
    );
    const links = JSON.parse(readFileSync(linksPath, 'utf8'));
    if (
      (configSlug === 'guides' || configSlug === 'nightly-guides') &&
      guideName
    ) {
      if (configSlug === 'nightly-guides') {
        guideName = `${guideName}/nightly`;
      }
      const slug = this.item.slug
        .replace(`${guideName}/`, '')
        .replace('/index', '');

      const key = slug.split('/')[0].replace(/-/g, '_');

      const guideLink = links.find((link) => link.key === key);

      if (guideLink?.submenu) {
        return guideLink.submenu as SidebarLinkItem[];
      }
      console.warn(`No guide link found for key: ${key}`);
      return [];
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
          // biome-ignore lint/style/noCommaOperator:
          (newItem.slug = this.#parseSlug(subItem.slug) ?? subItem.slug),
            result.push(newItem);
        }
      } else {
        const newItem = link;
        // biome-ignore lint/style/noCommaOperator:
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
    let newSlug = slug.replace('../', '');
    newSlug = newSlug.startsWith('./') ? newSlug.slice(2) : newSlug;
    if (newSlug.endsWith('/index')) {
      newSlug = newSlug.replace('/index', '');
    }
    return newSlug;
  }

  #createUrl(slug: string) {
    return `${BASE_URL}${slug.replace('../', '').replace('./', '')}`;
  }

  #remarkPlugins() {
    const filepath = this.md._raw.sourceFilePath;
    let plugins = [addRawDocumentToVFile(this.md._raw), ...remarkPlugins];

    const slug = this.md.slug;

    if (slug.startsWith('docs/wallet/')) {
      // biome-ignore lint/suspicious/noExplicitAny:
      plugins = plugins.concat([[walletCodeImport, { filepath }] as any]);
    } else if (slug.startsWith('docs/nightly/wallet/')) {
      plugins = plugins.concat([
        // biome-ignore lint/suspicious/noExplicitAny:
        [nightlyWalletCodeImport, { filepath }] as any,
      ]);
    } else if (slug.startsWith('docs/graphql/')) {
      plugins = plugins
        // biome-ignore lint/suspicious/noExplicitAny:
        .concat([[codeExamples, { filepath }] as any])
        // biome-ignore lint/suspicious/noExplicitAny:
        .concat([[gqlCodeImport, { filepath }] as any]);
    } else if (slug.startsWith('docs/nightly/graphql/')) {
      // biome-ignore lint/suspicious/noExplicitAny:
      plugins = plugins.concat([[nightlyCodeExamples, { filepath }] as any]);
    } else if (slug.includes('guides') || slug.includes('/intro/')) {
      // biome-ignore lint/suspicious/noExplicitAny:
      plugins = plugins.concat([[codeImport, { filepath }] as any]);
      // biome-ignore lint/suspicious/noExplicitAny:
      plugins = plugins.concat([[textImport, { filepath }] as any]);
    }

    return plugins;
  }
}
