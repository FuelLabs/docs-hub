import { headingRank } from 'hast-util-heading-rank';
import { toString as hastToString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';
import type { NodeHeading } from '~/src/types';

export function rehypeExtractHeadings({
  headings,
  slug,
}: {
  headings: NodeHeading[];
  slug: string;
}) {
  // biome-ignore lint/suspicious/noExplicitAny:
  return () => (tree: any) => {
    visit(tree, 'element', (node) => {
      if(node.properties.id === 'on'){
        node.properties.id = "fuel-on"
      }
      node.properties['data-nightly'] = slug.includes('/nightly');
      const rank = headingRank(node);
      if (rank) {
        node.properties['data-rank'] = `h${rank}`;
      }
      if (rank && node?.type === 'element') {
        const firstChild = node.children?.[0];
        if (firstChild?.tagName === 'a') {
          node.children[0] = firstChild.children?.[0];
        }
      }
      if (rank === 2 && node?.type === 'element') {
        headings.push({
          title: hastToString(node),
          id: node.properties.id?.toString(),
        });
      }
      if (rank === 3 && node?.type === 'element') {
        const last = headings[headings.length - 1];
        if (last) {
          last.children = last?.children || [];
          last.children.push({
            title: hastToString(node),
            id: node.properties.id.toString(),
          });
        }
      }
    });
  };
}
