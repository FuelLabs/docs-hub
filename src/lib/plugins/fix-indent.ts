import { join } from 'path';
import type { Root } from 'remark-gfm';
import { visit } from 'unist-util-visit';

// biome-ignore lint/suspicious/noExplicitAny:
function getLangFromNode(node: any) {
  if (node.type === 'mdxJsxFlowElement') {
    // biome-ignore lint/suspicious/noExplicitAny:
    return node.attributes.find((attr: any) => attr.name === '__language')
      ?.value;
  }
  const lang = node.lang?.includes(',') ? node.lang.split(',')[0] : node.lang;
  return lang === 'sway' ? 'rust' : lang;
}

// biome-ignore lint/suspicious/noExplicitAny:
function getValueFromNode(node: any) {
  if (node.type === 'mdxJsxFlowElement') {
    // biome-ignore lint/suspicious/noExplicitAny:
    return node.attributes.find((attr: any) => attr.name === '__content')
      ?.value;
  }
  return node.value;
}

// biome-ignore lint/suspicious/noExplicitAny:
function setValueOnNode(node: any, cb: (value: string) => string) {
  if (node.type === 'mdxJsxFlowElement') {
    const idx = node.attributes.findIndex(
      // biome-ignore lint/suspicious/noExplicitAny:
      (attr: any) => attr.name === '__content'
    );
    if (idx !== -1) {
      const value = node.attributes[idx].value;
      node.attributes.push({ ...node.attributes[idx], value: cb(value) });
      return;
    }
    return;
  }
  node.value = cb(node.value);
  return;
}

export function fixIndent() {
  // biome-ignore lint/suspicious/noExplicitAny:
  return function transformer(tree: Root, file: any) {
    const rootDir = process.cwd();
    const fullpath = join(rootDir, file.data.rawDocumentData?.sourceFilePath);
    const isSway = fullpath.includes('sway');
    const isFuelsTs = fullpath.includes('fuels-ts');

    // biome-ignore lint/suspicious/noExplicitAny:
    visit(tree, '', (node: any) => {
      if (!node) return;

      if (['code', 'mdxJsxFlowElement'].includes(node.type)) {
        const lang = getLangFromNode(node);
        const value = getValueFromNode(node);
        if (!value) return;

        setValueOnNode(node, (value) => {
          let newValue = value;
          if (
            node.type === 'code' &&
            ['rust', 'rust,ignore', 'ts', 'typescript'].includes(lang)
          ) {
            const lines = newValue.split('\n');
            const newLines = lines
              // parsing code tabs/spaces in Fuels-TS code blocks
              .map((line: string) => {
                if (isSway) {
                  return line.replace(/\s{4}/g, '\t');
                }
                return line;
              })
              .map((line: string) => {
                if (!isFuelsTs) return line;
                return line.replace(/\s{4}/g, '\t').replace(/^\t/g, '');
              })
              // parsing code blocks with 8 spaces indentation
              .map((line: string) => {
                if (isSway) return line;
                if (line.match(/^\s{8}/)) {
                  return line.replace(/^\s{8}/, '');
                }
                return line;
              })
              // parsing code blocks with 2 spaces indentation
              .map((line: string) => {
                if (isSway) return line;
                if (line.match(/^\s{2}([^\s].*)/)) {
                  return line.replace(/^\s{2}/, '\t');
                }
                return line;
              })
              .join('\n');

            newValue = newLines;
          }

          return newValue;
        });
      }
    });
  };
}
