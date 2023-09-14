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

const conditions = {
  forcGen: (tree: any, node: any, filepath: string) => {
    return (
      filepath.includes('sway/docs/book/src/forc') &&
      (tree.children.length === 1 || tree.children.length === 2) &&
      node.type === 'root'
    );
  },
  exampleImport: (node: any) => {
    return (
      (node.type === 'code' && node.value.startsWith('{{#include')) ||
      (node.type === 'text' && node.value.startsWith('<<< @'))
    );
  },
  walletImages: (node: any, filepath: string) => {
    return node.type === 'image' && filepath.includes('/fuels-wallet/');
  },
  walletComponents: (node: any, filepath: string) => {
    return (
      node.name === 'Demo' ||
      (node.name === 'Player' && filepath.includes('/fuels-wallet/'))
    );
  },
  mdBookLinks: (node: any) => {
    return (
      ((node.type === 'link' || node.type === 'definition') &&
        node.url !== '..') ||
      (node.type === 'html' && node.value.includes('<a '))
    );
  },
  tsBookVersions: (node: any) => {
    return (
      typeof node.value === 'string' &&
      (node.value === 'v{{fuels}}' ||
        node.value === 'v{{fuelCore}}' ||
        node.value === 'v{{forc}}')
    );
  },
  hasScriptLink: (node: any) => {
    return node.type === 'html' && node.value.includes('const url =');
  },
};

type NodeArray = [any, number | null, Parent<any, any>][];

export function handlePlugins() {
  return function transformer(tree: Root, file: any) {
    const rootDir = process.cwd();
    const filepath = join(rootDir, file.data.rawDocumentData?.sourceFilePath);
    const dirname = file.data.rawDocumentData?.sourceFileDir;

    if (filepath.includes('/fuel-graphql-docs/')) {
      handleGraphQLDocs(tree, filepath);
    } else if (filepath.includes('/sway/')) {
      handleSwayDocs(tree, filepath, rootDir, dirname);
    } else if (filepath.includes('/fuels-wallet/')) {
      handleWalletDocs(tree, filepath);
    } else if (filepath.includes('/fuels-ts/')) {
      handleTSDocs(tree, rootDir, dirname);
    } else if (
      filepath.includes('/fuel-indexer/') ||
      filepath.includes('/fuelup/') ||
      filepath.includes('/fuels-rs/') ||
      filepath.includes('/fuel-specs/')
    ) {
      handleMDBooks(tree, rootDir, dirname);
    }
  };
}

function handleGraphQLDocs(tree: Root, filepath: string) {
  const nodes: NodeArray = [];
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
    if (filepath.includes('latest')) {
      url = url.replace('/docs/', '/docs/latest/graphql/');
    } else {
      url = url.replace('/docs/', '/docs/graphql/');
    }
    node.attributes[0].value = url;
  });
}

function handleWalletDocs(tree: Root, filepath: string) {
  const nodes: NodeArray = [];
  visit(tree, '', (node: any, idx, parent) => {
    if (
      // update the image & video paths in the wallet docs
      conditions.walletImages(node, filepath) ||
      conditions.walletComponents(node, filepath)
    ) {
      nodes.push([node as any, idx ?? null, parent as Parent<any, any>]);
    }
  });

  nodes.forEach(([node, _idx, _parent]) => {
    if (conditions.walletImages(node, filepath)) {
      const imagePath = handleWalletImages(node);
      node.url = imagePath;
    } else if (conditions.walletComponents(node, filepath)) {
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

function handleSwayDocs(
  tree: Root,
  filepath: string,
  rootDir: string,
  dirname: string
) {
  const nodes: NodeArray = [];
  visit(tree, '', (node: any, idx, parent) => {
    if (
      // get the generated docs for forc
      conditions.forcGen(tree, node, filepath)
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
      conditions.exampleImport(node) ||
      // remove .md from mdBook links
      conditions.mdBookLinks(node)
    ) {
      nodes.push([node as any, idx ?? null, parent as Parent<any, any>]);
    }
  });
  nodes.forEach(([node, idx, parent]) => {
    if (conditions.exampleImport(node)) {
      const content = handleExampleImports(node, dirname, rootDir, parent);
      node.value = content;
    }
    if (conditions.mdBookLinks(node)) {
      const newUrl = handleLinks(node, dirname, idx, parent);
      if (newUrl) node.url = newUrl;
    }
  });
}

function handleTSDocs(tree: Root, rootDir: string, dirname: string) {
  const nodes: NodeArray = [];
  // handle injected link urls
  if (conditions.hasScriptLink(tree.children[0])) {
    tree = handleScriptLink(tree, versions);
  }
  visit(tree, '', (node: any, idx, parent) => {
    if (
      // handle example code imports in mdbook repos and the TS SDK docs
      conditions.exampleImport(node) ||
      // remove .md from mdBook links
      conditions.mdBookLinks(node) ||
      // handle TS book versions
      conditions.tsBookVersions(node) ||
      (node.type === 'code' && node.lang === 'ts:line-numbers')
    ) {
      nodes.push([node as any, idx ?? null, parent as Parent<any, any>]);
    }
  });
  nodes.forEach(([node, idx, parent]) => {
    if (conditions.exampleImport(node)) {
      const content = handleExampleImports(node, dirname, rootDir, parent);
      node.value = content;
    } else if (conditions.mdBookLinks(node)) {
      const newUrl = handleLinks(node, dirname, idx, parent, tree);
      if (newUrl) node.url = newUrl;
    } else if (conditions.tsBookVersions(node)) {
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

function handleMDBooks(tree: Root, rootDir: string, dirname: string) {
  const nodes: NodeArray = [];
  visit(tree, '', (node: any, idx, parent) => {
    if (
      // handle example code imports in mdbook repos and the TS SDK docs
      conditions.exampleImport(node) ||
      // remove .md from mdBook links
      conditions.mdBookLinks(node)
    ) {
      nodes.push([node as any, idx ?? null, parent as Parent<any, any>]);
    }
  });
  nodes.forEach(([node, _idx, parent]) => {
    if (conditions.exampleImport(node)) {
      const content = handleExampleImports(node, dirname, rootDir, parent);
      node.value = content;
    } else {
      const newUrl = handleLinks(node, dirname);
      if (newUrl) node.url = newUrl;
    }
  });
}
