'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.DEFAULT_THEME =
  exports.NAVIGATION =
  exports.EXTERNAL_NAVIGATION_LINKS =
  exports.BRIDGE_LINK =
  exports.BETA_4_EXPLORER_LINK =
  exports.EXPLORER_LINK =
  exports.BETA_4_PLAYGROUND_LINK =
  exports.PLAYGROUND_LINK =
  exports.BETA_4_FAUCET_LINK =
  exports.FAUCET_LINK =
  exports.FUEL_TESTNET_UPPER_CASE =
  exports.FUEL_TESTNET =
  exports.FIELDS =
  exports.BETA_4_DOCS_DIRECTORY =
  exports.NIGHTLY_DOCS_DIRECTORY =
  exports.DOCS_DIRECTORY =
    void 0;
var path_1 = require('path');
exports.DOCS_DIRECTORY = (0, path_1.join)(process.cwd(), './docs');
exports.NIGHTLY_DOCS_DIRECTORY = (0, path_1.join)(
  process.cwd(),
  './docs/nightly'
);
exports.BETA_4_DOCS_DIRECTORY = (0, path_1.join)(
  process.cwd(),
  './docs/beta-4'
);
exports.FIELDS = ['title', 'slug', 'content', 'category'];
exports.FUEL_TESTNET = 'beta-5';
exports.FUEL_TESTNET_UPPER_CASE = 'Beta-5';
exports.FAUCET_LINK = 'https://faucet-'.concat(
  exports.FUEL_TESTNET,
  '.fuel.network/'
);
exports.BETA_4_FAUCET_LINK = 'https://faucet-beta-4.fuel.network/';
exports.PLAYGROUND_LINK = 'https://'.concat(
  exports.FUEL_TESTNET,
  '.fuel.network/playground/'
);
exports.BETA_4_PLAYGROUND_LINK = 'https://beta-4.fuel.network/playground/';
exports.EXPLORER_LINK = 'https://next-app.fuel.network/';
exports.BETA_4_EXPLORER_LINK =
  'https://fuellabs.github.io/block-explorer-v2/beta-4/';
exports.BRIDGE_LINK = 'https://next-app.fuel.network/bridge';
exports.EXTERNAL_NAVIGATION_LINKS = [
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
    link: 'https://faucet-beta-5.fuel.network/',
  },
  {
    name: 'Contributing',
    link: '/docs/contributing',
  },
];
// TODO: replace this
// this is only used the search component
// biome-ignore lint/suspicious/noExplicitAny:
exports.NAVIGATION = [
  {
    name: 'Guides',
    link: '/guides',
  },
  {
    name: 'Intro',
    link: '/docs/intro',
  },
  {
    name: 'Fuel 101',
    link: '/docs/fuel-101',
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
        name: 'Forc',
        link: '/docs/forc',
      },
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
        name: 'Specifications',
        link: '/docs/specs',
      },
      {
        name: 'Explorer',
        link: exports.EXPLORER_LINK,
      },
      {
        name: 'Faucet',
        link: exports.FAUCET_LINK,
      },
      {
        name: 'Bridge',
        link: exports.BRIDGE_LINK,
      },
    ],
  },
];
exports.DEFAULT_THEME = 'light';
