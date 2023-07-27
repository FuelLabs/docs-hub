import { globbySync } from 'globby';
import type { MdDoc } from '~/.contentlayer/generated/types';

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

export class Docs {
  static getAllPaths(mdDocs: MdDoc[]) {
    const paths = mdDocs
      .map((doc) => {
        const path = doc.slug;
        let slug = path.split('/').filter((s) => s.length);

        if (slug.length === 1) {
          return null;
        }
        if (slug.slice(-1)[0] === 'index') {
          slug = slug.slice(0, -1);
        }

        return {
          params: {
            slug,
            path,
          },
        };
      })
      .filter(Boolean);

    return Array.from(new Set(paths));
  }

  static findDoc(slug: string[], mdDocs: MdDoc[]) {
    const path = slug.join('/');
    const item = mdDocs.find((doc) => {
      return (
        doc.slug === path ||
        doc.slug === `${path}/index` ||
        doc.slug === `${path}/`
      );
    });

    if (!item) {
      throw new Error(`${slug} not found`);
    }

    return item;
  }

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
    const swayDirs = Docs.getDir('sway').concat(['docs/sway/docs/reference']);
    const fuelupDir = Docs.getDir('fuelup');
    const fuelsRsDir = Docs.getDir('fuels-rs');
    const fuelsTsDir = Docs.getDir('fuels-ts');
    const fuelSpecs = Docs.getDir('fuel-specs');
    const fuelIndexer = Docs.getDir('fuel-indexer');
    const fuelWallet = Docs.getDir('fuels-wallet');
    const fuelGraphqlDocs = Docs.getDir('fuel-graphql-docs');
    const guides = Docs.getDir('guides');

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
      '!docs/fuel-specs/README.md',
      '!docs/fuel-indexer/README.md',
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
      slug = slug.replace('fuel-', '');
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

    slug = slug.replace('README', 'index');
    return slug;
  }
}
