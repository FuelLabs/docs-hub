/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */

import path from 'path';
import type { Root } from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Parent } from 'unist-util-visit/lib';

import { handleCodeImport } from './code-import';
import { handleForcGenDocs } from './forc-gen-docs';
import { handleExampleImports } from './mdbook-example-import';
import { handleScriptLink } from './ts-docs';
import { loadTSVersions } from './ts-versions';
import {
  handleDemoComp,
  handlePlayerComp,
  handleWalletImages,
} from './wallet-docs';

interface Options {
  filepath: string;
}

const codeImportCondition = (node: any) => {
  return node.name === 'CodeImport';
};

const forcGenCondition = (tree: any, node: any, filepath: string) => {
  return (
    tree.children.length === 1 &&
    node.type === 'root' &&
    filepath.includes('sway/docs/book/src/forc')
  );
};

const exampleImportCondition = (node: any) => {
  return (
    (node.type === 'code' && node.value.startsWith('{{#include')) ||
    (node.type === 'text' && node.value.startsWith('<<< @'))
  );
};

const walletImagesCondition = (node: any, filepath: string) => {
  return node.type === 'image' && filepath.includes('/fuels-wallet/');
};

const walletComponentsCondition = (node: any, filepath: string) => {
  return (
    node.name === 'Demo' ||
    (node.name === 'Player' && filepath.includes('/fuels-wallet/'))
  );
};

const mdBookLinks = (node: any) => {
  return (
    (node.type === 'link' || node.type === 'definition') && node.url !== '..'
  );
};

const tsBookVersions = (node: any) => {
  return (
    typeof node.value === 'string' &&
    (node.value === 'v{{fuels}}' ||
      node.value === 'v{{fuelCore}}' ||
      node.value === 'v{{forc}}')
  );
};

const hasScriptLink = (node: any) => {
  return node.type === 'html' && node.value.includes('const url =');
};

export function handlePlugins(options: Options = { filepath: '' }) {
  const rootDir = process.cwd();
  const { filepath } = options;
  const dirname = path.relative(rootDir, path.dirname(filepath));

  return function transformer(tree: Root) {
    if (
      filepath.includes('/docs/portal/') ||
      filepath.includes('/docs/fuel-graphql-docs/')
    )
      return;
    const nodes: [any, number | null, Parent][] = [];

    if (filepath.includes('/docs/sway/')) {
      visit(tree, '', (node: any, idx, parent) => {
        if (
          // get the generated docs for forc
          forcGenCondition(tree, node, filepath) ||
          // handle example code imports in mdbook repos and the TS SDK docs
          exampleImportCondition(node) ||
          // remove .md from mdBook links
          mdBookLinks(node)
        ) {
          nodes.push([node as any, idx, parent as Parent]);
        }
      });
      nodes.forEach(([node, _idx, parent]) => {
        if (forcGenCondition(tree, node, filepath)) {
          const newTreeChildren = handleForcGenDocs(node, filepath, rootDir);
          if (newTreeChildren) node.children = newTreeChildren;
        } else if (exampleImportCondition(node)) {
          const content = handleExampleImports(node, dirname, rootDir, parent);
          node.value = content;
        } else if (mdBookLinks(node)) {
          node.url = node.url.replace('.md', '').replace('/index', '');
        }
      });
    } else if (filepath.includes('/docs/fuels-wallet/')) {
      visit(tree, '', (node: any, idx, parent) => {
        if (
          // handle the CodeImport component
          codeImportCondition(node) ||
          // update the image & video paths in the wallet docs
          walletImagesCondition(node, filepath) ||
          walletComponentsCondition(node, filepath)
        ) {
          nodes.push([node as any, idx, parent as Parent]);
        }
      });

      nodes.forEach(([node, _idx, _parent]) => {
        if (codeImportCondition(node)) {
          const newAttrs = handleCodeImport(node, rootDir, dirname);
          node.attributes.push(...newAttrs);
        } else if (walletImagesCondition(node, filepath)) {
          const imagePath = handleWalletImages(node);
          node.url = imagePath;
        } else if (walletComponentsCondition(node, filepath)) {
          if (node.name === 'Player') {
            const videoPath = handlePlayerComp(node);
            node.attributes[0].value = videoPath;
          } else if (node.name === 'Demo') {
            const [elements, value] = handleDemoComp(node);
            node.attributes[0].value.data.estree.body[0].expression.elements =
              elements;
            node.attributes[0].value.value = value;
          }
        }
      });
    } else if (filepath.includes('/fuels-ts/')) {
      const versions = loadTSVersions(rootDir);
      // handle injected link urls
      if (hasScriptLink(tree.children[0])) {
        tree = handleScriptLink(tree, versions);
      }
      visit(tree, '', (node: any, idx, parent) => {
        if (
          // handle example code imports in mdbook repos and the TS SDK docs
          exampleImportCondition(node) ||
          // remove .md from mdBook links
          mdBookLinks(node) ||
          // handle TS book versions
          tsBookVersions(node)
        ) {
          nodes.push([node as any, idx, parent as Parent]);
        }
      });
      nodes.forEach(([node, _idx, parent]) => {
        if (exampleImportCondition(node)) {
          const content = handleExampleImports(node, dirname, rootDir, parent);
          node.value = content;
        } else if (mdBookLinks(node)) {
          node.url = node.url.replace('.md', '').replace('/index', '');
        } else if (tsBookVersions(node)) {
          if (node.value === 'v{{forc}}') {
            node.value = versions.FORC;
          } else if (node.value === 'v{{fuels}}') {
            node.value = versions.FUELS;
          } else {
            node.value = versions.FUEL_CORE;
          }
        }
      });
    }

    // only run for mdbooks + ts sdk
    if (
      !filepath.includes(
        '/portal/' || '/fuels-wallet/' || '/fuel-graphql-docs/'
      )
    ) {
      visit(tree, '', (node: any, idx, parent) => {
        if (
          // handle example code imports in mdbook repos and the TS SDK docs
          exampleImportCondition(node) ||
          // remove .md from mdBook links
          mdBookLinks(node)
        ) {
          nodes.push([node as any, idx, parent as Parent]);
        }
      });
      nodes.forEach(([node, _idx, parent]) => {
        if (exampleImportCondition(node)) {
          const content = handleExampleImports(node, dirname, rootDir, parent);
          node.value = content;
        } else if (mdBookLinks(node)) {
          if (!node.url.includes('http')) {
            let newUrl = node.url
              .replace('.md', '')
              .replace('/index', '')
              .replace('.html', '');
            const dir = dirname
              // sway
              .replace('/docs/book/src', '')
              // indexer
              .replace('/fuel-indexer/docs/src', '/fuel-indexer')
              // fuelup
              .replace('/fuelup/docs/src', '/fuelup')
              // rust sdk
              .replace('/fuels-rs/docs/src', '/fuels-rs')
              // specs
              .replace('/fuel-specs/src', '/fuel-specs')
              // ts sdk
              .replace('/fuels-ts/apps/docs/src', '/fuels-ts');
            if (node.url.startsWith('../')) {
              const folder = dirname.split('/').pop();
              newUrl = `/${dir.replace(folder!, '')}${newUrl.replace(
                '../',
                ''
              )}`;
            } else if (
              node.url.startsWith('./') &&
              !node.url.includes('index')
            ) {
              newUrl = `/${dir.endsWith('/') ? dir : `${dir}/`}${newUrl.replace(
                './',
                ''
              )}`;
            } else if (/^[a-zA-Z]/.test(node.url)) {
              newUrl = `/${dir}/${newUrl}`;
            }
            newUrl = newUrl.replace('/sway/forc/', '/forc/');
            node.url = newUrl;
          } else if (
            node.url.endsWith('CONTRIBUTING') &&
            node.url.includes('github.com')
          ) {
            node.url = `${node.url}.md`;
          }
        }
      });
    }
  };
}
