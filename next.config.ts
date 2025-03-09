import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
  // Environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_BITCOIN_NETWORK: process.env.NEXT_PUBLIC_BITCOIN_NETWORK,
    NEXT_PUBLIC_BLOCKCHAIN_API_URL: process.env.NEXT_PUBLIC_BLOCKCHAIN_API_URL
  },
  // Other Next.js configuration options
  reactStrictMode: true,
  swcMinify: true
};

export default withNextIntl(config);
