import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Root } from 'remark-gfm';
import type { Parent } from 'unist-util-visit/lib';
import type { VersionSet } from '~/src/types';

import { DOCS_DIRECTORY } from '../../config/constants';
import type { DuplicateAPIItem } from '../ts-api';
import { getTSAPIDuplicates } from '../ts-api';
import getDocVersion from '../versions';

const configPath = join(DOCS_DIRECTORY, '../src/config/paths.json');
const pathsConfig = JSON.parse(readFileSync(configPath, 'utf8'));

export function handleLinks(
  // biome-ignore lint/suspicious/noExplicitAny:
  node: any,
  dirname: string,
  idx?: number | null,
  // biome-ignore lint/suspicious/noExplicitAny:
  parent?: Parent<any, any>,
  tree?: Root
) {
  let newUrl: string | null = null;
  let base = dirname.split('/').splice(0, 2).join('/');
  let versionSet: VersionSet = 'default';
  if (dirname.includes('/nightly/')) {
    versionSet = 'nightly';
  } else if (dirname.includes('/beta-5/')) {
    versionSet = 'beta-5';
  }

  if (dirname.includes('sway/docs/book/src/forc')) {
    base = 'docs/forc';
  }

  if (node.type === 'html') {
    handleHTMLLink(node, base, idx, parent, tree);
  } else {
    if (!node.url.includes('http')) {
      newUrl = getNewUrl(node, dirname, versionSet);
    }
    if (node.url.endsWith('CONTRIBUTING') && node.url.includes('github.com')) {
      newUrl = `${node.url}.md`;
    }
    newUrl = handleTSLinks(newUrl, versionSet);
    newUrl = replaceInternalLinks(newUrl ?? node.url, base);
    if (
      versionSet === 'nightly' &&
      !newUrl.includes('/nightly/') &&
      (newUrl.startsWith('docs/') || newUrl.startsWith('/docs/'))
    ) {
      newUrl = newUrl.replace('docs/', 'docs/nightly/');
    }
    if (
      versionSet === 'beta-5' &&
      !newUrl.includes('/beta-5/') &&
      (newUrl.startsWith('docs/') || newUrl.startsWith('/docs/'))
    ) {
      newUrl = newUrl.replace('docs/', 'docs/beta-5/');
    }

    if (newUrl.includes('github.com/FuelLabs/')) {
      // TODO: REMOVE THIS ONCE FIXED IN SOURCE
      newUrl = newUrl.replace(
        'fuels-wallet/blob/master/packages/sdk/src/config.ts',
        'fuels-wallet'
      );

      if (newUrl.includes('/master/')) {
        const version = getDocVersion(newUrl, versionSet);
        if (version !== 'master') {
          newUrl = newUrl
            .replace('/tree/master/', `/tree/${version}/`)
            .replace('/blob/master/', `/blob/${version}/`);
        }
      }

      if (newUrl.includes('/sway-libs')) {
        newUrl = newUrl.replace(/\/libs\/([^\/]+)/g, (match, p1) => {
          if (p1 === 'merkle_proof') {
            return '/libs/src/merkle';
          }
          return `/libs/src/${p1}`;
        });
      } else if (newUrl.includes('/sway-standards/')) {
        newUrl = newUrl.replace(
          '/standards/src5-ownership',
          '/standards/src/src5.sw'
        );
      }
    }

    if (newUrl.includes('docs.rs/fuel-types/{{versions.fuel-types}}')) {
      newUrl = newUrl.replace('{{versions.fuel-types}}', 'latest');
    }

    newUrl = newUrl.replace('fuels-ts/abi-typegen/', 'fuels-ts/typegen/');

    return newUrl;
  }
}

function handleTSLinks(url: string | null, versionSet: VersionSet) {
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

    if (newUrl.startsWith('/api/')) {
      newUrl = newUrl.replace(
        '/api/',
        `/docs/${versionSet === 'default' ? '' : `/${versionSet}`}/fuels-ts/`
      );
    }
    if (newUrl.includes('/api/') && !newUrl.endsWith('/api/')) {
      newUrl = newUrl
        .replace('docs/fuels-ts/../api/', 'docs/fuels-ts/')
        .replace('fuels-ts/docs/api/', 'fuels-ts/')
        .replace('/api/', '/')
        .replace('/providers', '/api-providers');
    }
  }
  return newUrl;
}

// biome-ignore lint/suspicious/noExplicitAny:
function getNewUrl(node: any, dirname: string, versionSet: VersionSet) {
  // biome-ignore lint/suspicious/noImplicitAnyLet:
  let newUrl;
  newUrl = node.url
    .replace('.md', '')
    .replace(/\/index$/, '/')
    .replace('.html', '')
    .toLowerCase();

  let dir = dirname;
  Object.keys(pathsConfig).forEach((key) => {
    dir = dir.replaceAll(key, pathsConfig[key]);
  });

  if (node.url.startsWith('../')) {
    if (!dirname.includes('fuels-wallet') && !node.url.startsWith('../dev')) {
      const thisDir = dir.endsWith('/') ? dir : `${dir}/`;
      const folder = dirname.split('/').pop();
      const first = thisDir.replace(`/${folder}/`!, '/');
      const second = newUrl!.replace('../', '');
      newUrl = `/${first}${second}`;
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
  if (dirname.includes('fuel-graphql-docs')) {
    newUrl =
      versionSet === 'default'
        ? newUrl.replace('/docs/', '/docs/graphql/')
        : newUrl.replace('/docs/', `/docs/${versionSet}/graphql/`);
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
      versionSet === 'default'
        ? '/docs/wallet/dev/getting-started'
        : `/docs/${versionSet}/wallet/dev/getting-started`
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
  // biome-ignore lint/suspicious/noExplicitAny:
  node: any,
  base: string,
  idx?: number | null,
  // biome-ignore lint/suspicious/noExplicitAny:
  parent?: Parent<any, any>,
  tree?: Root
) {
  let url = getUrl(node.value);
  if (url) {
    url = replaceInternalLinks(url, base);
  }
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
    // biome-ignore lint/suspicious/noExplicitAny:
    const scriptString = tree?.children[0] as any;
    const value = scriptString.value ?? scriptString.children[0].value;
    const newURLs = getTSUrl(value);

    if (newURLs) {
      handleNewURLs(newURLs, url, idx, parent, base);
    }
  }
}

function handleNewURLs(
  newURLs: {
    [key: string]: string;
  },
  url: string,
  idx: number,
  // biome-ignore lint/suspicious/noExplicitAny:
  parent: Parent<any, any>,
  base: string
) {
  let newURL = newURLs[url];
  if (newURL) {
    newURL = newURL.replace('/v${forc}', '').replace('/v${fuels}', '');
    newURL = replaceInternalLinks(newURL, base);
    for (const [key, value] of Object.entries(pathsConfig)) {
      newURL = newURL.replaceAll(key, value as string);
    }
    if (newURL.includes('docs.fuel.network')) {
      newURL = newURL
        .replace('fuel.network/forc', 'fuel.network/docs/forc')
        .replace('fuel.network/sway', 'fuel.network/docs/sway');
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
    // biome-ignore lint/suspicious/noExplicitAny:
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
  let newHref = href;
  if (
    newHref.startsWith('https://fuellabs.github.io') &&
    !newHref.includes('fuellabs.github.io/block-explorer-v2') &&
    !newHref.startsWith('https://fuellabs.github.io/sway/master/std/') &&
    !newHref.includes('LICENSE') &&
    !newHref.includes('/fuelup/')
  ) {
    newHref = newHref
      .replace('https://fuellabs.github.io', '')
      .replace('/master/', '/')
      .replace('.html', '');
    newHref = `/docs${newHref}`;

    const isSwayVersion = newHref.match(/sway\/(v.+)\/forc/);
    if (isSwayVersion) {
      const version = isSwayVersion[1];
      newHref = newHref.replace(`sway/${version}/forc`, 'forc');
    }
  }

  if (newHref.startsWith('../')) {
    newHref = newHref.replace('../', `/${base}/`);
  } else if (newHref.startsWith('./../')) {
    newHref = newHref.replace('./../', `/${base}/`);
  } else if (newHref.startsWith('./')) {
    newHref = newHref.replace('./', `/${base}/`);
  }

  newHref = newHref
    .replace(/\/index$/, '/')
    .replace('sway/book/', 'sway/')
    .replace('sway/forc/', 'forc/')
    .replace(/\/v\d+\.\d+\.\d+\//, '/')
    .replace('specs/vm', 'specs/fuel-vm');

  if (!newHref.endsWith('/forc/plugins/forc_client/')) {
    newHref = newHref.replace('/forc/plugins/forc_client/', '/forc/plugins/');
  }

  // TODO: fix this at source
  newHref = newHref
    .replace(
      'docs/fuel-docs/quickstart/developer-quickstart',
      'intro/quickstart/'
    )
    .replace(
      'https://fuelbook.fuel.network/master/quickstart/developer-quickstart.html',
      'intro/quickstart/'
    )
    .replace('specs/fuel-vm/instruction_set', 'specs/fuel-vm/instruction-set')
    .replace('specs/protocol/tx_format', 'specs/tx-format/')
    .replace('docs/fuelup/latest', 'docs/fuelup')
    .replace('specs/protocol/id/contract', 'specs/identifiers/contract-id')
    .replace('specs/protocol/abi', 'specs/abi')
    .replace('/packag/', '/packages/')
    .replace('standards/src_5', 'standards/src5-ownership')
    .replace('/index#', '#');

  if (newHref.startsWith('/docs/')) {
    newHref = newHref.replace('/docs/', 'docs/');
  }

  if (newHref.includes('github.com/FuelLabs/fuels-ts')) {
    newHref = newHref.replace('/packages/api/', '/packages/interfaces/');
  }

  if (
    !newHref.includes('soliditylang.org/en/latest/') &&
    !newHref.includes('soliditylang.org/en/v0')
  ) {
    newHref = newHref.replace(
      'soliditylang.org/en/',
      'soliditylang.org/en/latest/'
    );
  }

  if (
    newHref ===
    'https://github.com/FuelLabs/fuels-wallet/blob/master/packages/config/'
  ) {
    newHref =
      'https://github.com/FuelLabs/fuels-wallet/blob/master/packages/sdk/src/config.ts';
  }

  if (
    !newHref.includes('github.com/FuelLabs') &&
    !newHref.includes('docs.rs')
  ) {
    newHref = newHref.replace('/fuel-specs', '/specs');
  }

  return newHref;
}
