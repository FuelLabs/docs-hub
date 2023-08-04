import { globbySync } from 'globby';

const PATHS_REPLACE_MAP = {
  'docs/sway': 'docs/sway/docs/book/src',
  'docs/fuelup': 'docs/fuelup/docs/src',
  'docs/fuels-rs': 'docs/fuels-rs/docs/src',
  'docs/fuels-ts': 'docs/fuels-ts/apps/docs/src',
  'docs/fuel-specs': 'docs/fuel-specs/src',
  'docs/fuel-indexer': 'docs/fuel-indexer/docs/src',
  'docs/fuels-wallet': 'docs/fuels-wallet/packages/docs/docs',
  'docs/fuel-graphql-docs': 'docs/fuel-graphql-docs/docs',
  'docs/guides': 'docs/guides/docs',
};

export class DocParser {
  static getIncludePaths() {
    return [
      'docs/sway',
      'docs/fuelup',
      'docs/fuels-rs',
      'docs/fuels-ts',
      'docs/fuel-indexer',
      'docs/fuel-specs',
      'docs/fuel-graphql-docs/docs',
      'docs/fuels-wallet/packages/docs/docs',
      'docs/guides',
    ];
  }

  static getDir(path: string) {
    const opts = { onlyDirectories: true };
    return globbySync(
      [
        `docs/${path}`,
        `!docs/${path}/docs`,
        `!docs/${path}/README.md`,
        ...(path === 'fuels-ts' ? [`!docs/${path}/apps`] : []),
        ...(path === 'fuel-specs' ? [`!docs/${path}/src`] : []),
        ...(path === 'fuels-wallet'
          ? [`!docs/${path}/packages/docs/docs`]
          : []),
        ...(path === 'fuel-graphql-docs' ? [`!docs/${path}/docs`] : []),
      ],
      opts
    );
  }

  static getExcludePaths() {
    const swayDirs = DocParser.getDir('sway').concat([
      'docs/sway/docs/reference',
    ]);
    const fuelupDir = DocParser.getDir('fuelup');
    const fuelsRsDir = DocParser.getDir('fuels-rs');
    const fuelsTsDir = DocParser.getDir('fuels-ts');
    const fuelSpecs = DocParser.getDir('fuel-specs');
    const fuelIndexer = DocParser.getDir('fuel-indexer');
    const fuelWallet = DocParser.getDir('fuels-wallet');
    const fuelGraphqlDocs = DocParser.getDir('fuel-graphql-docs');
    const guides = DocParser.getDir('guides');

    const files = globbySync([
      '**/*.{json,yaml,yml}',
      '**/SUMMARY.md',
      '**/README.md',
      '**/CHANGELOG.md',
      '**/CONTRIBUTING.md',
      '**/PULL_REQUEST_TEMPLATE.md',
      '**/RELEASE_SCHEDULE.md',
      '!docs/sway/README.md',
      '!docs/fuelup/README.md',
      '!docs/fuels-rs/README.md',
      '!docs/fuels-ts/README.md',
      '!docs/fuels-ts/CHANGELOG.md',
      '!docs/fuel-specs/README.md',
      '!docs/fuel-indexer/docs/README.md',
      '!docs/fuels-wallet/README.md',
      '!docs/fuels-wallet/packages/sdk/CHANGELOG.md',
      '!docs/fuel-graphql-docs/README.md',
    ]);

    const dirs = [
      ...swayDirs,
      ...fuelupDir,
      ...fuelsRsDir,
      ...fuelsTsDir,
      ...fuelSpecs,
      ...fuelIndexer,
      ...fuelWallet,
      ...fuelGraphqlDocs,
      ...guides,
      ...files,
    ];

    return dirs;
  }

  static createSlug(path: string) {
    let slug = path;

    for (const [key, value] of Object.entries(PATHS_REPLACE_MAP)) {
      if (path.startsWith(key)) {
        slug = path.replace(value, key);
      }
    }

    // handling edges cases according legacy slugs structure
    if (slug.includes('docs/fuel-graphql-docs')) {
      slug = slug.replace('fuel-graphql-docs', 'graphql');
    }
    if (slug.startsWith('docs/fuel-')) {
      slug = slug.replace('/fuel-', '/');
    }
    if (slug.includes('fuels-wallet')) {
      slug = slug.replace('fuels-wallet', 'wallet');
    }
    if (slug.includes('sway/forc')) {
      slug = slug.replace('sway/', '');
    }
    if (slug === 'docs/forc') {
      slug = 'docs/forc/index';
    }
    if (slug.includes('/forc_client/')) {
      slug = slug.replace('/forc_client/', '/');
    }
    if (slug === 'docs/guides/quickstart') {
      slug = 'docs/guides/quickstart/index';
    }
    if (slug.startsWith('docs/guides/')) {
      slug = slug.replace('docs/guides/', 'guides/');
    }
    if (slug.startsWith('docs/fuels-ts/guide/')) {
      slug = slug.replace('docs/fuels-ts/guide/', 'docs/fuels-ts/');
    }

    slug = slug.replace('README', 'index');
    // TODO: Remove after fixed
    if (slug === 'docs/fuels-rs/contributing/contributing') {
      slug = 'docs/fuels-rs/contributing';
    }
    return slug;
  }
}
