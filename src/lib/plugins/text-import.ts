import fs from 'node:fs';
import { EOL } from 'os';
import path from 'path';
import { remark } from 'remark';
import type { Root } from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Parent } from 'unist-util-visit/lib';
import { FUEL_TESTNET } from '~/src/config/constants';

export type CommentTypes = '<!--' | '{/*' | '//' | '/*';

export function getEndCommentType(commentType: string) {
  // biome-ignore lint/suspicious/noImplicitAnyLet:
  let commentEnd;
  switch (commentType) {
    case '/*':
      commentEnd = '*/';
      break;
    case '{/*':
      commentEnd = '*/}';
      break;
    case '//':
      commentEnd = '';
      break;
    case '<!--':
      commentEnd = '-->';
      break;
    default:
  }
  return commentEnd;
}

function extractCommentBlock(
  content: string,
  comment: string,
  commentType: CommentTypes
) {
  const lines = content.split(EOL);
  const commentEnd = getEndCommentType(commentType);
  let lineStart = 1;
  let lineEnd = 1;
  for (let i = 0; i < lines.length; i++) {
    const start =
      lines[i].replace(/\s+/g, '') ===
      `${commentType}${comment}:example:start${commentEnd}`;
    if (start === true) {
      lineStart = i + 1;
    } else {
      const end =
        lines[i].replace(/\s+/g, '') ===
        `${commentType}${comment}:example:end${commentEnd}`;
      if (end === true) {
        lineEnd = i;
      }
    }
  }

  if (lineStart < 0) {
    lineStart = 0;
  }
  if (lineEnd < 0) {
    lineEnd = lines.length;
  }

  const linesContent = lines
  .slice(lineStart, lineEnd)
  .join('\n')
  .replace(/<TestAction[^<]*?\/>/gs, '');

  return linesContent;
}

interface Options {
  filepath: string;
}

export function textImport(options: Options = { filepath: '' }) {
  const rootDir = process.cwd();
  const { filepath } = options;
  const dirname = path.relative(rootDir, path.dirname(filepath));

  return function transformer(tree: Root) {
    // biome-ignore lint/suspicious/noExplicitAny:
    const nodes: [any, number | null, Parent<any, any>][] = [];

    // biome-ignore lint/suspicious/noExplicitAny:
    visit(tree, 'mdxJsxFlowElement', (node: any, idx, parent) => {
      if (node.name === 'TextImport') {
        // biome-ignore lint/suspicious/noExplicitAny:
        nodes.push([node as any, idx ?? null, parent as Parent<any, any>]);
      }
    });

    nodes.forEach(([node]) => {
      const attr = node.attributes;
      let content = '';

      if (!attr.length) {
        throw new Error('TextImport needs to have properties defined');
      }

      // biome-ignore lint/suspicious/noExplicitAny:
      const file = attr.find((i: any) => i.name === 'file')?.value;
      // biome-ignore lint/suspicious/noExplicitAny:
      const comment = attr.find((i: any) => i.name === 'comment')?.value;
      const commentType = attr.find(
        // biome-ignore lint/suspicious/noExplicitAny:
        (i: any) => i.name === 'commentType'
      )?.value;
      let linesIncluded =
        // biome-ignore lint/suspicious/noExplicitAny:
        attr.find((i: any) => i.name === 'linesIncluded')?.value || [];
      const fileAbsPath = path.resolve(path.join(rootDir, dirname), file);
      const fileContent = fs.readFileSync(fileAbsPath, 'utf8');
      const resp = Array.isArray(linesIncluded) ? 0 : linesIncluded;
      if (resp !== 0) {
        linesIncluded = JSON.parse(linesIncluded.value);
      }
      const commentResult = extractCommentBlock(
        fileContent,
        comment,
        commentType
      );
      content = commentResult;
      content = content
        .replaceAll('{props.fuelTestnet}', FUEL_TESTNET)
        .replaceAll('{props.fuelTestnetInlineCode}', `\`${FUEL_TESTNET}\``);

      const processor = remark();
      const ast = processor.parse(content);

      node.type = 'element';
      node.children = ast.children;
      node.tagName = 'div';
    });
  };
}
