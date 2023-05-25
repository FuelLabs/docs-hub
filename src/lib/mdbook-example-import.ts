/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'node:fs';
import { EOL } from 'os';
import path from 'path';
import type { Root } from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Parent } from 'unist-util-visit';

// const ROOT_DIR = path.resolve(__dirname, '../../../../../../../');

function extractCommentBlock(content: string, comment: string | null) {
  const lines = content.split(EOL);
  if (!comment) {
    return content;
  }

  let lineStart = 1;
  let lineEnd = 1;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lines.length; i++) {
    const start = lines[i].trimStart() === `// ANCHOR: ${comment}`;
    if (start === true && lineStart === 1) {
      lineStart = i + 1;
    } else {
      let end = lines[i].trimStart() === `// ANCHOR_END: ${comment}`;
      if (end === false) {
        end = lines[i].trimStart() === `// ANCHOR: ${comment}`;
      }
      if (end === true) {
        lineEnd = i;
      }
    }
  }
  const newLines = lines.slice(lineStart, lineEnd);
  // remove any other ANCHOR tags
  const trimmedLines = newLines.filter((line) => {
    return line.trimStart().startsWith('// ANCHOR') === false;
  });
  const linesContent = trimmedLines.join('\n');
  return linesContent;
}

// const files = new Map<string, string>();

// function getFilesOnCache(filepath: string) {
//   const oldResults = files.get(filepath);
//   if (!oldResults) files.set(filepath, String(fs.readFileSync(filepath)));
//   return files.get(filepath);
// }

interface Options {
  filepath: string;
}

export function mdBookExampleImport(options: Options = { filepath: '' }) {
  const rootDir = process.cwd();
  const { filepath } = options;
  const dirname = path.relative(rootDir, path.dirname(filepath));

  return function transformer(tree: Root) {
    const nodes: [any, number | null, Parent][] = [];

    visit(tree, '', (node: any, idx, parent) => {
      if (node.type === 'code' && node.value.startsWith('{{#include')) {
        nodes.push([node as any, idx, parent as Parent]);
      }
    });
    nodes.forEach(([node]) => {
      let content = '';

      let filePath = node.value
        .replace('{{#include ', '')
        .replace('}}', '')
        .replace(/(\.\.\/)+/g, '');

      const paths = filePath.split(':');

      const exampleName = paths.length > 1 ? filePath.split(':').pop() : null;

      if (exampleName) {
        filePath = paths[0];
      }

      // for now assuming all examples are in the Sway examples folder
      // TODO: make dynamic for all mdbooks
      const bookPath = dirname.split('/')[1];
      const fileAbsPath = path.resolve(
        path.join(rootDir, `docs/${bookPath}/`),
        filePath
      );

      const fileContent = fs.readFileSync(fileAbsPath, 'utf8');
      // const cachedFile = getFilesOnCache(fileAbsPath);

      // /** Return result from cache if file content is the same */
      // if (fileContent === cachedFile) {
      //   // eslint-disable-next-line no-param-reassign
      //   node.value = content;
      //   return;
      // }

      content = extractCommentBlock(fileContent, exampleName);

      // eslint-disable-next-line no-param-reassign
      node.value = content;
    });
  };
}
