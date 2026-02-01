import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "台北音樂地圖 | Taipei Music Map",
  description: "探索台北最精緻的音樂場所：Live House、Jazz Bar、黑膠唱片行與獨立音樂空間。透過互動地圖尋找您的下一場音樂饗宴。",
  keywords: ["台北", "音樂", "Live House", "Jazz", "獨立音樂", "黑膠", "唱片行", "音樂地圖", "Taipei"],
  authors: [{ name: "Taipei Music Map" }],
  creator: "Taipei Music Map",
  publisher: "Taipei Music Map",
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "台北音樂地圖 | 探索城市音樂生活",
    description: "探索台北最精緻的音樂場所：Live House、Jazz Bar、黑膠唱片行與獨立音樂空間。",
    siteName: '台北音樂地圖',
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '台北音樂地圖 | Taipei Music Map',
    description: '探索台北最精緻的音樂場所',
  },
  icons: {
    icon: '/icon',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#4A5D4E',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={`${notoSansTC.variable} antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
