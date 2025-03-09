# Bitcoin Wallet Manager

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Bitcoin](https://img.shields.io/badge/Bitcoin-Network-orange?style=flat&logo=bitcoin)](https://bitcoin.org/)

A modern, secure, and user-friendly Bitcoin wallet application built with cutting-edge web technologies. This enterprise-grade application enables users to create wallets, send transactions, and monitor their transaction history with a focus on security, performance, and user experience.

## 🚀 Key Features

- **Secure Wallet Management**: Create, import, and manage Bitcoin wallets with industry-standard security practices
- **Transaction Handling**: Send Bitcoin transactions with customizable fees and confirmation tracking
- **Transaction History**: View detailed transaction history with real-time updates
- **Multi-Network Support**: Seamlessly switch between Bitcoin mainnet and testnet
- **Internationalization**: Full i18n support with next-intl for a global user base
- **Dark/Light Mode**: Elegant theme switching with next-themes
- **Responsive Design**: Beautiful UI built with TailwindCSS and HeadlessUI components
- **Enterprise Architecture**: Implements SOLID principles with a feature-based architecture

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI**: React 19, TailwindCSS, HeadlessUI, Heroicons
- **State Management**: Zustand
- **Form Validation**: Zod
- **Bitcoin Libraries**: bitcoinjs-lib, bip32, bip39, tiny-secp256k1
- **Testing**: Jest, React Testing Library, Playwright
- **Internationalization**: next-intl
- **Theming**: next-themes
- **Notifications**: react-hot-toast
- **HTTP Client**: Axios

## 🏗️ Architecture

This project follows a feature-based architecture with strict adherence to SOLID principles, ensuring maintainability, scalability, and testability.

### Component Organization

```
app/
├── features/
│   ├── theme/               # Theme management
│   ├── locale/              # Internationalization
│   ├── navigation/          # Navigation components
│   ├── layout/              # Layout components
│   ├── wallet-management/   # Wallet creation/import
│   └── wallet-detail/       # Transaction history and details
└── components/              # Shared components
```

### SOLID Implementation

- **Single Responsibility**: Each component and module has a clearly defined, singular purpose
- **Open/Closed**: Architecture designed for extension without modification
- **Liskov Substitution**: Components are interchangeable with their subtypes
- **Interface Segregation**: Clean, focused interfaces prevent dependency bloat
- **Dependency Inversion**: High-level modules depend on abstractions, not implementations

## 🚦 Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- Yarn or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/bitcoin-wallet-manager.git
   cd bitcoin-wallet-manager
   ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Set up environment variables:

   ```bash
   # Copy the example environment file
   cp .env.example .env.local

   # Edit the .env.local file with your configuration
   ```

4. Start the development server:

   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## ⚙️ Environment Configuration

| Variable                         | Description                       | Example                                |
| -------------------------------- | --------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_BITCOIN_NETWORK`    | Bitcoin network (mainnet/testnet) | `testnet`                              |
| `NEXT_PUBLIC_BLOCKCHAIN_API_URL` | Blockchain API endpoint           | `https://blockstream.info/testnet/api` |

## 🧪 Testing

Comprehensive test suite using Jest, React Testing Library, and Playwright:

```bash
# Run unit and integration tests
yarn test

# Run end-to-end tests
yarn test:e2e
```

## 🚀 Deployment

This application is optimized for deployment on Vercel:

```bash
yarn build
```

## 🔒 Security Considerations

- Private keys are never stored on servers
- All cryptographic operations happen client-side
- Implements best practices for secure key management
- Regular security audits and dependency updates

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Bitcoin Developer Documentation](https://developer.bitcoin.org/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
