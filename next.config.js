const { withContentlayer } = require('next-contentlayer');
const path = require('path');

const HAS_LINK_DEPS = Boolean(
  (process.env.LINK_DEPS?.trim().split(' ').filter(Boolean) || []).length
);

const depsLinkOpts = {
  transpilePackages: [
    '@fuel-ui/react',
    '@fuel-ui/css',
    '@fuel-ui/icons',
    '@fuel-ui/tokens',
  ],
  webpack: (config, options) => {
    if (options.isServer) {
      config.externals = ['react', ...config.externals];
    }
    config.resolve.alias['react'] = path.resolve(
      __dirname,
      '.',
      'node_modules',
      'react'
    );

    return config;
  },
};

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: process.env.DOCS_BASE_URL || '',
  experimental: {
    esmExternals: false,
    externalDir: true,
    swcMinify: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/docs/intro/what-is-fuel/',
        permanent: false,
      },
      {
        source: '/docs/',
        destination: '/',
        permanent: false,
      },
      {
        source: '/docs/wallet/',
        destination: '/docs/wallet/install/',
        permanent: false,
      },
      {
        source: '/docs/nightly/wallet/',
        destination: '/docs/nightly/wallet/install/',
        permanent: false,
      },
      {
        source: '/docs/graphql/',
        destination: '/docs/graphql/overview/',
        permanent: false,
      },
      {
        source: '/docs/nightly/graphql/',
        destination: '/docs/nightly/graphql/overview/',
        permanent: false,
      },
      {
        source: '/guides/testnet-migration/',
        destination: '/guides/migration-guide/',
        permanent: true,
      },
      {
        source: '/guides/testnet-migration/beta-3-to-beta-4-migration/',
        destination: '/guides/migration-guide/testnet-migration/',
        permanent: true,
      },
      {
        source: '/docs/latest/:slug*',
        destination: '/docs/nightly/:slug*',
        permanent: true,
      },
      {
        source: '/guides/latest/:slug*',
        destination: '/guides/nightly/:slug*',
        permanent: true,
      },
      {
        source: '/docs/fuels-rs/contributing/',
        destination: '/docs/fuels-rs/contributing/contributing/',
        permanent: false,
      },
      {
        source: '/docs/wallet/contributing/',
        destination: '/docs/wallet/contributing/running-locally/',
        permanent: false,
      },
      {
        source: '/docs/wallet/dev/',
        destination: '/docs/wallet/dev/getting-started/',
        permanent: false,
      },
      {
        source: '/guides/running-a-node/running-a-beta-4-node/',
        destination: '/guides/running-a-node/running-a-testnet-node/',
        permanent: true,
      },
      {
        source: '/docs/fuelup/:slug*',
        destination: 'https://install.fuel.network/latest/',
        permanent: false,
      },
      {
        source: '/docs/intro/quickstart-contract/',
        destination: '/docs/intro/quickstart',
        permanent: false,
      },
      {
        source: '/docs/intro/quickstart-frontend/',
        destination: '/docs/intro/quickstart',
        permanent: false,
      },
      {
        source: '/guides/quickstart/',
        destination: '/docs/intro/quickstart',
        permanent: false,
      },
      {
        source: '/guides/quickstart/building-a-smart-contract/',
        destination: '/guides/counter-dapp/building-a-smart-contract/',
        permanent: false,
      },
      {
        source: '/guides/quickstart/building-a-frontend/',
        destination: '/guides/counter-dapp/building-a-frontend/',
        permanent: false,
      },
    ];
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // temp to ignore submodule import errors
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  ...(HAS_LINK_DEPS ? depsLinkOpts : {}),
};

module.exports = withContentlayer(nextConfig);
