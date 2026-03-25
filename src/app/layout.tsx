import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1-Web",
  description: "포뮬러 원 데이터 플랫폼 프론트엔드 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <header>Header 영역</header>

        <main>{children}</main>

        <footer>Footer 영역</footer>
      </body>
    </html>
  );
}