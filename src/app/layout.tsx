import type { Metadata } from 'next';
import { Anek_Bangla } from 'next/font/google';
import { MotionProvider } from '@/components/MotionProvider';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import './globals.css';
import { SITE_URL } from '@/lib/site';
import { AuthProvider } from '@/components/AuthProvider';

const anek = Anek_Bangla({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-anek',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'DropCart', template: '%s | DropCart' },
  description: 'Limited drops. Every unit counted.',
  openGraph: { siteName: 'DropCart', type: 'website' },
};

const themeScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anek.variable} scroll-pt-20 motion-safe:scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-canvas text-ink flex min-h-dvh flex-col antialiased">
        <MotionProvider>
          <AuthProvider>
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </AuthProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
