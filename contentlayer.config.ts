import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer/source-files';
import { MdDoc } from '~/.contentlayer/generated/types';

import { DocParser } from './src/lib/md-parser';

const ParentType = defineNestedType(() => ({
  name: 'Parent',
  fields: {
    label: {
      type: 'string',
      required: true,
    },
    link: {
      type: 'string',
      required: true,
    },
  },
}));

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
    parent: {
      type: 'nested',
      of: ParentType,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => DocParser.createSlug(doc._raw.flattenedPath),
    },
  },
}));

const includeDirs = DocParser.getIncludePaths();
const excludeDirs = DocParser.getExcludePaths();

export default makeSource({
  contentDirPath: './',
  contentDirInclude: includeDirs,
  contentDirExclude: excludeDirs,
  documentTypes: [MdDoc],
});
