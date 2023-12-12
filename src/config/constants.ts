import { join } from 'path';

export const DOCS_DIRECTORY = join(process.cwd(), './docs');
export const LATEST_DOCS_DIRECTORY = join(process.cwd(), './docs/latest');
export const FIELDS = ['title', 'slug', 'content', 'category'];

export const FUEL_TESTNET = 'beta-4';
export const FUEL_TESTNET_UPPER_CASE = 'Beta-4';
export const FUEL_TESTNET_SNAKE_CASE = "beta_4"
export const FAUCET_LINK = `https://faucet-${FUEL_TESTNET}.fuel.network/`;
export const LW3_FAUCET_LINK = `https://learnweb3.io/faucets/fuel_${FUEL_TESTNET_SNAKE_CASE}`;
export const THIRDPARTY_FAUCET_LINKS = [LW3_FAUCET_LINK];
export const PLAYGROUND_LINK = `https://${FUEL_TESTNET}.fuel.network/playground/`;
export const EXPLORER_LINK = 'https://fuellabs.github.io/block-explorer-v2/';
export const BRIDGE_LINK = 'https://alpha.fuel.network/bridge';

export type LinkObject = {
  name: string;
  link: string;
  menu?: LinkObject[];
};

export const EXTERNAL_NAVIGATION_LINKS: LinkObject[] = [
  {
    name: 'Sway Std Lib',
    link: 'https://fuellabs.github.io/sway/master/std/',
  },
  {
    name: 'Sway Core',
    link: 'https://fuellabs.github.io/sway/master/core/',
  },
  {
    name: 'Example Applications',
    link: 'https://github.com/FuelLabs/sway-applications/',
  },
  {
    name: 'Sway Playground',
    link: 'https://sway-playground.org/',
  },
  {
    name: 'Faucet',
    link: 'https://faucet-beta-4.fuel.network/',
  },
  {
    name: "LearnWeb3 Faucet",
    link: LW3_FAUCET_LINK,
  }
];

// TODO: replace this
// this is only used the search component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NAVIGATION: any[] = [
  {
    name: 'Guides',
    link: '/guides',
  },
  {
    name: 'Intro',
    link: '/docs/intro',
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
        name: 'Sway Playground',
        link: 'https://sway-playground.org',
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
        link: EXPLORER_LINK,
      },
      {
        name: 'Faucet',
        link: FAUCET_LINK,
      },
      {
        name: 'Bridge',
        link: BRIDGE_LINK,
      },
    ],
  },
];

export const DEFAULT_THEME = 'light';
