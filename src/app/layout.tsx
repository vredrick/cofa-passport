import type { Metadata, Viewport } from 'next';
import { Public_Sans } from 'next/font/google';
import './globals.css';

const publicSans = Public_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FSM Passport Application — Form 500B',
  description: 'Digital assistant for completing the Federated States of Micronesia passport application form.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className={publicSans.className}>{children}</body>
    </html>
  );
}
