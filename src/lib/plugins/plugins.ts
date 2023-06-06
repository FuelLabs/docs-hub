/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */

import path from 'path';
import type { Root } from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Parent } from 'unist-util-visit';

import { handleCodeImport } from './code-import';
import { handleForcGenDocs } from './forc-gen-docs';
import { handleExampleImports } from './mdbook-example-import';
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
  return node.type === 'link' && node.url.includes('.md');
};

const tsBookVersions = (node: any) => {
  return (
    typeof node.value === 'string' &&
    (node.value === 'v{{fuels}}' ||
      node.value === 'v{{fuelCore}}' ||
      node.value === 'v{{forc}}')
  );
};

export function handlePlugins(options: Options = { filepath: '' }) {
  const rootDir = process.cwd();
  const { filepath } = options;
  const dirname = path.relative(rootDir, path.dirname(filepath));

  return function transformer(tree: Root) {
    const nodes: [any, number | null, Parent][] = [];

    visit(tree, '', (node: any, idx, parent) => {
      if (
        // handle the CodeImport component
        codeImportCondition(node) ||
        // get the generated docs for forc
        forcGenCondition(tree, node, filepath) ||
        // handle example code imports in mdbook repos and the TS SDK docs
        exampleImportCondition(node) ||
        // update the image & video paths in the wallet docs
        walletImagesCondition(node, filepath) ||
        walletComponentsCondition(node, filepath) ||
        // remove .md from mdBook links
        mdBookLinks(node) ||
        // handle TS book versions
        tsBookVersions(node)
      ) {
        nodes.push([node as any, idx, parent as Parent]);
      }
    });
    nodes.forEach(([node, _idx, parent]) => {
      if (codeImportCondition(node)) {
        const newAttrs = handleCodeImport(node, rootDir, dirname);
        node.attributes.push(...newAttrs);
      } else if (forcGenCondition(tree, node, filepath)) {
        const newTreeChildren = handleForcGenDocs(node, filepath, rootDir);
        if (newTreeChildren) node.children = newTreeChildren;
      } else if (exampleImportCondition(node)) {
        const content = handleExampleImports(node, dirname, rootDir, parent);
        node.value = content;
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
      } else if (mdBookLinks(node)) {
        node.url = node.url.replace('.md', '').replace('/index', '');
      } else if (tsBookVersions(node)) {
        const versions = loadTSVersions(rootDir);
        if (node.value === 'v{{forc}}') {
          node.value = versions.FORC;
        } else if (node.value === 'v{{fuels}}') {
          node.value = versions.FUELS;
        } else {
          node.value = versions.FUEL_CORE;
        }
      }
    });
  };
}
