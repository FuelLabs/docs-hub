import fs from 'node:fs';
import { EOL } from 'os';
import path from 'path';
import type { Parent } from 'unist-util-visit/lib';
import type { VersionSet } from '~/src/types';

function extractCommentBlock(content: string, comment: string | null) {
  const lines = content.split(EOL);
  if (!comment) {
    return content;
  }

  let lineStart = 1;
  let lineEnd = 1;
  let foundStart = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].replace(/\s/g, '');

    const start =
      trimmed === `//ANCHOR:${comment}` ||
      lines[i].trimStart() === `// #region ${comment}` ||
      trimmed === `#ANCHOR:${comment}`;
    if (start === true && !foundStart) {
      lineStart = i + 1;
      foundStart = true;
    } else {
      const end =
        trimmed === `//ANCHOR_END:${comment}` ||
        lines[i].trimStart() === `// #endregion ${comment}` ||
        trimmed === `//ANCHOR:${comment}` ||
        trimmed === `#ANCHOR:${comment}` ||
        trimmed === `#ANCHOR_END:${comment}`;

      if (end === true) lineEnd = i;
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
  // biome-ignore lint/suspicious/noExplicitAny:
  node: any,
  dirname: string,
  rootDir: string,
  // biome-ignore lint/suspicious/noExplicitAny:
  parent: Parent<any, any>
) {
  let content = '';
  let filePath = node.value.replace(/(\.\.\/)+/g, '');

  let exampleName = null;
  let paths = [];
  let versionSet: VersionSet = 'default';
  if (dirname.includes('docs/nightly/')) {
    versionSet = 'nightly';
  }

  if (node.type === 'code') {
    // handle mdbook docs example format
    filePath = filePath.replace('{{#include ', '').replace('}}', '');
    paths = filePath.split(':');
    if (paths.length > 1) exampleName = filePath.split(':').pop();
  } else if (node.type === 'text') {
    // handle ts-sdk docs example format
    filePath = filePath.replace(/<<< @\/?/, '');

    const pathData = filePath.split('{');
    filePath = pathData[0];

    paths = filePath.split('#');
    if (paths.length > 1) exampleName = filePath.split('#').pop();
  }

  // if there is an example at the end of the url, remove it from the filepath
  if (exampleName) {
    filePath = paths[0];
  }

  const bookPathIndex = versionSet === 'default' ? 1 : 2;
  const bookPath = dirname.split('/')[bookPathIndex];
  const docsPath = versionSet === 'default' ? 'docs/' : `docs/${versionSet}/`;
  let fileAbsPath = path.resolve(
    path.join(rootDir, `${docsPath}${bookPath}/`),
    filePath
  );

  if (node.type === 'text') {
    node.type = 'code';
    const paths = filePath.split('.');
    let fileType = paths[paths.length - 1];
    if (fileType === 'sw') fileType = 'rust';
    node.lang = fileType;
    parent.type = 'root';
  }

  try {
    if (fileAbsPath.includes('/fuels-ts/')) {
      fileAbsPath = fileAbsPath
        .replace('fuels-ts/demo', 'fuels-ts/apps/demo')
        .replace(
          'fuels-ts/create-fuels-counter-guide',
          'fuels-ts/apps/create-fuels-counter-guide'
        )
        .replace('fuels-ts/docs', 'fuels-ts/apps/docs')
        .replace('fuels-ts/fuel-asm', 'fuels-ts/apps/docs/fuel-asm');
    }

    // If the example snippet is a relative path
    // Then we can just join up the current dir path with the relative snippet path
    if (filePath.startsWith('./')) {
      fileAbsPath = path.join(dirname, filePath);
    }

    const fileContent = fs.readFileSync(fileAbsPath, 'utf8');
    const cachedFile = getFilesOnCache(fileAbsPath);

    const oldContent = oldContentMap.get(node.value);

    /** Return result from cache if file content is the same */
    if (fileContent === cachedFile && oldContent) {
      return oldContent;
    }

    content = extractCommentBlock(fileContent, exampleName);
  } catch (err) {
    console.error('ERROR GETTING EXAMPLE CODE:', err);
  }

  if (!content) {
    throw new Error(`${fileAbsPath} not found`);
  }

  return content;
}
