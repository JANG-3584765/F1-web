import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
})
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import ScrollToTopButton from '@/components/ScrollToTopButton'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
  title: 'WhatisF1',
  description: '포뮬러 원 정보 플랫폼 사이트',
  openGraph: {
    type:        'website',
    siteName:    'WhatisF1',
    title:       'WhatisF1',
    description: '포뮬러 원 정보 플랫폼 사이트',
    images: [{
      url:    '/images/common/logo.png',
      alt:    'WhatisF1',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'WhatisF1',
    description: '포뮬러 원 정보 플랫폼 사이트',
    images:      ['/images/common/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={pretendard.variable}>
      <head>
        <script dangerouslySetInnerHTML={{__html: `
          try {
            var t = localStorage.getItem('theme');
            var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (dark) document.documentElement.setAttribute('data-theme', 'dark');
          } catch(e) {}
        `}} />
      </head>
      <body className={pretendard.className}>
        <Providers>
          <div className="flex flex-col min-h-dvh">
            <Header />
            {children}
            <Footer />
          </div>
          <ScrollToTopButton />
        </Providers>
      </body>
    </html>
  )
}
