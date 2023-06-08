/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  basePath: process.env.DOCS_BASE_URL || '',
  experimental: {
    esmExternals: false,
    externalDir: true,
  },
  trailingSlash: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // temp to ignore submodule import errors
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
