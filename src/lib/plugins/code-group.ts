/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Root } from 'remark-gfm';

function hasCodeGroup(node: any) {
  return node.children?.some((n: any) =>
    [':::', '::: code-group'].includes(n.value),
  );
}

export function codeGroup() {
  return function transformer(tree: Root) {
    const range: number[] = [];
    function findRange(node: any, idx: number) {
      if (node.children?.length) {
        node.children.forEach(findRange);
      }
      const isGroup = hasCodeGroup(node);
      if (isGroup) {
        range.push(idx);
      }
    }
    tree.children.forEach(findRange);

    if (!range.length) return;
    const [start, end] = range;
    const nodes = tree.children.slice(start, end + 1);
    const group = nodes.map((node: any) => node.value).join('\n');
    const newNode = { ...nodes[1], value: group.trimStart() };
    tree.children.splice(start, nodes.length, newNode);
  };
}
