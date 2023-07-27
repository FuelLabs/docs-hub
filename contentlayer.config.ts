import { defineDocumentType, makeSource } from 'contentlayer/source-files';

import { Docs } from './src/lib2/Docs';

const MdDoc = defineDocumentType(() => ({
  name: 'MdDoc',
  filePathPattern: '**/*.{md,mdx}',
  contentType: 'markdown',
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
      resolve: (doc) => Docs.createSlug(doc._raw.flattenedPath),
    },
  },
}));

const includeDirs = Docs.getIncludePaths();
const excludeDirs = Docs.getExcludePaths();

export default makeSource({
  contentDirPath: './',
  contentDirInclude: includeDirs,
  contentDirExclude: excludeDirs,
  documentTypes: [MdDoc],
});
