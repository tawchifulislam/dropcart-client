import type { Metadata } from 'next';
import { Anek_Bangla } from 'next/font/google';
import { SiteHeader } from '@/components/SiteHeader';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';

const anek = Anek_Bangla({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-anek',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DropCart',
  description: 'Limited drops. Every unit counted.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={anek.variable}>
      <body className="bg-canvas text-ink min-h-dvh antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
