/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';

import { codeImport } from './src/lib/plugins/code-import';
import { fixIndent } from './src/lib/plugins/fix-indent';
import { handlePlugins } from './src/lib/plugins/plugins';
import { getMdxCode } from './src/lib/plugins/rehype-code';
import { rehypeExtractHeadings } from './src/lib/toc';

function simplyfyPath(path: string) {
  if (path.startsWith('docs/sway')) {
    return `sway/${path.split('/').slice(5).join('/')}`;
  }
  return path;
}

const MdDoc = defineDocumentType(() => ({
  name: 'MdDoc',
  filePathPattern: `**/*.md`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the doc',
      required: false,
    },
    category: {
      type: 'string',
      description: 'The category of the doc',
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => simplyfyPath(doc._raw.flattenedPath),
    },
  },
}));

const remarkPlugins = [
  remarkSlug,
  remarkGfm,
  handlePlugins,
  codeImport,
  fixIndent,
];

const rehypePlugins = [...getMdxCode(), rehypeExtractHeadings];

export default makeSource({
  contentDirPath: './',
  contentDirInclude: ['docs/sway/docs/book'],
  documentTypes: [MdDoc],
  mdx: {
    mdxOptions: (options) => ({
      mdExtensions: ['.md', '.mdx'],
      format: 'detect' as any,
      rehypePlugins: (options.rehypePlugins ?? []).concat(rehypePlugins),
      remarkPlugins: (options.remarkPlugins ?? []).concat(remarkPlugins),
    }),
  },
});
