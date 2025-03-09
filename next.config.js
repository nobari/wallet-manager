const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_BITCOIN_NETWORK: process.env.NEXT_PUBLIC_BITCOIN_NETWORK,
    NEXT_PUBLIC_BLOCKCHAIN_API_URL: process.env.NEXT_PUBLIC_BLOCKCHAIN_API_URL
  },
  // Other Next.js configuration options
  reactStrictMode: true,
  swcMinify: true,
  // Vercel specific configuration
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  }
};

module.exports = withNextIntl(nextConfig);
