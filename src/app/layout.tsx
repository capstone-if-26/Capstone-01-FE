import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Content Creator",
  description: "Generate AI video promosi pendidikan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}