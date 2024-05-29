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
  return function transformer(tree: Root, _file: any) {
    function normalizeIndentation(lines: string[]) {
      const minLeadingIndentations = lines.reduce((min, line) => {
        const match = line.match(/^[\s\t]*/);
        if (/^\s*$/.test(line)) {
          return min;
        }
        const leadingIndentations = match ? match[0].length : 0;
        return Math.min(min, leadingIndentations);
      }, Number.POSITIVE_INFINITY);
      return lines.map((line) => line.substring(minLeadingIndentations));
    }

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
            newValue = normalizeIndentation(lines).join('\n');
          }

          return newValue;
        });
      }
    });
  };
}
