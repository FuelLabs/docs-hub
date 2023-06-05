/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'node:fs';
import { EOL } from 'os';
import path from 'path';
import type { Parent } from 'unist-util-visit';

function extractCommentBlock(content: string, comment: string | null) {
  const lines = content.split(EOL);
  if (!comment) {
    return content;
  }

  let lineStart = 1;
  let lineEnd = 1;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lines.length; i++) {
    const start =
      lines[i].replace(/\s/g, '') === `//ANCHOR:${comment}` ||
      lines[i].trimStart() === `// #region ${comment}`;
    if (start === true && lineStart === 1) {
      lineStart = i + 1;
    } else {
      const end =
        lines[i].replace(/\s/g, '') === `//ANCHOR_END:${comment}` ||
        lines[i].trimStart() === `// #endregion ${comment}` ||
        lines[i].replace(/\s/g, '') === `//ANCHOR:${comment}`;

      if (end === true) {
        lineEnd = i;
      }
    }
  }
  const newLines = lines.slice(lineStart, lineEnd);

  // remove any other example tags
  let trimmedLines = newLines.filter((line) => {
    const thisLine = line.trimStart();
    return (
      thisLine.startsWith('// ANCHOR') === false &&
      thisLine.startsWith('// #region') === false &&
      thisLine.startsWith('// #endregion') === false
    );
  });
  trimmedLines = trimmedLines.map((line) => {
    if (line.trimStart().startsWith('// #context')) {
      return line.replace('// #context ', '');
    }
    return line;
  });
  const linesContent = trimmedLines.join('\n');
  return linesContent;
}

const files = new Map<string, string>();
const oldContentMap = new Map<string, string>();

function getFilesOnCache(filepath: string) {
  const oldResults = files.get(filepath);
  if (!oldResults) files.set(filepath, String(fs.readFileSync(filepath)));
  return files.get(filepath);
}

export function handleExampleImports(
  node: any,
  dirname: string,
  rootDir: string,
  parent: Parent
) {
  let content = '';

  let filePath = node.value.replace(/(\.\.\/)+/g, '');

  let exampleName = null;
  let paths = [];

  if (node.type === 'code') {
    // handle mdbook docs example format
    filePath = filePath.replace('{{#include ', '').replace('}}', '');
    paths = filePath.split(':');
    if (paths.length > 1) exampleName = filePath.split(':').pop();
  } else if (node.type === 'text') {
    // handle ts-sdk docs example format
    filePath = filePath.replace('<<< @/', '');

    if (filePath.startsWith('docs-snippets')) {
      filePath = `apps/${filePath}`;
    }
    const pathData = filePath.split('{');
    filePath = pathData[0];

    paths = filePath.split('#');
    if (paths.length > 1) exampleName = filePath.split('#').pop();
  }

  // if there is an example at the end of the url, remove it from the filepath
  if (exampleName) {
    filePath = paths[0];
  }

  const bookPath = dirname.split('/')[1];
  const fileAbsPath = path.resolve(
    path.join(rootDir, `docs/${bookPath}/`),
    filePath
  );

  if (node.type === 'text') {
    node.type = 'code';
    // TODO: make dynamic for all langs
    node.lang = 'ts';
    parent.type = 'root';
  }

  const fileContent = fs.readFileSync(fileAbsPath, 'utf8');
  const cachedFile = getFilesOnCache(fileAbsPath);

  const oldContent = oldContentMap.get(node.value);

  /** Return result from cache if file content is the same */
  if (fileContent === cachedFile && oldContent) {
    return oldContent;
  }

  content = extractCommentBlock(fileContent, exampleName);

  return content;
}
