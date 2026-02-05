import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Wrapilo Moments | Premium Gift Collection",
  description: "Curated premium gifts for every occasion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <CurrencyProvider>
          <WishlistProvider>
            <Header />
            <main className="flex-grow pt-[64px] md:pt-[160px]">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </WishlistProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
