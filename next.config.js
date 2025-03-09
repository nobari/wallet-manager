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
  },
  // Enable WebAssembly
  webpack: (config) => {
    // Enable both sync and async WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true
    };

    // Add rule for WebAssembly files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async'
    });

    return config;
  }
};

module.exports = withNextIntl(nextConfig);
