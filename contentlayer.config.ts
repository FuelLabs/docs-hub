import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer/source-files';

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: (doc: any) => DocParser.createSlug(doc._raw.flattenedPath),
    },
  },
}));

const includeDirs = [
  'docs/sway/docs/book/src',
  'docs/fuelup/docs/src',
  'docs/fuels-rs/docs/src',
  'docs/fuels-ts/apps/docs/src',
  'docs/fuel-indexer/docs/src',
  'docs/fuel-specs/src',
  'docs/fuel-graphql-docs/docs',
  'docs/fuels-wallet/packages/docs/docs',
  'docs/guides/docs',
  'docs/about-fuel',
];

const excludeDirs = [
  'docs/guides/docs/guides.json',
  'docs/guides/docs/nav.json',
  'docs/about-fuel/nav.json',
  'docs/sway/docs/book/src/SUMMARY.md',
  'docs/fuelup/docs/src/SUMMARY.md',
  'docs/fuels-rs/docs/src/SUMMARY.md',
  'docs/fuel-indexer/docs/src/SUMMARY.md',
  'docs/fuel-specs/src/SUMMARY.md',
];

export default makeSource({
  contentDirPath: './',
  contentDirInclude: includeDirs,
  contentDirExclude: excludeDirs,
  documentTypes: [MdDoc],
});
