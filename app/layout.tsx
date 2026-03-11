import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "일일업무일지 편집기",
  description: "일일 업무 일지를 작성하고 HTML로 내보내는 편집기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-noto">{children}</body>
    </html>
  );
}
