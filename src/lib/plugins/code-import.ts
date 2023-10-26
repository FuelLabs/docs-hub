/* eslint-disable @typescript-eslint/no-explicit-any */

import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import fs from 'node:fs';
import { EOL } from 'os';
import path from 'path';
import * as prettier from 'prettier';
import type { Root } from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { FUEL_TESTNET } from '~/src/config/constants';

import { getEndCommentType } from './text-import';
import type { CommentTypes } from './text-import';

function toAST(content: string) {
  return acorn.parse(content, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });
}

function extractLines(
  content: string,
  fromLine: number | undefined,
  toLine: number | undefined,
  linesIncluded: number[]
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
  if (linesIncluded.length > 0) {
    const newLines = linesIncluded.map((line) => line - start);
    return lines
      .slice(start - 1, end)
      .filter((_line, index) => newLines.includes(index))
      .join('\n');
  } else {
    return lines.slice(start - 1, end).join('\n');
  }
}

function extractCommentBlock(
  content: string,
  comment: string,
  commentType: CommentTypes,
  trim: string
) {
  const lines = content.split(EOL);
  let lineStart = 1;
  let lineEnd = 1;

  const endCommentType = getEndCommentType(commentType);

  for (let i = 0; i < lines.length; i++) {
    const startLineA = `${commentType}ANCHOR:${comment}${endCommentType}`;
    const endLineA = `${commentType}ANCHOR_END:${comment}${endCommentType}`;
    const startLineB = `${commentType}${comment}:example:start${endCommentType}`;
    const endLineB = `${commentType}${comment}:example:end${endCommentType}`;
    const cleanLine = lines[i].replace(/\s+/g, '');
    const start = cleanLine === startLineA || cleanLine === startLineB;
    if (start) {
      lineStart = i + 1;
    } else {
      const end = cleanLine === endLineA || cleanLine === endLineB;
      if (end) {
        lineEnd = i;
      }
    }
  }

  if (trim === 'true') {
    const startShift = lines[lineStart + 1].includes('```') ? 2 : 1;
    const endShift = lines[lineEnd - 2].includes('```') ? 2 : 1;
    lineStart = lineStart + startShift;
    lineEnd = lineEnd - endShift;
  }

  if (lineStart < 0) {
    lineStart = 0;
  }
  if (lineEnd < 0) {
    lineEnd = lines.length;
  }

  const newLines = lines.slice(lineStart, lineEnd);

  const linesContent = newLines
    .filter((line) => !line.includes('ANCHOR'))
    .join('\n');

  return {
    content: linesContent,
    lineStart,
    lineEnd,
  };
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

export function codeImport() {
  return function transformer(tree: Root, file: any) {
    const rootDir = process.cwd();
    const dirname = file.data.rawDocumentData?.sourceFileDir;
    const nodes: [any, number | undefined, any][] = [];
    if (dirname.startsWith('docs/fuels-wallet')) return;

    visit(tree, 'mdxJsxFlowElement', (node: any, idx, parent) => {
      if (node.name === 'CodeImport') {
        nodes.push([node as any, idx, parent]);
      }
    });

    nodes.forEach(([node]) => {
      const attr = node.attributes;
      let content = '';

      if (!attr.length) {
        throw new Error('CodeImport needs to have properties defined');
      }

      const file = attr.find((i: any) => i.name === 'file')?.value;
      let lineStart = attr.find((i: any) => i.name === 'lineStart')?.value;
      let lineEnd = attr.find((i: any) => i.name === 'lineEnd')?.value;
      const comment = attr.find((i: any) => i.name === 'comment')?.value;
      const commentType = attr.find(
        (i: any) => i.name === 'commentType'
      )?.value;
      const trim = attr.find((i: any) => i.name === 'trim')?.value;
      let linesIncluded =
        attr.find((i: any) => i.name === 'linesIncluded')?.value || [];
      const testCase = attr.find((i: any) => i.name === 'testCase')?.value;
      const fileAbsPath = path.resolve(path.join(rootDir, dirname), file);
      const lang =
        attr.find((i: any) => i.name === 'lang')?.value ||
        path.extname(fileAbsPath).replace('.', '');
      const fileContent = fs.readFileSync(fileAbsPath, 'utf8');

      const resp = Array.isArray(linesIncluded) ? 0 : linesIncluded;
      if (resp !== 0) {
        linesIncluded = JSON.parse(linesIncluded.value);
      }

      if (lineStart || lineEnd) {
        if (!lineStart) lineStart = 1;
        if (!lineEnd) lineEnd = 1;
        content = extractLines(fileContent, lineStart, lineEnd, linesIncluded);
      } else if (comment) {
        const commentResult = extractCommentBlock(
          fileContent,
          comment,
          commentType,
          trim
        );
        lineStart = commentResult.lineStart;
        lineEnd = commentResult.lineEnd;
        content = commentResult.content;
      } else if (testCase) {
        const testResult = extractTestCase(fileContent, testCase);
        lineStart = testResult.lineStart;
        lineEnd = testResult.lineEnd;
        content = testResult.content;
      } else {
        content = fileContent;
      }

      content = content.replaceAll('{props.fuelTestnet}', FUEL_TESTNET);

      const newAttrs = [
        {
          name: '__content',
          type: 'mdxJsxAttribute',
          value: content,
        },
        {
          name: '__language',
          type: 'mdxJsxAttribute',
          value: lang,
        },
      ];

      node.attributes.push(...newAttrs);
    });
  };
}
