import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Parent } from 'unist-util-visit/lib';

import { DOCS_DIRECTORY } from '../../config/constants';

export function handleLinks(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any,
  dirname: string,
  idx: number | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parent: Parent<any, any>
) {
  let newUrl: string | null = null;

  if (node.type === 'html') {
    const url = getUrl(node.value);
    if (url && idx) {
      node.type = 'link';
      // TODO: remove once Sway book is updated
      node.url = url.includes(
        'fuelbook.fuel.network/master/quickstart/developer-quickstart'
      )
        ? '/guides/quickstart'
        : url;
      node.value = null;
      node.children = [];
      node.children.push(parent.children[idx + 1]);
      parent.children.splice(idx + 1, 2);
    }
  } else {
    if (!node.url.includes('http')) {
      newUrl = node.url
        .replace('.md', '')
        .replace('/index', '')
        .replace('.html', '');

      const configPath = join(DOCS_DIRECTORY, `../src/config/paths.json`);
      const pathsConfig = JSON.parse(readFileSync(configPath, 'utf8'));

      let dir = dirname;
      Object.keys(pathsConfig).forEach((key) => {
        dir = dir.replaceAll(key, pathsConfig[key]);
      });

      if (node.url.startsWith('../')) {
        const folder = dirname.split('/').pop();
        newUrl = `/${dir.replace(folder!, '')}${newUrl!.replace('../', '')}`;
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
    }

    if (node.url.endsWith('CONTRIBUTING') && node.url.includes('github.com')) {
      newUrl = `${node.url}.md`;
    }
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
