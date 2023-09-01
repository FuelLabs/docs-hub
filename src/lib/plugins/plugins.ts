/* eslint-disable @typescript-eslint/no-explicit-any */

import { join } from 'path';
import type { Root } from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Parent } from 'unist-util-visit/lib';
import { versions } from '~/docs/fuels-ts/packages/versions/src';

import { handleForcGenDocs } from './forc-gen-docs';
import { handleLinks } from './links';
import { handleExampleImports } from './mdbook-example-import';
import { handleScriptLink } from './ts-docs';
import {
  handleDemoComp,
  handlePlayerComp,
  handleWalletImages,
} from './wallet-docs';

const forcGenCondition = (tree: any, node: any, filepath: string) => {
  return (
    filepath.includes('sway/docs/book/src/forc') &&
    (tree.children.length === 1 || tree.children.length === 2) &&
    node.type === 'root'
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
    ((node.type === 'link' || node.type === 'definition') &&
      node.url !== '..') ||
    (node.type === 'html' && node.value.includes('<a '))
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

export function handlePlugins() {
  return function transformer(tree: Root, file: any) {
    const rootDir = process.cwd();
    const filepath = join(rootDir, file.data.rawDocumentData?.sourceFilePath);
    const dirname = file.data.rawDocumentData?.sourceFileDir;
    const nodes: [any, number | null, Parent<any, any>][] = [];

    if (filepath.includes('/docs/fuel-graphql-docs/')) {
      visit(tree, '', (node: any, idx, parent) => {
        if (
          node.name === 'a' &&
          node.attributes &&
          node.attributes[0].value.includes('/docs/')
        ) {
          nodes.push([node as any, idx ?? null, parent as Parent<any, any>]);
        }
      });
      nodes.forEach(([node, _idx, _idxparent]) => {
        let url = node.attributes[0].value;
        url = url.replace('/docs/', '/docs/graphql/');
        node.attributes[0].value = url;
      });
    }

    if (filepath.includes('/docs/sway/')) {
      visit(tree, '', (node: any, idx, parent) => {
        if (
          // get the generated docs for forc
          forcGenCondition(tree, node, filepath)
        ) {
          nodes.push([node as any, idx ?? null, parent as Parent<any, any>]);
        }
      });
      nodes.forEach(([node]) => {
        const newTreeChildren = handleForcGenDocs(node, filepath, rootDir);
        if (newTreeChildren) node.children = newTreeChildren;
      });
      visit(tree, '', (node: any, idx, parent) => {
        if (
          // handle example code imports in mdbook repos and the TS SDK docs
          exampleImportCondition(node) ||
          // remove .md from mdBook links
          mdBookLinks(node)
        ) {
          nodes.push([node as any, idx ?? null, parent as Parent<any, any>]);
        }
      });
      nodes.forEach(([node, idx, parent]) => {
        if (exampleImportCondition(node)) {
          const content = handleExampleImports(node, dirname, rootDir, parent);
          node.value = content;
        }
        if (mdBookLinks(node)) {
          const newUrl = handleLinks(node, dirname, idx, parent);
          if (newUrl) node.url = newUrl;
        }
      });
    }

    if (filepath.includes('/docs/fuels-wallet/')) {
      visit(tree, '', (node: any, idx, parent) => {
        if (
          // update the image & video paths in the wallet docs
          walletImagesCondition(node, filepath) ||
          walletComponentsCondition(node, filepath)
        ) {
          nodes.push([node as any, idx ?? null, parent as Parent<any, any>]);
        }
      });

      nodes.forEach(([node, _idx, _parent]) => {
        if (walletImagesCondition(node, filepath)) {
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
    }

    if (filepath.includes('/fuels-ts/')) {
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
          tsBookVersions(node) ||
          (node.type === 'code' && node.lang === 'ts:line-numbers')
        ) {
          nodes.push([node as any, idx ?? null, parent as Parent<any, any>]);
        }
      });
      nodes.forEach(([node, idx, parent]) => {
        if (exampleImportCondition(node)) {
          const content = handleExampleImports(node, dirname, rootDir, parent);
          node.value = content;
        } else if (mdBookLinks(node)) {
          const newUrl = handleLinks(node, dirname, idx, parent, tree);
          if (newUrl) node.url = newUrl;
        } else if (tsBookVersions(node)) {
          if (node.value === 'v{{forc}}') {
            node.value = versions.FORC;
          } else if (node.value === 'v{{fuels}}') {
            node.value = versions.FUELS;
          } else {
            node.value = versions.FUEL_CORE;
          }
        } else {
          node.lang = 'ts';
        }
      });
    }

    // only run for indexer, fuels-rs, specs, fuelup
    // already handled for sway book & ts sdk above
    if (
      filepath.includes('/fuel-indexer/') ||
      filepath.includes('/fuelup/') ||
      filepath.includes('/fuels-rs/') ||
      filepath.includes('/fuel-specs/')
    ) {
      visit(tree, '', (node: any, idx, parent) => {
        if (
          // handle example code imports in mdbook repos and the TS SDK docs
          exampleImportCondition(node) ||
          // remove .md from mdBook links
          mdBookLinks(node)
        ) {
          nodes.push([node as any, idx ?? null, parent as Parent<any, any>]);
        }
      });
      nodes.forEach(([node, _idx, parent]) => {
        if (exampleImportCondition(node)) {
          const content = handleExampleImports(node, dirname, rootDir, parent);
          node.value = content;
        } else {
          const newUrl = handleLinks(node, dirname);
          if (newUrl) node.url = newUrl;
        }
      });
    }
  };
}
