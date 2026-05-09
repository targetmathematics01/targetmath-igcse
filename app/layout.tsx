import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TargetMath IGCSE",
  description: "Online video course with sample and premium lessons",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
