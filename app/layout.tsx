import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "映言｜把文字变成看得懂的图",
  description: "使用 AI 将文字转化为有出处、可编辑的视觉表达。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
