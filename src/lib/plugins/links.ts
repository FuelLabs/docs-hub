/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Root } from 'remark-gfm';
import type { Parent } from 'unist-util-visit/lib';

import { DOCS_DIRECTORY } from '../../config/constants';
import type { DuplicateAPIItem } from '../ts-api';
import { getTSAPIDuplicates } from '../ts-api';

const configPath = join(DOCS_DIRECTORY, `../src/config/paths.json`);
const pathsConfig = JSON.parse(readFileSync(configPath, 'utf8'));

export function handleLinks(
  node: any,
  dirname: string,
  idx?: number | null,
  parent?: Parent<any, any>,
  tree?: Root
) {
  let newUrl: string | null = null;

  if (node.type === 'html') {
    handleHTMLLink(node, idx, parent, tree);
  } else {
    if (!node.url.includes('http')) {
      newUrl = getNewUrl(node, dirname);
    }
    if (node.url.endsWith('CONTRIBUTING') && node.url.includes('github.com')) {
      newUrl = `${node.url}.md`;
    }
    newUrl = handleTSLinks(newUrl);
  }

  const base = dirname.split('/').splice(0, 2).join('/');

  newUrl = replaceInternalLinks(newUrl ?? node.url, base);

  return newUrl;
}

function handleTSLinks(url: string | null) {
  let newUrl = url;
  const duplicates = getTSAPIDuplicates();
  if (newUrl) {
    duplicates.forEach((item: DuplicateAPIItem) => {
      if (newUrl?.startsWith(item.path.toLowerCase())) {
        newUrl = newUrl.replace(
          item.originalCategory.toLowerCase(),
          item.newCategory.toLowerCase()
        );
      }
    });
  }
  if (newUrl && newUrl.startsWith('/api/')) {
    newUrl = newUrl.replace('/api/', '/docs/fuels-ts/');
  }
  return newUrl;
}

function getNewUrl(node: any, dirname: string) {
  let newUrl;
  newUrl = node.url
    .replace('.md', '')
    .replace(/\/index$/, '/')
    .replace('.html', '')
    .toLowerCase();

  const configPath = join(DOCS_DIRECTORY, `../src/config/paths.json`);
  const pathsConfig = JSON.parse(readFileSync(configPath, 'utf8'));

  let dir = dirname;
  Object.keys(pathsConfig).forEach((key) => {
    dir = dir.replaceAll(key, pathsConfig[key]);
  });

  if (node.url.startsWith('../')) {
    // TODO: remove this once wallet is updated past 13.0
    if (!dirname.includes('fuels-wallet') && !node.url.startsWith('../dev')) {
      const folder = dirname.split('/').pop();
      newUrl = `/${dir.replace(folder!, '')}${newUrl!.replace('../', '')}`;
    }
  }
  if (node.url.startsWith('./') && !node.url.includes('index')) {
    newUrl = `/${dir.endsWith('/') ? dir : `${dir}/`}${newUrl!.replace(
      './',
      ''
    )}`;
  }
  if (/^[a-zA-Z]/.test(node.url)) {
    newUrl = `/${dir}/${newUrl}`;
  }
  newUrl = newUrl!.replace('/sway/forc/', '/forc/');
  const isNightly = dirname.includes('/nightly/');
  if (dirname.includes('fuel-graphql-docs')) {
    newUrl = isNightly
      ? newUrl.replace('/docs/', '/docs/nightly/graphql/')
      : newUrl.replace('/docs/', '/docs/graphql/');
  }
  // TODO: add this for the wallet once wallet is updated past 13.0

  newUrl = newUrl
    .replace('docs/nightly/introduction', 'docs/nightly/sway/introduction')
    .replace('docs/introduction', 'docs/sway/introduction');

  if (
    newUrl !== '/docs/fuels-ts/guide/' &&
    newUrl !== '/docs/nightly/fuels-ts/guide/'
  ) {
    newUrl = newUrl.replace('fuels-ts/guide/', 'fuels-ts/');
  }

  newUrl = newUrl
    .replace(
      '/docs/dev/getting-started',
      isNightly
        ? '/docs/nightly/wallet/dev/getting-started'
        : '/docs/wallet/dev/getting-started'
    )
    .replace('/api/interfaces/index', '/api/interfaces/');

  if (newUrl.includes('/docs/forc/../')) {
    newUrl = newUrl.replace('/docs/forc/../', '/docs/sway/');
  }

  if (newUrl.startsWith('@repository')) {
    newUrl = newUrl.replace(
      '@repository',
      'https://github.com/FuelLabs/fuels-wallet/blob/master'
    );
  }

  console.log(newUrl);

  return newUrl;
}

function getUrl(html: string): string | null {
  const anchorTagRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>/i;
  const match = html.match(anchorTagRegex);

  if (match && match.length >= 2) {
    return match[1];
  }

  return null;
}

function getTSUrl(input: string): { [key: string]: string } {
  const regex = /const (\w+) = `\s*([\s\S]+?)\s*`/g;
  const matches = [...input.matchAll(regex)];
  const result: { [key: string]: string } = {};
  for (const match of matches) {
    const key = match[1];
    const url = match[2];
    result[key] = url;
  }
  return result;
}

function handleHTMLLink(
  node: any,
  idx?: number | null,
  parent?: Parent<any, any>,
  tree?: Root
) {
  const url = getUrl(node.value);
  if (
    url &&
    !node.value.includes(':href') &&
    idx !== undefined &&
    idx !== null
  ) {
    node.type = 'link';
    node.value = null;
    node.children = [];
    node.children.push(parent.children[idx + 1]);
    parent.children.splice(idx + 1, 2);
  } else if (
    url &&
    node.value.includes(':href') &&
    idx !== undefined &&
    idx !== null
  ) {
    const scriptString = tree?.children[0] as any;
    const newURLs = getTSUrl(scriptString.value);

    if (newURLs) {
      handleNewURLs(newURLs, url, idx, parent);
    }
  }
}

function handleNewURLs(
  newURLs: {
    [key: string]: string;
  },
  url: string,
  idx: number,
  parent: Parent<any, any>
) {
  let newURL = newURLs[url];
  if (newURL) {
    newURL = newURL.replace('/v${forc}', '').replace('/v${fuels}', '');
    for (const [key, value] of Object.entries(pathsConfig)) {
      newURL = newURL.replaceAll(key, value as string);
    }
    const value = parent.children[idx + 1].value;
    parent.children[idx] = {
      type: 'link',
      url: newURL,
      children: [
        {
          type: 'text',
          value: value,
        },
      ],
    };
    parent.children.forEach((child: any) => {
      if (child.type === 'html' && child.value === '</a>') {
        child.type = 'text';
        child.value = '';
      } else if (child.value === value) {
        child.value = '';
      }
    });
  }
}

function replaceInternalLinks(href: string, base: string) {
  if (
    href.startsWith('https://fuellabs.github.io') &&
    !href.includes('fuellabs.github.io/block-explorer-v2') &&
    !href.startsWith('https://fuellabs.github.io/sway/master/std/') &&
    !href.includes('LICENSE')
  ) {
    href = href
      .replace('https://fuellabs.github.io', '')
      .replace('/master/', '/')
      .replace('.html', '')
      .replace('/nightly', '')
      .replace(/\/index$/, '/')
      .replace('sway/book/', 'sway/')
      .replace('sway/forc/', 'forc/')
      .replace('/fuel-specs/', '/specs/')
      .replace(/\/v\d+\.\d+\.\d+\//, '/')
      .replace('/specs/vm', '/specs/fuel-vm');
    href = `/docs${href}`;

    const isSwayVersion = href.match(/sway\/(v.+)\/forc/);
    if (isSwayVersion) {
      const version = isSwayVersion[1];
      href = href.replace(`sway/${version}/forc`, 'forc');
    }
  }

  if (href.startsWith('../')) {
    href = href.replace('../', `/${base}/`);
  }
  if (href.startsWith('./../')) {
    href = href.replace('./../', `/${base}/`);
  }

  if (!href.endsWith('/forc/plugins/forc_client/')) {
    href = href.replace('/forc/plugins/forc_client/', '/forc/plugins/');
  }

  // TODO: fix this at source
  href = href
    .replace(
      'docs/fuel-docs/quickstart/developer-quickstart',
      '/guides/quickstart/'
    )
    .replace(
      'https://fuelbook.fuel.network/master/quickstart/developer-quickstart.html',
      '/guides/quickstart/'
    )
    .replace('specs/fuel-vm/instruction_set', 'specs/fuel-vm/instruction-set')
    .replace('specs/protocol/tx_format', 'specs/tx-format/')
    .replace('docs/fuelup/latest', 'docs/fuelup')
    .replace('specs/protocol/id/contract', 'specs/identifiers/contract-id')
    .replace('/packag/', '/package/')
    .replace('/index#', '#');

  console.log('href', href);
  return href;
}
