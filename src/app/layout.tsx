import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Events Amsterdam',
  description: 'AI-related events happening in Amsterdam, continuously updated by intelligent agents',
  keywords: ['AI', 'Amsterdam', 'Events', 'Machine Learning', 'Artificial Intelligence'],
  openGraph: {
    title: 'AI Events Amsterdam',
    description: 'AI-related events happening in Amsterdam, continuously updated by intelligent agents',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}