import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/footer"; // Footer import
import { Analytics } from '@vercel/analytics/react';

// Font configs (Keep as is)
const supreme = localFont({
  src: "./fonts/Supreme-Variable.woff2",
  variable: "--font-supreme",
  weight: "100 900",
});

const chubbo = localFont({
  src: "./fonts/Chubbo-Variable.woff2",
  variable: "--font-chubbo",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Hiret - Hiring Market",
  description: "Job Market & JD Analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // FIX: 'suppressHydrationWarning' ikkada <html> tag ki add chesam
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${supreme.variable} ${chubbo.variable} antialiased`}
        suppressHydrationWarning // Body ki kuda unchu, safe side
      >
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}