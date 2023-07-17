/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs/promises';
import { toText } from 'hast-util-to-text';
import { h } from 'hastscript';
import { join as pathJoin } from 'path';
import type { Options as RehypeCodeOptions } from 'rehype-pretty-code';
import rehypeCode from 'rehype-pretty-code';
import type { Root } from 'remark-gfm';
import { getHighlighter as shikiGetHighlighter } from 'shiki';
import type { PluggableList } from 'unified';
import { visit } from 'unist-util-visit';

// Shiki loads languages and themes using "fs" instead of "import", so Next.js
// doesn't bundle them into production build. To work around, we manually copy
// them over to our source code (lib/shiki/*) and update the "paths".
//
// Note that they are only referenced on server side
// See: https://github.com/shikijs/shiki/issues/138
const getShikiPath = (): string => {
  return pathJoin(process.cwd(), 'public/shiki');
};

const touched = { current: false };

// "Touch" the shiki assets so that Vercel will include them in the production
// bundle. This is required because shiki itself dynamically access these files,
// so Vercel doesn't know about them by default
const touchShikiPath = (): void => {
  if (touched.current) return; // only need to do once
  fs.readdir(getShikiPath()); // fire and forget
  touched.current = true;
};

const getHighlighter: RehypeCodeOptions['getHighlighter'] = async (options) => {
  touchShikiPath();

  const highlighter = await shikiGetHighlighter({
    // This is technically not compatible with shiki's interface but
    // necessary for rehype-pretty-code to work
    // - https://rehype-pretty-code.netlify.app/ (see Custom Highlighter)
    ...(options as any),
    langs: [
      'rust',
      'javascript',
      'typescript',
      'tsx',
      'jsx',
      'bash',
      'shell',
      'sh',
      'json',
      'toml',
      'graphql',
      'console',
      'ts',
    ],
    paths: {
      languages: `${getShikiPath()}/languages/`,
      themes: `${getShikiPath()}/themes/`,
    },
  });

  return highlighter;
};

function codeImport() {
  return function transformer(tree: Root) {
    visit(tree, 'mdxJsxFlowElement', (node: any) => {
      if (node.name !== 'CodeImport' && node.name !== 'CodeExamples') return;
      const content = node.attributes?.find((a: any) => a.name === '__content');
      if (content) {
        node.type = 'element';
        node.tagName = 'pre';
        const lang = node.attributes?.find((a: any) => a.name === '__language');
        const code = h('code', { class: lang?.value }, content?.value);
        node.children = [code];
      } else {
        const tsContent = node.attributes?.find(
          (a: any) => a.name === '__ts_content',
        );
        const apolloContent = node.attributes?.find(
          (a: any) => a.name === '__apollo_content',
        );
        const urqlContent = node.attributes?.find(
          (a: any) => a.name === '__urql_content',
        );
        const tsCode = h(
          'code',
          {
            className: ['language-typescript'],
            'data-language': 'typescript',
            'data-theme': 'default',
          },
          tsContent?.value,
        );
        const apolloImport = `import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const apolloClient= new ApolloClient({
  uri: 'https://beta-3.fuel.network/graphql',
  cache: new InMemoryCache(),
});

`;
        const apolloCode = h(
          'code',
          {
            className: ['language-typescript'],
            'data-language': 'typescript',
            'data-theme': 'default',
          },
          apolloImport + apolloContent?.value,
        );

        const urqlImport = `import { createClient } from 'urql';

const urqlClient= createClient({
  url: 'https://beta-3.fuel.network/graphql',
});

`;
        const urqlCode = h(
          'code',
          {
            className: ['language-typescript'],
            'data-language': 'typescript',
            'data-theme': 'default',
          },
          urqlImport + urqlContent?.value,
        );

        const tsPre = h('element');
        tsPre.tagName = 'pre';
        tsPre.children = [tsCode];

        const apolloPre = h('element');
        apolloPre.tagName = 'pre';
        apolloPre.children = [apolloCode];

        const urqlPre = h('element');
        urqlPre.tagName = 'pre';
        urqlPre.children = [urqlCode];

        node.children = [tsPre, apolloPre, urqlPre];
      }
    });
  };
}

function hasCodeGroup(node: any) {
  return node.children?.some((n: any) =>
    [':::', '::: code-group'].includes(n.value),
  );
}

function isElement(value: any): value is Element {
  return value ? value.type === 'element' : false;
}
function isCodeEl(node: any, parent: any) {
  return (
    (node.tagName === 'code' &&
      isElement(parent) &&
      parent.tagName === 'pre') ||
    node.tagName === 'inlineCode' ||
    (node.tagName === 'code' && parent.name === 'CodeExamples')
  );
}

/**
 * This plugin is used to group code blocks of fuels-ts together.
 */
function codeGroup() {
  return function transformer(tree: Root) {
    const range: number[] = [];
    function findRange(node: any, idx: number) {
      if (node.children?.length) {
        node.children.forEach(findRange);
      }
      const isGroup = hasCodeGroup(node);
      if (isGroup) {
        range.push(idx);
      }
    }
    tree.children.forEach(findRange);

    if (!range.length) return;
    const [start, end] = range;
    const nodes = tree.children.slice(start, end + 1);
    const pres = nodes.filter((n: any) => n.tagName === 'pre');
    const group = pres.flatMap((node: any) => node.children);
    const first = pres?.[0] as any;
    const language =
      first.children?.[0]?.properties?.className?.[0] ?? 'language-sh';
    const text = toText({ tagName: 'pre', type: 'element', children: group });
    const children = h('code', { class: language }, text);
    const newNode = h('pre', { 'data-language': language }, [children]);
    tree.children.splice(start, nodes.length, newNode as any);
  };
}

/**
 * This plugin is used to add language class to code blocks that don't have one.
 */
function codeLanguage() {
  return function transformer(tree: Root) {
    visit(tree, '', (node: any, _idx: any, parent: any) => {
      if (!isCodeEl(node, parent)) return;
      if (!node.properties) node.properties = {};
      const lang = node.properties?.className?.[0];

      if (!lang) {
        node.properties.className = ['language-sh'];
      }
      if (lang === 'language-rust,ignore') {
        node.properties.className[0] = 'language-rust';
      }
      if (lang?.includes('sway')) {
        node.properties.className[0] = 'language-rust';
      }
      if (lang?.includes('ts')) {
        node.properties.className[0] = 'language-typescript';
      }
      if (lang?.includes('tsx')) {
        node.properties.className[0] = 'language-typescript';
      }
    });
  };
}

/**
 * This plugin is used to add line numbers to code blocks.
 */
function addLines() {
  return function transformer(tree: Root) {
    visit(tree, '', (node: any, _idx: any, parent: any) => {
      if (!isCodeEl(node, parent)) return;
      node.children = node.children.reduce(
        (acc: any, node: any, idx: number) => {
          if (node.properties?.['data-line'] === '') {
            node.properties['data-line'] = idx + 1;
          }
          return acc.concat(node);
        },
        [],
      );
    });
  };
}

function addRawCode() {
  return function transformer(tree: Root) {
    visit(tree, '', (node: any) => {
      if (node.tagName !== 'pre') return;
      const text = toText(node);
      if (!node.properties) node.properties = {};
      node.properties['__code'] = text;
    });
  };
}

const getRehypeCodeOptions = (): Partial<RehypeCodeOptions> => ({
  theme: 'dracula',
  getHighlighter,
});

export const getMdxCode = (): PluggableList => [
  codeImport,
  codeGroup,
  codeLanguage,
  [rehypeCode, getRehypeCodeOptions()],
  addLines,
  addRawCode,
];
