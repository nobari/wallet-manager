import {z} from 'zod';

// Define schema for environment variables
const envSchema = z.object({
  // Bitcoin network configuration
  NEXT_PUBLIC_BITCOIN_NETWORK: z
    .enum(['mainnet', 'testnet'])
    .default('testnet'),
  NEXT_PUBLIC_BLOCKCHAIN_API_URL: z
    .string()
    .url()
    .optional()
    .default('https://blockstream.info/testnet/api'),
  NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL: z
    .string()
    .url()
    .optional()
    .default('https://blockstream.info/testnet'),

  // Server configuration
  PORT: z.string().optional().default('3000'),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional()
});

// Process environment variables
const processEnv = {
  NEXT_PUBLIC_BITCOIN_NETWORK: process.env.NEXT_PUBLIC_BITCOIN_NETWORK,
  NEXT_PUBLIC_BLOCKCHAIN_API_URL: process.env.NEXT_PUBLIC_BLOCKCHAIN_API_URL,
  NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL:
    process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL,
  PORT: process.env.PORT,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL
};

// Parse and validate environment variables
export const env = envSchema.parse(processEnv);

// Derived configuration
export const port = env.PORT;
export const host = env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${port}`;

// Bitcoin network configuration
export const bitcoinNetwork = env.NEXT_PUBLIC_BITCOIN_NETWORK;
export const blockchainApiUrl = env.NEXT_PUBLIC_BLOCKCHAIN_API_URL;
export const blockchainExplorerUrl = env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL;
