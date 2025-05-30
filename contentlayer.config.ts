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
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      resolve: (doc: any) => DocParser.createSlug(doc._raw.flattenedPath),
    },
  },
}));

const includeDirs = [
  // DEFAULT DOCS & GUIDES
  'docs/sway/docs/book/src',
  'docs/fuels-rs/docs/src',
  'docs/fuels-ts/apps/docs/src',
  'docs/fuel-specs/src',
  'docs/fuel-graphql-docs/docs',
  'docs/fuels-wallet/packages/docs/docs',
  'docs/guides/docs',
  'docs/intro',
  'docs/contributing',
  'docs/sway-libs/docs/book/src',
  'docs/sway-standards/docs/src',
  'docs/sway-by-example-lib/docs/src',
  'docs/migrations-and-disclosures/docs/src',
  'docs/fuel-book/docs/src',
  'docs/verified-addresses/docs/src',
  'docs/fuel-token-overview/docs/src',
  'docs/integration-docs/docs/src',
  'docs/node-operator/docs/src',
  'docs/ai/docs/src',
  // NIGHTLY DOCS
  'docs/nightly/sway/docs/book/src',
  'docs/nightly/fuels-rs/docs/src',
  'docs/nightly/fuels-ts/apps/docs/src',
  'docs/nightly/fuel-specs/src',
  'docs/nightly/fuel-graphql-docs/docs',
  'docs/nightly/fuels-wallet/packages/docs/docs',
  'docs/nightly/sway-libs/docs/book/src',
  'docs/nightly/sway-standards/docs/src',
  'docs/nightly/sway-by-example-lib/docs/src',
  'docs/nightly/migrations-and-disclosures/docs/src',
  'docs/nightly/fuel-book/docs/src',
  'docs/nightly/verified-addresses/docs/src',
  'docs/nightly/fuel-token-overview/docs/src',
  'docs/nightly/integration-docs/docs/src',
  'docs/nightly/node-operator/docs/src',
  'docs/nightly/ai/docs/src',
];

const excludeDirs = [
  // DEFAULT DOCS & GUIDES
  'docs/guides/docs/guides.json',
  'docs/guides/docs/nav.json',
  'docs/intro/nav.json',
  'docs/contributing/nav.json',
  'docs/sway/docs/book/src/SUMMARY.md',
  'docs/fuels-rs/docs/src/SUMMARY.md',
  'docs/fuel-specs/src/SUMMARY.md',
  'docs/sway-libs/docs/book/src/SUMMARY.md',
  'docs/sway-standards/docs/src/SUMMARY.md',
  'docs/sway-by-example-lib/docs/src/SUMMARY.md',
  'docs/migrations-and-disclosures/docs/src/SUMMARY.md',
  'docs/fuel-book/docs/src/SUMMARY.md',
  'docs/verified-addresses/docs/src/SUMMARY.md',
  'docs/fuel-token-overview/docs/src/SUMMARY.md',
  'docs/integration-docs/docs/src/SUMMARY.md',
  'docs/node-operator/docs/src/SUMMARY.md',
  'docs/ai/docs/src/SUMMARY.md',
  // NIGHTLY DOCS
  'docs/nightly/sway/docs/book/src/SUMMARY.md',
  'docs/nightly/fuels-rs/docs/src/SUMMARY.md',
  'docs/nightly/fuel-specs/src/SUMMARY.md',
  'docs/nightly/sway-libs/docs/book/src/SUMMARY.md',
  'docs/nightly/sway-standards/docs/src/SUMMARY.md',
  'docs/nightly/sway-by-example-lib/docs/src/SUMMARY.md',
  'docs/nightly/migrations-and-disclosures/docs/src/SUMMARY.md',
  'docs/nightly/fuel-book/docs/src/SUMMARY.md',
  'docs/nightly/verified-addresses/docs/src/SUMMARY.md',
  'docs/nightly/fuel-token-overview/docs/src/SUMMARY.md',
  'docs/nightly/integration-docs/docs/src/SUMMARY.md',
  'docs/nightly/node-operator/docs/src/SUMMARY.md',
  'docs/nightly/ai/docs/src/SUMMARY.md',
];

export default makeSource({
  contentDirPath: './',
  contentDirInclude: includeDirs,
  contentDirExclude: excludeDirs,
  documentTypes: [MdDoc],
});
