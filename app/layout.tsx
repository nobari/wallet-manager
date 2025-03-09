import './globals.css';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Bitcoin Wallet Manager',
  description: 'A modern, secure, and user-friendly Bitcoin wallet application'
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
