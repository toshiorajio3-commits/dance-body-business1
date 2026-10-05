import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dance Match β | 自分に合うダンスの学び方を見つける",
  description:
    "ダンスに求める価値、習いたい内容、取り組み方、レッスン人数の希望から、自分に合いやすい先生・クラス・スクール環境を整理する研究知見ベースのβ版プロフィール。",
  applicationName: "Dance Match β",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Dance Match β",
    description: "自分に合うダンスの学び方・先生・スクール環境を整理するプロフィール",
    type: "website",
    locale: "ja_JP",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
