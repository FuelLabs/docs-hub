import { join } from 'path';

export const DOCS_DIRECTORY = join(process.cwd(), './docs');
export const LATEST_DOCS_DIRECTORY = join(process.cwd(), './docs/latest');
export const FIELDS = ['title', 'slug', 'content', 'category'];

export type LinkObject = {
  name: string;
  link?: string;
  menu?: LinkObject[];
};

export const EXTERNAL_NAVIGATION_LINKS: LinkObject[] = [
  {
    name: 'Sway Std Lib',
    link: 'https://fuellabs.github.io/sway/master/std/',
  },
  {
    name: 'Sway Playground',
    link: 'https://sway-playground.org/',
  },
  {
    name: 'Example Applications',
    link: 'https://github.com/FuelLabs/sway-applications/',
  },
  {
    name: 'Sway Core',
    link: 'https://fuellabs.github.io/sway/master/core/',
  },
  {
    name: 'Faucet',
    link: 'https://faucet-beta-4.fuel.network/',
  },
];

// TODO: replace this
// this is only used the search component
export const NAVIGATION: LinkObject[] = [
  {
    name: 'Guides',
    link: '/guides',
  },
  {
    name: 'Sway',
    menu: [
      {
        name: 'Sway Language',
      },
      {
        name: 'Sway',
        link: '/docs/sway',
      },
      {
        name: 'Standard Library',
        link: 'https://fuellabs.github.io/sway/master/std/',
      },
      {
        name: 'Example Apps',
        link: 'https://github.com/FuelLabs/sway-applications/',
      },
      {
        name: 'Sway Core',
        link: 'https://fuellabs.github.io/sway/master/core/',
      },
      {
        name: 'Tooling',
      },
      {
        name: 'Fuelup',
        link: '/docs/fuelup',
      },
      {
        name: 'Forc',
        link: '/docs/forc',
      },
      {
        name: 'Indexer',
        link: '/docs/indexer/',
      },
      // {
      //   name: 'Fuel Nix',
      //   link: '/docs/nix/',
      // },
    ],
  },
  {
    name: 'SDKs',
    menu: [
      {
        name: 'Rust SDK',
        link: '/docs/fuels-rs',
      },
      {
        name: 'TypeScript SDK',
        link: '/docs/fuels-ts',
      },
      {
        name: 'Wallet',
        link: '/docs/wallet/install/',
      },
    ],
  },
  {
    name: 'Network',
    menu: [
      // {
      //   name: 'About Fuel',
      //   link: '/docs/about-fuel/',
      // },
      {
        name: 'GraphQL API',
        link: '/docs/graphql/overview/',
      },
      {
        name: 'Specs',
        link: '/docs/specs',
      },
      {
        name: 'Explorer',
        link: 'https://fuellabs.github.io/block-explorer-v2/',
      },
      {
        name: 'Faucet',
        link: 'https://faucet-beta-4.fuel.network/',
      },
    ],
  },
];

export const DEFAULT_THEME = 'light';
