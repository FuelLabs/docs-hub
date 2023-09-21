import { join } from 'path';

export const DOCS_DIRECTORY = join(process.cwd(), './docs');
export const FIELDS = ['title', 'slug', 'content', 'category'];

export type Tabs =
  | 'home'
  | 'guides'
  | 'sway'
  | 'fuels-rs'
  | 'fuels-ts'
  | 'wallet'
  | 'graphql'
  | 'fuelup'
  | 'indexer'
  | 'specs'
  // | 'about-fuel'
  | 'forc';

export type LinkType = 'menu' | 'internal-link' | 'external-link' | 'category';

export type LinkObject = {
  name: string;
  type: LinkType;
  link?: string;
  category?: string;
  categories?: string[];
  menu?: LinkObject[];
  slug?: Tabs;
};

// doc slugs that start with a path in this array
// won't be capitalized in the navigation sidebar
export const LOWER_CASE_NAV_PATHS = [
  'docs/forc/commands/',
  'docs/forc/plugins/',
  'docs/indexer/forc-index/',
  'docs/indexer/forc-postgres/',
];

export const NAVIGATION: LinkObject[] = [
  {
    name: 'Guides',
    type: 'internal-link',
    link: '/guides',
    slug: 'guides',
  },
  {
    name: 'Sway',
    type: 'menu',
    categories: ['Tooling', 'Sway Language'],
    menu: [
      {
        name: 'Sway Language',
        type: 'category',
      },
      {
        name: 'Sway',
        type: 'internal-link',
        link: '/docs/sway',
        slug: 'sway',
      },
      {
        name: 'Standard Library',
        type: 'external-link',
        link: 'https://fuellabs.github.io/sway/master/std/',
      },
      {
        name: 'Example Apps',
        type: 'external-link',
        link: 'https://github.com/FuelLabs/sway-applications/',
      },
      {
        name: 'Sway Core',
        type: 'external-link',
        link: 'https://fuellabs.github.io/sway/master/core/',
      },
      {
        name: 'Tooling',
        type: 'category',
      },
      {
        name: 'Fuelup',
        type: 'internal-link',
        link: '/docs/fuelup',
        slug: 'fuelup',
      },
      {
        name: 'Forc',
        type: 'internal-link',
        link: '/docs/forc',
        slug: 'forc',
      },
      {
        name: 'Indexer',
        type: 'internal-link',
        link: '/docs/indexer/',
        slug: 'indexer',
      },
    ],
  },
  {
    name: 'SDKs',
    type: 'menu',
    menu: [
      {
        name: 'Rust SDK',
        type: 'internal-link',
        link: '/docs/fuels-rs',
        slug: 'fuels-rs',
      },
      {
        name: 'TypeScript SDK',
        type: 'internal-link',
        link: '/docs/fuels-ts',
        slug: 'fuels-ts',
      },
      {
        name: 'Wallet',
        type: 'internal-link',
        link: '/docs/wallet/install/',
        slug: 'wallet',
      },
    ],
  },
  {
    name: 'Network',
    type: 'menu',
    menu: [
      // {
      //   name: 'About Fuel',
      //   type: 'internal-link',
      //   link: '/docs/about-fuel/',
      //   slug: 'about-fuel',
      // },
      {
        name: 'GraphQL API',
        type: 'internal-link',
        link: '/docs/graphql/overview/',
        slug: 'graphql',
      },
      {
        name: 'Specs',
        type: 'internal-link',
        link: '/docs/specs',
        slug: 'specs',
      },
      {
        name: 'Faucet',
        type: 'external-link',
        link: 'https://faucet-beta-4.fuel.network/',
      },
    ],
  },
];

export const DEFAULT_THEME = 'light';
