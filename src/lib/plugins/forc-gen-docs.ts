/* eslint-disable @typescript-eslint/no-explicit-any */

import { NodeHtmlMarkdown } from 'node-html-markdown';
import fs from 'node:fs';
import { EOL } from 'os';
import path from 'path';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const files = new Map<string, string>();
const oldContentMap = new Map<string, string>();

function getFilesOnCache(filepath: string) {
  const oldResults = files.get(filepath);
  if (!oldResults) files.set(filepath, String(fs.readFileSync(filepath)));
  return files.get(filepath);
}

let thisFilePath = '';

// this only works for the sway generated docs
export function handleForcGenDocs(
  node: any,
  filepath: string,
  rootDir: string
) {
  thisFilePath = filepath;
  let child;
  if (thisFilePath.endsWith('commands/index.md')) {
    child = { value: 'index' };
  } else {
    child = node.children[0].children[0];
  }

  const newTree = transformContent(child, rootDir) as any;
  if (newTree === null) {
    return null;
  }
  const slug = child.value.replace(' ', '-');
  const children = newTree.children as any[];
  const newTreeChildren = children.map((n: any) => {
    n.data = { hProperties: { id: slug }, id: slug };
    return n;
  });
  return newTreeChildren;
}

function transformContent(node: any, rootDir: string) {
  const fileName = node.value;
  const filePathName = fileName.replace(' ', '_').concat('.html');
  const isLatest = thisFilePath.includes('/latest');

  const swayBuildFilePath = isLatest
    ? 'docs/latest/builds/sway/master/book/forc'
    : 'docs/builds/sway/master/book/forc';

  const folders = thisFilePath.split('/forc/')[1].split('/');
  const lastPath = `${swayBuildFilePath}/${folders[0]}/${
    folders.length === 3 ? folders[1].concat('/') : ''
  }`;

  let fileAbsPath = path.resolve(path.join(rootDir, lastPath), filePathName);

  // fallback
  if (!fs.existsSync(fileAbsPath)) {
    fileAbsPath = path.resolve(
      path.join(rootDir, `${swayBuildFilePath}/plugins/forc_client/`),
      filePathName
    );
  }
  const fileContent = fs.readFileSync(fileAbsPath, 'utf8');
  const cachedFile = getFilesOnCache(fileAbsPath);
  const oldContent = oldContentMap.get(node.value);

  /** Return result from cache if file content is the same */
  if (fileContent === cachedFile && oldContent) {
    return null;
  }

  const ast = getBuildFileAST(fileContent);
  return ast;
}

function getBuildFileAST(content: string) {
  const lines = content.split(EOL);

  let lineStart = 1;
  let lineEnd = 1;
  // get the content inside the <main> tag

  for (let i = 0; i < lines.length; i++) {
    const start = lines[i].trimStart() === '<main>';
    if (start === true && lineStart === 1) {
      lineStart = i + 1;
    } else {
      const end = lines[i].trimStart() === '</main>';
      if (end === true) {
        lineEnd = i;
      }
    }
  }
  const newLines = lines.slice(lineStart, lineEnd);

  // transform html to md
  const md = NodeHtmlMarkdown.translate(
    /* html */ newLines.join('\n'),
    /* options (optional) */ {},
    /* customTranslators (optional) */ undefined,
    /* customCodeBlockTranslators (optional) */ undefined
  );
  const processor = unified().use(remarkParse);

  // transform md to AST
  const ast = processor.parse(md);

  return ast;
}
