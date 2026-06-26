import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AppProvider } from "@/contexts/AppContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubscriptionBanner } from "@/components/employer/SubscriptionBanner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "TaskForge — Forge real skills. Prove your work. Get hired.",
  description: "Turn completed dev work into verifiable proof that leads to real jobs and income.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <AppProvider>
          <Header />
          <SubscriptionBanner />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster theme="dark" position="bottom-right" richColors />
        </AppProvider>
      </body>
    </html>
  );
}