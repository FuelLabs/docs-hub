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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any,
  dirname: string,
  idx?: number | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parent?: Parent<any, any>,
  tree?: Root
) {
  let newUrl: string | null = null;

  if (node.type === 'html') {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scriptString = tree?.children[0] as any;
      const newURLs = getTSUrl(scriptString.value);

      if (newURLs) {
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
  } else {
    if (!node.url.includes('http')) {
      newUrl = node.url
        .replace('.md', '')
        .replace('/index', '')
        .replace('.html', '')
        .toLowerCase();

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
