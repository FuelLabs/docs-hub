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
      required: false,
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
  // DEFAULT DOCS & GUIDES
  'docs/sway/docs/book/src',
  'docs/fuelup/docs/src',
  'docs/fuels-rs/docs/src',
  'docs/fuels-ts/apps/docs/src',
  'docs/fuel-specs/src',
  'docs/fuel-graphql-docs/docs',
  'docs/fuels-wallet/packages/docs/docs',
  'docs/guides/docs',
  'docs/intro',
  // NIGHTLY DOCS
  'docs/nightly/sway/docs/book/src',
  'docs/nightly/fuelup/docs/src',
  'docs/nightly/fuels-rs/docs/src',
  'docs/nightly/fuels-ts/apps/docs/src',
  'docs/nightly/fuel-specs/src',
  'docs/nightly/fuel-graphql-docs/docs',
  'docs/nightly/fuels-wallet/packages/docs/docs',
  // BETA-4 DOCS
  'docs/beta-4/sway/docs/book/src',
  'docs/beta-4/fuelup/docs/src',
  'docs/beta-4/fuels-rs/docs/src',
  'docs/beta-4/fuels-ts/apps/docs/src',
  'docs/beta-4/fuel-specs/src',
  'docs/beta-4/fuel-graphql-docs/docs',
  'docs/beta-4/fuels-wallet/packages/docs/docs',
  'docs/beta-4/guides/docs',
];

const excludeDirs = [
  // DEFAULT DOCS & GUIDES
  'docs/guides/docs/guides.json',
  'docs/guides/docs/nav.json',
  'docs/guides/docs/migration-guide/breaking-change-log/README.md',
  'docs/guides/docs/migration-guide/breaking-change-log/package.json',
  'docs/guides/docs/migration-guide/breaking-change-log/pnpm-lock.yaml',
  'docs/intro/nav.json',
  'docs/sway/docs/book/src/SUMMARY.md',
  'docs/fuelup/docs/src/SUMMARY.md',
  'docs/fuels-rs/docs/src/SUMMARY.md',
  'docs/fuel-specs/src/SUMMARY.md',
  // NIGHTLY DOCS
  'docs/nightly/sway/docs/book/src/SUMMARY.md',
  'docs/nightly/fuelup/docs/src/SUMMARY.md',
  'docs/nightly/fuels-rs/docs/src/SUMMARY.md',
  'docs/nightly/fuel-specs/src/SUMMARY.md',
  // BETA-4 DOCS
  'docs/beta-4/sway/docs/book/src/SUMMARY.md',
  'docs/beta-4/fuelup/docs/src/SUMMARY.md',
  'docs/beta-4/fuels-rs/docs/src/SUMMARY.md',
  'docs/beta-4/fuel-specs/src/SUMMARY.md',
];

export default makeSource({
  contentDirPath: './',
  contentDirInclude: includeDirs,
  contentDirExclude: excludeDirs,
  documentTypes: [MdDoc],
});
