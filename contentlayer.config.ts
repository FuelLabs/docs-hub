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
  'docs/sway/docs/book/src',
  'docs/fuelup/docs/src',
  'docs/fuels-rs/docs/src',
  'docs/fuels-ts/apps/docs/src',
  'docs/fuel-specs/src',
  'docs/fuel-graphql-docs/docs',
  'docs/fuels-wallet/packages/docs/docs',
  'docs/guides/docs',
  'docs/intro',
  // 'docs/fuel-nix/book/src',
  // 'docs/about-fuel',
  'docs/nightly/sway/docs/book/src',
  'docs/nightly/fuelup/docs/src',
  'docs/nightly/fuels-rs/docs/src',
  'docs/nightly/fuels-ts/apps/docs/src',
  'docs/nightly/fuel-specs/src',
  'docs/nightly/fuel-graphql-docs/docs',
  'docs/nightly/fuels-wallet/packages/docs/docs',
  // 'docs/nightly/guides/docs',
  // 'docs/nightly/about-fuel',
];

const excludeDirs = [
  'docs/guides/docs/guides.json',
  'docs/guides/docs/nav.json',
  'docs/intro/nav.json',
  // 'docs/about-fuel/nav.json',
  'docs/sway/docs/book/src/SUMMARY.md',
  'docs/sway/docs/book/src/forc/commands/forc_deploy.md',
  'docs/sway/docs/book/src/forc/commands/forc_run.md',
  'docs/fuelup/docs/src/SUMMARY.md',
  'docs/fuels-rs/docs/src/SUMMARY.md',
  'docs/fuel-specs/src/SUMMARY.md',
  // 'docs/nightly/guides/docs/guides.json',
  // 'docs/nightly/guides/docs/nav.json',
  // 'docs/nightly/about-fuel/nav.json',
  'docs/nightly/sway/docs/book/src/SUMMARY.md',
  'docs/nightly/sway/docs/book/src/forc/commands/forc_deploy.md',
  'docs/nightly/sway/docs/book/src/forc/commands/forc_run.md',
  'docs/nightly/fuelup/docs/src/SUMMARY.md',
  'docs/nightly/fuels-rs/docs/src/SUMMARY.md',
  'docs/nightly/fuel-specs/src/SUMMARY.md',
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
