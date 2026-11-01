import type { Metadata, Viewport } from 'next';
import { Anek_Bangla } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import { DemoBanner } from '@/components/DemoBanner';
import { MotionProvider } from '@/components/MotionProvider';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { ToastProvider } from '@/components/ToastProvider';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const anek = Anek_Bangla({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-anek',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'DropCart',
  title: {
    default: 'DropCart | Limited drops, every unit counted',
    template: '%s | DropCart',
  },
  description:
    'Products go on sale in scheduled, stock-limited drops. Reserve your unit, pay within five minutes, and shop with an AI copilot that only knows the real catalog.',
  openGraph: { siteName: 'DropCart', type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EEF0F7' },
    { media: '(prefers-color-scheme: dark)', color: '#0D0F26' },
  ],
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
        <a
          href="#content"
          className="focus:rounded-control focus:bg-brand focus:text-on-brand sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:px-4 focus:py-2 focus:font-bold"
        >
          Skip to content
        </a>
        <MotionProvider>
          <ToastProvider>
            <AuthProvider>
              <DemoBanner />
              <SiteHeader />
              <div id="content" tabIndex={-1} className="flex-1 outline-none">
                {children}
              </div>
              <SiteFooter />
            </AuthProvider>
          </ToastProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
