/* eslint-disable @typescript-eslint/no-explicit-any */
import { toText } from 'hast-util-to-text';
import { h } from 'hastscript';
import type { Options as RehypeCodeOptions } from 'rehype-pretty-code';
import rehypeCode from 'rehype-pretty-code';
import type { Root } from 'remark-gfm';
import type { PluggableList } from 'unified';
import { visit } from 'unist-util-visit';

function codeImport() {
  return function transformer(tree: Root) {
    visit(tree, 'mdxJsxFlowElement', (node: any) => {
      if (node.name !== 'CodeImport') return;
      node.type = 'element';
      node.tagName = 'pre';

      const lang = node.attributes?.find((a: any) => a.name === '__language');
      const content = node.attributes?.find((a: any) => a.name === '__content');
      const code = h('code', { class: lang?.value }, content?.value);
      node.children = [code];
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
    node.tagName === 'inlineCode'
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
});

export const getMdxCode = (): PluggableList => [
  codeImport,
  codeGroup,
  codeLanguage,
  [rehypeCode, getRehypeCodeOptions()],
  addLines,
  addRawCode,
];
