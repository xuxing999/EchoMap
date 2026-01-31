import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "台北音樂地圖 | Taipei Music Map",
  description: "打造台北最精緻、最具文藝感的音樂生活導覽工具",
  keywords: ["台北", "音樂", "Live House", "Jazz", "獨立音樂", "黑膠"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
