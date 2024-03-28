import { readFileSync } from 'fs';
import { join as pathJoin } from 'path';
import * as fs from 'fs/promises';
import { toText } from 'hast-util-to-text';
import { h } from 'hastscript';
import prettier from 'prettier';
import type { Options as RehypeCodeOptions } from 'rehype-pretty-code';
import rehypeCode from 'rehype-pretty-code';
import type { Root } from 'remark-gfm';
import { getHighlighter as shikiGetHighlighter } from 'shiki';
import type { PluggableList } from 'unified';
import { visit } from 'unist-util-visit';
import { FUEL_TESTNET } from '~/src/config/constants';

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
  const pathFolder = `${getShikiPath()}/languages`;

  const highlighter = await shikiGetHighlighter({
    // This is technically not compatible with shiki's interface but
    // necessary for rehype-pretty-code to work
    // - https://rehype-pretty-code.netlify.app/ (see Custom Highlighter)
    // biome-ignore lint/suspicious/noExplicitAny:
    ...(options as any),
    langs: [
      {
        id: 'rust',
        scopeName: 'source.rust',
        path: `${pathFolder}/rust.tmLanguage.json`,
        displayName: 'Rust',
        aliases: ['rs'],
      },
      {
        id: 'javascript',
        scopeName: 'source.js',
        path: `${pathFolder}/javascript.tmLanguage.json`,
        displayName: 'JavaScript',
        aliases: ['js'],
      },
      {
        id: 'typescript',
        scopeName: 'source.ts',
        path: `${pathFolder}/typescript.tmLanguage.json`,
        displayName: 'TypeScript',
        aliases: ['ts'],
      },
      {
        id: 'tsx',
        scopeName: 'source.tsx',
        path: `${pathFolder}/tsx.tmLanguage.json`,
        displayName: 'TSX',
      },
      {
        id: 'jsx',
        scopeName: 'source.js.jsx',
        path: `${pathFolder}/jsx.tmLanguage.json`,
        displayName: 'JSX',
      },
      {
        id: 'json',
        scopeName: 'source.json',
        path: `${pathFolder}/json.tmLanguage.json`,
        displayName: 'JSON',
      },
      {
        id: 'toml',
        scopeName: 'source.toml',
        path: `${pathFolder}/toml.tmLanguage.json`,
        displayName: 'TOML',
      },
      {
        id: 'graphql',
        scopeName: 'source.graphql',
        path: `${pathFolder}/graphql.tmLanguage.json`,
        displayName: 'GraphQL',
        embeddedLangs: ['javascript', 'typescript', 'jsx', 'tsx'],
      },
      {
        id: 'sway',
        scopeName: 'source.sway',
        path: `${pathFolder}/sway.tmLanguage.json`,
      },
    ],
  });

  return highlighter;
};

// biome-ignore lint/suspicious/noExplicitAny:
function isElement(value: any): value is Element {
  return value ? value.type === 'element' : false;
}
// biome-ignore lint/suspicious/noExplicitAny:
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
// biome-ignore lint/suspicious/noExplicitAny:
function processCodeGroup(nodes: any[]): any[] {
  return (
    nodes
      // biome-ignore lint/suspicious/noExplicitAny:
      .filter((n: any) => n.tagName === 'pre')
      // biome-ignore lint/suspicious/noExplicitAny:
      .map((pre: any) => {
        const language =
          pre.children?.[0]?.properties?.className?.[0].replace(
            'language-',
            ''
          ) ?? '';
        const code = pre.children?.[0]?.children
          // biome-ignore lint/suspicious/noExplicitAny:
          ?.map((child: any) => child.value)
          .join('');

        const child = h('code', { class: language }, code);

        return {
          type: 'element',
          tagName: 'pre',
          properties: {
            language: language,
            code: code,
          },
          children: [child],
        };
      })
  );
}

function codeGroup2() {
  // biome-ignore lint/suspicious/noExplicitAny:
  return function transformer(tree: any) {
    // biome-ignore lint/suspicious/noExplicitAny:
    const nodes: any[] = [];
    let start: number | null = null;
    let end: number | null = null;
    // biome-ignore lint/suspicious/noExplicitAny:
    tree.children.forEach((node: any, index: number) => {
      if (
        node.children &&
        node.children[0]?.type === 'text' &&
        node.children[0]?.value.trim().startsWith(':::')
      ) {
        if (node.children[0]?.value.trim() === '::: code-group') {
          end = null;
          start = index;
        } else if (start !== null) {
          end = index;
          const children = processCodeGroup(nodes);
          // biome-ignore lint/suspicious/noExplicitAny:
          const codeTabsElement: any = {
            type: 'mdxJsxFlowElement',
            name: 'CodeTabs',
            children: children,
          };
          tree.children.splice(start, end - start + 1, codeTabsElement);
        }
      } else if (start !== null && end === null) {
        nodes.push(node);
      }
    });
  };
}

function codeGroup() {
  // biome-ignore lint/suspicious/noExplicitAny:
  return function transformer(tree: any) {
    let i = 0;
    while (i < tree.children.length) {
      const node = tree.children[i];

      if (hasCodeGroup(node)) {
        const start = i;
        i++;
        // Find the end of the code group
        while (
          i < tree.children.length &&
          !hasEndOfCodeGroup(tree.children[i])
        ) {
          i++;
        }
        const end = i + 1;
        const codeGroupNodes = tree.children.slice(start, end);
        const children = processCodeGroup(codeGroupNodes);
        // biome-ignore lint/suspicious/noExplicitAny:
        const codeTabsElement: any = {
          type: 'mdxJsxFlowElement',
          name: 'CodeTabs',
          children: children,
        };
        tree.children.splice(start, end - start, codeTabsElement);
      } else {
        i++;
      }
    }
  };
}

// biome-ignore lint/suspicious/noExplicitAny:
function hasCodeGroup(node: any): boolean {
  return (
    node.children &&
    node.children[0]?.type === 'text' &&
    node.children[0]?.value.trim() === '::: code-group'
  );
}

// biome-ignore lint/suspicious/noExplicitAny:
function hasEndOfCodeGroup(node: any): boolean {
  return (
    node.children &&
    node.children[0].type === 'text' &&
    node.children[0].value.trim() === ':::'
  );
}

/**
 * This plugin is used to add language class to code blocks that don't have one.
 */
function codeLanguage() {
  return function transformer(tree: Root) {
    // biome-ignore lint/suspicious/noExplicitAny:
    visit(tree, '', (node: any, _idx: any, parent: any) => {
      if (!isCodeEl(node, parent)) return;
      if (!node.properties) node.properties = {};
      const lang = node.properties?.className?.[0];

      if (lang?.includes('rust')) {
        node.properties.className[0] = 'language-rust';
      }
      if (lang?.includes('sway')) {
        node.properties.className[0] = 'language-sway';
      }
      if (lang?.includes('ts')) {
        node.properties.className[0] = 'language-typescript';
      }
      if (lang?.includes('tsx')) {
        node.properties.className[0] = 'language-typescript';
      }
      if (lang?.includes('sh')) {
        node.properties.className[0] = 'language-sh';
      }
      if (lang?.includes('json')) {
        node.properties.className[0] = 'language-json';
      }
    });
  };
}

// biome-ignore lint/suspicious/noExplicitAny:
function isGraphQLCodeSamples(node: any) {
  return (
    node.name === 'CodeExamples' &&
    // biome-ignore lint/suspicious/noExplicitAny:
    node.attributes?.find((a: any) => a.name === '__ts_content')
  );
}

// biome-ignore lint/suspicious/noExplicitAny:
function getGraphQLCodeTabs(node: any) {
  const codeProps = {
    className: ['language-typescript'],
    'data-language': 'typescript',
  };

  const prettierProps = {
    parser: 'typescript',
    semi: true,
    singleQuote: true,
  };

  // biome-ignore lint/suspicious/noExplicitAny:
  const findProp = (name: string) => (a: any) => a.name === name;
  const tsContent = node.attributes?.find(findProp('__ts_content'));
  const apolloContent = node.attributes?.find(findProp('__apollo_content'));
  const urqlContent = node.attributes?.find(findProp('__urql_content'));
  const filepath = node.attributes?.find(findProp('__filepath'));

  const tsCodeContent = tsContent?.value ?? '';
  const tsCodeRaw = prettier.format(tsCodeContent, prettierProps);
  const tsCode = h('code', codeProps, tsCodeRaw);

  const testnet = filepath.value.includes('/beta-4/') ? 'beta-4' : FUEL_TESTNET;

  const apolloImport = `import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

  const apolloClient= new ApolloClient({
  uri: 'https://${testnet}.fuel.network/graphql',
  cache: new InMemoryCache(),
  });\n\n`;
  const apolloContentValue = apolloImport + apolloContent?.value ?? '';
  const apolloRaw = prettier.format(apolloContentValue, prettierProps);
  const apolloCode = h('code', codeProps, apolloRaw);

  const urlqImport = `import { Client, cacheExchange, fetchExchange } from 'urql';
  
  const urqlClient = new Client({
    url: 'https:/${testnet}.fuel.network/graphql',
    exchanges: [cacheExchange, fetchExchange],
  });\n\n`;
  const urlQContentValue = urlqImport + urqlContent?.value ?? '';
  const urlQRaw = prettier.format(urlQContentValue, prettierProps);
  const urqlCode = h('code', codeProps, urlQRaw);
  return { tsCode, apolloCode, urqlCode };
}

function codeImport() {
  return function transformer(tree: Root) {
    // biome-ignore lint/suspicious/noExplicitAny:
    visit(tree, 'mdxJsxFlowElement', (node: any) => {
      if (node.name !== 'CodeImport' && node.name !== 'CodeExamples') return;
      // biome-ignore lint/suspicious/noExplicitAny:
      const content = node.attributes?.find((a: any) => a.name === '__content');

      if (isGraphQLCodeSamples(node)) {
        const { tsCode, apolloCode, urqlCode } = getGraphQLCodeTabs(node);
        const tsPre = h('element');
        tsPre.tagName = 'pre';
        tsPre.children = [tsCode];

        const apolloPre = h('element');
        apolloPre.tagName = 'pre';
        apolloPre.children = [apolloCode];

        const urlqPre = h('element');
        urlqPre.tagName = 'pre';
        urlqPre.children = [urqlCode];

        node.children = [tsPre, apolloPre, urlqPre];
        return;
      }

      node.type = 'element';
      node.tagName = 'pre';
      // biome-ignore lint/suspicious/noExplicitAny:
      const lang = node.attributes?.find((a: any) => a.name === '__language');
      const code = h(
        'code',
        { class: lang?.value },
        content?.value.replace(/\r/g, '')
      );
      node.children = [code];
    });
  };
}

/**
 * This plugin is used to add line numbers to code blocks.
 */
function addLines() {
  return function transformer(tree: Root) {
    // biome-ignore lint/suspicious/noExplicitAny:
    visit(tree, '', (node: any, _idx: any, parent: any) => {
      if (!isCodeEl(node, parent)) return;
      let counter = 1;
      // biome-ignore lint/suspicious/noExplicitAny:
      node.children = node.children.reduce((acc: any, node: any) => {
        if (node.properties?.['data-line'] === '') {
          node.properties['data-line'] = counter;
          counter = counter + 1;
        }
        return acc.concat(node);
      }, []);
    });
  };
}

function addRawCode() {
  return function transformer(tree: Root) {
    // biome-ignore lint/suspicious/noExplicitAny:
    visit(tree, '', (node: any) => {
      if (node.tagName !== 'pre') return;
      const text = toText(node);
      if (!node.properties) node.properties = {};
      node.properties.__code = text;
    });
  };
}

function addNumberOfLines() {
  return function transformer(tree: Root) {
    // biome-ignore lint/suspicious/noExplicitAny:
    visit(tree, '', (node: any, _idx: any, parent: any) => {
      if (!node.properties) node.properties = {};
      if (!isCodeEl(node, parent)) {
        const text = toText(node);
        const lines = text.split('\n').length;
        node.properties.__lines = lines;
      }
    });
  };
}

const getRehypeCodeOptions = (
  theme: 'light' | 'dark'
): Partial<RehypeCodeOptions> => {
  const themeFileName: string = theme === 'light' ? 'github-light' : 'dracula';
  return {
    theme: JSON.parse(
      readFileSync(`${getShikiPath()}/themes/${themeFileName}.json`, 'utf-8')
    ),
    getHighlighter,
  };
};

export const getMdxCode = (theme: 'light' | 'dark'): PluggableList => [
  codeImport,
  codeGroup,
  codeGroup2,
  codeLanguage,
  [rehypeCode, getRehypeCodeOptions(theme)],
  addLines,
  addRawCode,
  addNumberOfLines,
];
