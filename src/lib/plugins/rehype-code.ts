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
    ],
    paths: {
      languages: `${getShikiPath()}/languages/`,
      themes: `${getShikiPath()}/themes/`,
    },
  });

  return highlighter;
};

const getRehypeCodeOptions = (): Partial<RehypeCodeOptions> => ({
  // Requirements for theme:
  // - Has light and dark version
  // - Uses italic in several places
  theme: 'dracula',
  // Need to use a custom highlighter because rehype-pretty-code doesn't
  // let us customize "paths".
  getHighlighter,
});

function hasCodeGroup(node: any) {
  return node.children?.some((n: any) =>
    [':::', '::: code-group'].includes(n.value),
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
    visit(tree, 'element', (node: any) => {
      if (node.tagName !== 'pre' && node.tagName !== 'code') return;
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
    });
  };
}

/**
 * This plugin is used to add line numbers to code blocks.
 */
function addLines() {
  return function transformer(tree: Root) {
    visit(tree, 'element', (node: any) => {
      if (node.tagName !== 'code') return;
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
    visit(tree, 'element', (node: any) => {
      if (node.tagName !== 'pre') return;
      const text = toText(node);
      node.properties['__code'] = text;
    });
  };
}

export const getMdxCode = (): PluggableList => [
  codeGroup,
  codeLanguage,
  [rehypeCode, getRehypeCodeOptions()],
  addLines,
  addRawCode,
];
