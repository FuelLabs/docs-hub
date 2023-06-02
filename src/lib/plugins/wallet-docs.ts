/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EOL } from 'os';
import type { Root } from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Parent } from 'unist-util-visit';

interface Options {
  filepath: string;
}

export function walletDocs(options: Options = { filepath: '' }) {
  const { filepath } = options;
  return function transformer(tree: Root) {
    const nodes: [any, number | null, Parent][] = [];

    // get images to update urls
    visit(tree, '', (node: any, idx, parent) => {
      if (node.type === 'image' && filepath.includes('/fuels-wallet/')) {
        nodes.push([node as any, idx, parent as Parent]);
      }
    });

    // get Demo components update src
    visit(tree, 'mdxJsxFlowElement', (node: any, idx, parent) => {
      if (
        node.name === 'Demo' ||
        (node.name === 'Player' && filepath.includes('/fuels-wallet/'))
      ) {
        nodes.push([node as any, idx, parent as Parent]);
      }
    });

    nodes.forEach(([node]) => {
      if (node.name === 'Demo') {
        const media = node.attributes.find(
          (i: any) => i.name === 'media'
        )?.value;
        const lines = media.value.split(EOL);
        const oldSrcs: string[] = [];
        const apiPaths: string[] = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trimStart().startsWith('src:')) {
            const srcIndex = lines[i].indexOf("src: '");
            const startIndex = srcIndex + 6;
            const endIndex = lines[i].length - 2;
            const thisOldSrc = lines[i].slice(startIndex, endIndex);
            oldSrcs.push(thisOldSrc);
            const fileType = thisOldSrc.includes('.mp4') ? '.mp4' : '.png';
            const paths = thisOldSrc.split('/');
            paths.shift();
            const finalPath = paths.join('&&').replace(fileType, '');
            const thisApiPath = `/api/${
              fileType === '.png' ? 'image' : 'video'
            }/${finalPath}`;
            apiPaths.push(thisApiPath);
          }
        }

        const old = node.attributes[0];
        if (oldSrcs.length === apiPaths.length) {
          oldSrcs.forEach((src, i) => {
            old.value.value = old.value.value.replace(src, apiPaths[i]);
          });
        }

        const elements =
          node.attributes[0].value.data.estree.body[0].expression.elements;
        elements.forEach((el: any, i: number) => {
          const props = el.properties;
          const newProps = props.map((property: any) => {
            if (property.key.name === 'src') {
              if (oldSrcs.length === apiPaths.length) {
                oldSrcs.forEach((src, i) => {
                  property.value.value = property.value.value.replace(
                    src,
                    apiPaths[i]
                  );
                  property.value.raw = property.value.raw.replace(
                    src,
                    apiPaths[i]
                  );
                });
              }
            }
            return property;
          });

          node.attributes[0].value.data.estree.body[0].expression.elements[
            i
          ].properties = newProps;
        });

        node.attributes[0].value.value = old;
      } else if (node.name === 'Player') {
        const src = node.attributes.find((i: any) => i.name === 'src')?.value;
        let paths = src.split('/');
        paths.shift();
        paths = paths.join('&&').replace('.mp4', '');
        const videoPath = `/api/video/${paths}`;
        node.attributes[0].value = videoPath;
      } else {
        let paths = node.url.split('/');
        paths.shift();
        paths = paths.join('&&').replace('.png', '');
        const imagePath = `/api/image/${paths}`;
        node.url = imagePath;
      }
    });
  };
}
