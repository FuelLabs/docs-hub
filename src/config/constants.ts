import { join } from 'path';

export const DOCS_DIRECTORY = join(process.cwd(), './docs');
export const LATEST_DOCS_DIRECTORY = join(process.cwd(), './docs/latest');
export const FIELDS = ['title', 'slug', 'content', 'category'];

export const FUEL_TESTNET = 'beta-4';
export const FUEL_TESTNET_UPPER_CASE = 'Beta-4';
export const FAUCET_LINK = `https://faucet-${FUEL_TESTNET}.fuel.network/`;
export const PLAYGROUND_LINK = `https://${FUEL_TESTNET}.fuel.network/playground/`;

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
  // | 'nix'
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
  '/forc/commands/',
  '/forc/plugins/',
  '/indexer/forc-index/',
  '/indexer/forc-postgres/',
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
        name: 'Sway Playground',
        type: 'external-link',
        link: 'https://sway-playground.org',
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
        name: 'Sway Standards',
        type: 'external-link',
        link: 'https://github.com/FuelLabs/sway-standards/',
      },
      {
        name: 'Sway Libraries',
        type: 'external-link',
        link: 'https://github.com/FuelLabs/sway-libs/',
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
      // {
      //   name: 'Fuel Nix',
      //   type: 'internal-link',
      //   link: '/docs/nix/',
      //   slug: 'nix',
      // },
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
        name: 'Explorer',
        type: 'external-link',
        link: 'https://fuellabs.github.io/block-explorer-v2/',
      },
      {
        name: 'Faucet',
        type: 'external-link',
        link: FAUCET_LINK,
      },
      {
        name: 'Bridge',
        type: 'external-link',
        link: 'https://alpha.fuel.network/bridge/',
      },
    ],
  },
];

export const DEFAULT_THEME = 'light';
