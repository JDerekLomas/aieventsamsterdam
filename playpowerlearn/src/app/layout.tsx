import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'PlayPowerLearn - AI-Powered Educational Games',
  description: 'Gamified learning platform with AI-generated activities aligned to Common Core standards. By Play Power Labs.',
  keywords: ['education', 'learning', 'games', 'common core', 'AI', 'gamification'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {children}
      </body>
    </html>
  );
}
