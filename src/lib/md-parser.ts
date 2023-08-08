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
    return slug;
  }
}
