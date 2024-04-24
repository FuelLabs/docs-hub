/* eslint-disable @typescript-eslint/no-explicit-any */

import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import fs from 'node:fs';
import { EOL } from 'os';
import path from 'path';
import * as prettier from 'prettier';
import type { Root } from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Parent } from 'unist-util-visit';

const ROOT_DIR = path.resolve(__dirname, '../../../');

function toAST(content: string) {
  return acorn.parse(content, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });
}

function extractLines(
  content: string,
  fromLine: number | undefined,
  toLine: number | undefined
) {
  const lines = content.split(EOL);
  const start = fromLine || 1;
  let end;
  if (toLine) {
    end = toLine;
  } else if (lines[lines.length - 1] === '') {
    end = lines.length - 1;
  } else {
    end = lines.length;
  }
  return lines.slice(start - 1, end).join('\n');
}

function getLineOffsets(str: string) {
  const regex = /\r?\n/g;
  const offsets = [0];
  while (regex.exec(str)) offsets.push(regex.lastIndex);
  offsets.push(str.length);
  return offsets;
}

function extractTestCase(source: string, testCase: string) {
  const ast = toAST(source);

  let charStart = 0;
  let charEnd = 0;
  let content = '';
  const chars = source.split('');
  const linesOffset = getLineOffsets(source);

  walk.fullAncestor(ast, (node: any, _state, ancestors) => {
    if (node.name === 'test') {
      const parent = ancestors.reverse()[1] as any;
      const args = parent.arguments || [];
      const val = args[0]?.value;

      if (val && val === testCase) {
        const body = args[1]?.body;
        content = chars.slice(body.start, body.end).join('').slice(1, -1);
        content = prettier.format(content, { parser: 'babel' }).trimEnd();
        charStart = body.start;
        charEnd = body.end;
      }
    }
  });

  const lineStart = linesOffset.findIndex((i) => i >= charStart);
  const lineEnd = linesOffset.findIndex((i) => i >= charEnd);

  return {
    content,
    lineStart,
    lineEnd: lineEnd !== lineStart ? lineEnd : undefined,
  };
}

const files = new Map<string, string>();
const attrsList = new Map<string, any[]>();

function getFilesOnCache(filepath: string) {
  const oldResults = files.get(filepath);
  if (!oldResults) files.set(filepath, String(fs.readFileSync(filepath)));
  return files.get(filepath);
}

interface Options {
  filepath: string;
}

export function codeExamples(options: Options = { filepath: '' }) {
  const rootDir = process.cwd();
  const { filepath } = options;
  const dirname = path.relative(rootDir, path.dirname(filepath));

  return function transformer(tree: Root) {
    const nodes: [any, number | null, Parent][] = [];

    visit(tree, 'mdxJsxFlowElement', (node: any, idx, parent) => {
      if (node.name === 'CodeExamples') {
        nodes.push([node as any, idx, parent as Parent]);
      }
    });

    nodes.forEach(([node]) => {
      const attr = node.attributes;
      let ts_content = '';
      let apollo_content = '';
      let urql_content = '';

      if (!attr.length) {
        throw new Error('CodeExamples needs to have properties defined');
      }

      const file = attr.find((i: any) => i.name === 'file')?.value;

      const ts_lines =
        attr.find((i: any) => i.name === 'ts_lines')?.value || [];
      const apollo_lines =
        attr.find((i: any) => i.name === 'apollo_lines')?.value || [];
      const urql_lines =
        attr.find((i: any) => i.name === 'urql_lines')?.value || [];

      const ts_testCase = attr.find(
        (i: any) => i.name === 'ts_testCase'
      )?.value;
      const apollo_testCase = attr.find(
        (i: any) => i.name === 'apollo_testCase'
      )?.value;
      const urql_testCase = attr.find(
        (i: any) => i.name === 'urql_testCase'
      )?.value;

      const fileAbsPath = path.resolve(path.join(rootDir, dirname), file);

      let [ts_lineStart, ts_lineEnd] = ts_lines as any[];
      let [apollo_lineStart, apollo_lineEnd] = apollo_lines as any[];
      let [urql_lineStart, urql_lineEnd] = urql_lines as any[];

      const fileContent = fs.readFileSync(fileAbsPath, 'utf8');

      const cachedFile = getFilesOnCache(fileAbsPath);

      const attrId = `${fileAbsPath}${ts_testCase || ''}${ts_lineStart || ''}${
        ts_lineEnd || ''
      }`;

      const oldList = attrsList.get(attrId);

      /** Return result from cache if file content is the same */
      if (fileContent === cachedFile && oldList) {
        node.attributes.push(...attrsList.get(attrId)!);
        return;
      }

      if (ts_lineStart || ts_lineEnd) {
        ts_content = extractLines(fileContent, ts_lineStart, ts_lineEnd);
      }

      if (apollo_lineStart || apollo_lineEnd) {
        apollo_content = extractLines(
          fileContent,
          apollo_lineStart,
          apollo_lineEnd
        );
      }

      if (urql_lineStart || urql_lineEnd) {
        urql_content = extractLines(fileContent, urql_lineStart, urql_lineEnd);
      }

      if (ts_testCase) {
        const testResult = extractTestCase(fileContent, ts_testCase);
        ts_lineStart = testResult.lineStart;
        ts_lineEnd = testResult.lineEnd;
        ts_content = testResult.content;
      }

      if (apollo_testCase) {
        const testResult = extractTestCase(fileContent, apollo_testCase);
        apollo_lineStart = testResult.lineStart;
        apollo_lineEnd = testResult.lineEnd;
        apollo_content = testResult.content;
      }

      if (urql_testCase) {
        const testResult = extractTestCase(fileContent, urql_testCase);
        urql_lineStart = testResult.lineStart;
        urql_lineEnd = testResult.lineEnd;
        urql_content = testResult.content;
      }

      const newAttrs = [
        {
          name: '__ts_content',
          type: 'mdxJsxAttribute',
          value: ts_content,
        },
        {
          name: '__apollo_content',
          type: 'mdxJsxAttribute',
          value: apollo_content,
        },
        {
          name: '__urql_content',
          type: 'mdxJsxAttribute',
          value: urql_content,
        },
        {
          name: '__filepath',
          type: 'mdxJsxAttribute',
          value: path.resolve(dirname, file).replace(`${ROOT_DIR}/`, ''),
        },
        {
          name: '__filename',
          type: 'mdxJsxAttribute',
          value: path.parse(file).base,
        },
        {
          name: '__ts_language',
          type: 'mdxJsxAttribute',
          value: path.extname(fileAbsPath).replace('.', ''),
        },
        {
          name: '__ts_lineStart',
          type: 'mdxJsxAttribute',
          value: ts_lineStart,
        },
        {
          name: '__apollo_lineStart',
          type: 'mdxJsxAttribute',
          value: apollo_lineStart,
        },
        {
          name: '__urql_lineStart',
          type: 'mdxJsxAttribute',
          value: urql_lineStart,
        },
        ts_lineEnd && {
          name: '__ts_lineEnd',
          type: 'mdxJsxAttribute',
          value: ts_lineEnd,
        },
        apollo_lineEnd && {
          name: '__apollo_lineEnd',
          type: 'mdxJsxAttribute',
          value: apollo_lineEnd,
        },
        urql_lineEnd && {
          name: '__urql_lineEnd',
          type: 'mdxJsxAttribute',
          value: urql_lineEnd,
        },
      ];

      node.attributes.push(...newAttrs);

      /** Add results on cache */
      attrsList.set(attrId, newAttrs);
    });
  };
}
