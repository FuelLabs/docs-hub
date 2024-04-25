import { EOL } from 'os';
import type { Root } from 'remark-gfm';

export type TSVersions = {
  forc: string;
  fuelCore: string;
  fuels: string;
  fuelsInstallVersion?: string;
};

export function handleScriptLink(tree: Root, versions: TSVersions) {
  let url = '';
  // biome-ignore lint/suspicious/noImplicitAnyLet:
  let paragraphIndex;
  // biome-ignore lint/suspicious/noImplicitAnyLet:
  let linkStartIndex;
  // biome-ignore lint/suspicious/noExplicitAny:
  const newTree = tree as any;
  // biome-ignore lint/suspicious/noExplicitAny:
  const firstNode = tree.children[0] as any;
  const lines = firstNode.value.split(EOL);
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trimStart();
    if (trimmed.startsWith('http')) {
      url = trimmed.replace('${forc}', versions.forc);
    }
  }
  if (url !== '') {
    for (let i = 1; i < tree.children.length; i++) {
      // biome-ignore lint/suspicious/noExplicitAny:
      const node = tree.children[i] as any;
      if (node.type === 'paragraph' && node.children) {
        paragraphIndex = i;
        for (let idx = 1; idx < node.children.length; idx++) {
          const el = node.children[idx];
          if (el.type === 'html' && el.value.includes(':href="url"')) {
            linkStartIndex = idx;
          }
        }
        break;
      }
      if (paragraphIndex && linkStartIndex) {
        const linkNode =
          newTree.children[paragraphIndex].children[linkStartIndex];
        linkNode.type = 'link';
        linkNode.title = null;
        linkNode.url = url;
        linkNode.value = null;
        linkNode.children = [
          newTree.children[paragraphIndex].children[linkStartIndex + 1],
        ];
        newTree.children[paragraphIndex].children[linkStartIndex] = linkNode;
        newTree.children[paragraphIndex].children.splice(
          linkStartIndex + 1,
          linkStartIndex + 2
        );
      }
    }
  }
  return newTree;
}
