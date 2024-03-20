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
        source: '/docs/',
        destination: '/',
        permanent: true,
      },
      {
        source: '/docs/wallet/',
        destination: '/docs/wallet/install/',
        permanent: true,
      },
      {
        source: '/docs/nightly/wallet/',
        destination: '/docs/nightly/wallet/install/',
        permanent: true,
      },
      {
        source: '/docs/beta-4/wallet/',
        destination: '/docs/beta-4/wallet/install/',
        permanent: true,
      },
      {
        source: '/docs/graphql/',
        destination: '/docs/graphql/overview/',
        permanent: true,
      },
      {
        source: '/docs/nightly/graphql/',
        destination: '/docs/nightly/graphql/overview/',
        permanent: true,
      },
      {
        source: '/docs/beta-4/graphql/',
        destination: '/docs/beta-4/graphql/overview/',
        permanent: true,
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
        permanent: true,
      },
      {
        source: '/docs/wallet/contributing/',
        destination: '/docs/wallet/contributing/running-locally/',
        permanent: true,
      },
      {
        source: '/docs/wallet/dev/',
        destination: '/docs/wallet/dev/getting-started/',
        permanent: true,
      },
      {
        source: '/guides/running-a-node/running-a-beta-4-node/',
        destination: '/guides/running-a-node/running-a-testnet-node/',
        permanent: true,
      },
      {
        source: '/docs/fuelup/:slug*',
        destination: 'https://install.fuel.network/master/:slug*',
        permanent: true,
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
