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
    esmExternals: true,
    externalDir: true,
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
        source: '/docs/graphql/',
        destination: '/docs/graphql/overview/',
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
