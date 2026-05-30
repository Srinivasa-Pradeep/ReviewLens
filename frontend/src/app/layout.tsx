import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReviewLens | Premium AI Review Analytics",
  description: "Turn thousands of customer reviews into actionable buying decisions and business improvements in seconds.",
  keywords: ["review analysis", "sentiment analysis", "e-commerce dashboard", "customer voice", "buyer verdict", "competitor gap analysis"],
  authors: [{ name: "ReviewLens Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased flex flex-col`}>
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Muted Premium Footer */}
        <footer className="border-t border-white/[0.06] py-6 bg-black">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-neutral-500 font-mono">
            &copy; {new Date().getFullYear()} ReviewLens. Made for buyers and sellers. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
