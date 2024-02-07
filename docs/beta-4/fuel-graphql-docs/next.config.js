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
  typescript: {
    ignoreBuildErrors: true,
  },
  ...(HAS_LINK_DEPS ? depsLinkOpts : {}),
};

module.exports = nextConfig;
