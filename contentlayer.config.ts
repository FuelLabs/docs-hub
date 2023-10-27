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
  // 'docs/fuel-nix/book/src',
  // 'docs/about-fuel',
  'docs/latest/sway/docs/book/src',
  'docs/latest/fuelup/docs/src',
  'docs/latest/fuels-rs/docs/src',
  'docs/latest/fuels-ts/apps/docs/src',
  'docs/latest/fuel-indexer/docs/src',
  'docs/latest/fuel-specs/src',
  'docs/latest/fuel-graphql-docs/docs',
  'docs/latest/fuels-wallet/packages/docs/docs',
  // 'docs/latest/guides/docs',
  // 'docs/latest/about-fuel',
];

const excludeDirs = [
  'docs/guides/docs/guides.json',
  'docs/guides/docs/nav.json',
  // 'docs/about-fuel/nav.json',
  'docs/sway/docs/book/src/SUMMARY.md',
  'docs/sway/docs/book/src/forc/commands/forc_deploy.md',
  'docs/sway/docs/book/src/forc/commands/forc_run.md',
  'docs/fuelup/docs/src/SUMMARY.md',
  'docs/fuels-rs/docs/src/SUMMARY.md',
  'docs/fuel-indexer/docs/src/SUMMARY.md',
  'docs/fuel-specs/src/SUMMARY.md',
  // 'docs/latest/guides/docs/guides.json',
  // 'docs/latest/guides/docs/nav.json',
  // 'docs/latest/about-fuel/nav.json',
  'docs/latest/sway/docs/book/src/SUMMARY.md',
  'docs/latest/sway/docs/book/src/forc/commands/forc_deploy.md',
  'docs/latest/sway/docs/book/src/forc/commands/forc_run.md',
  'docs/latest/fuelup/docs/src/SUMMARY.md',
  'docs/latest/fuels-rs/docs/src/SUMMARY.md',
  'docs/latest/fuel-indexer/docs/src/SUMMARY.md',
  'docs/latest/fuel-specs/src/SUMMARY.md',
  // 'docs/fuel-nix/book/src/SUMMARY.md',
  'docs/guides/docs/migration-guide/breaking-change-log/README.md',
  'docs/guides/docs/migration-guide/breaking-change-log/package.json',
  'docs/guides/docs/migration-guide/breaking-change-log/pnpm-lock.yaml',
];

export default makeSource({
  contentDirPath: './',
  contentDirInclude: includeDirs,
  contentDirExclude: excludeDirs,
  documentTypes: [MdDoc],
});
