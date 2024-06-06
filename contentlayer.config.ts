import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from "contentlayer/source-files";

import { DocParser } from "./src/lib/md-parser";

const ParentType = defineNestedType(() => ({
  name: "Parent",
  fields: {
    label: {
      type: "string",
      required: true,
    },
    link: {
      type: "string",
      required: true,
    },
  },
}));

const MdDoc = defineDocumentType(() => ({
  name: "MdDoc",
  filePathPattern: "**/*.{md,mdx}",
  contentType: "markdown",
  fields: {
    title: {
      type: "string",
      description: "The title of the doc",
      required: false,
    },
    category: {
      type: "string",
      description: "The category of the doc",
      required: false,
    },
    parent: {
      type: "nested",
      of: ParentType,
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      resolve: (doc: any) => DocParser.createSlug(doc._raw.flattenedPath),
    },
  },
}));

const includeDirs = [
  // DEFAULT DOCS & GUIDES
  "docs/sway/docs/book/src",
  "docs/fuels-rs/docs/src",
  "docs/fuels-ts/apps/docs/src",
  "docs/fuel-specs/src",
  "docs/fuel-graphql-docs/docs",
  "docs/fuels-wallet/packages/docs/docs",
  "docs/guides/docs",
  "docs/intro",
  "docs/contributing",
  "docs/sway-libs/docs/book/src",
  "docs/sway-standards/docs/src",
  // NIGHTLY DOCS
  "docs/nightly/sway/docs/book/src",
  "docs/nightly/fuels-rs/docs/src",
  "docs/nightly/fuels-ts/apps/docs/src",
  "docs/nightly/fuel-specs/src",
  "docs/nightly/fuel-graphql-docs/docs",
  "docs/nightly/fuels-wallet/packages/docs/docs",
  "docs/nightly/sway-libs/docs/book/src",
  "docs/nightly/sway-standards/docs/src",
];

const excludeDirs = [
  // DEFAULT DOCS & GUIDES
  "docs/guides/docs/guides.json",
  "docs/guides/docs/nav.json",
  "docs/guides/docs/migration-guide/breaking-change-log/README.md",
  "docs/guides/docs/migration-guide/breaking-change-log/package.json",
  "docs/guides/docs/migration-guide/breaking-change-log/node_modules",
  "docs/guides/docs/migration-guide/breaking-change-log/pnpm-lock.yaml",
  "docs/intro/nav.json",
  "docs/contributing/nav.json",
  "docs/sway/docs/book/src/SUMMARY.md",
  "docs/fuels-rs/docs/src/SUMMARY.md",
  "docs/fuel-specs/src/SUMMARY.md",
  "docs/sway-libs/docs/book/src/SUMMARY.md",
  "docs/sway-standards/docs/src/SUMMARY.md",
  "docs/sway-by-example-lib/docs/src/SUMMARY.md",
  "docs/guides/docs/migration-guide/breaking-change-log/node_modules",
  // NIGHTLY DOCS
  "docs/nightly/sway/docs/book/src/SUMMARY.md",
  "docs/nightly/fuels-rs/docs/src/SUMMARY.md",
  "docs/nightly/fuel-specs/src/SUMMARY.md",
  "docs/nightly/sway-libs/docs/book/src/SUMMARY.md",
  "docs/nightly/sway-standards/docs/src/SUMMARY.md",
];

export default makeSource({
  contentDirPath: "./",
  contentDirInclude: includeDirs,
  contentDirExclude: excludeDirs,
  documentTypes: [MdDoc],
});
