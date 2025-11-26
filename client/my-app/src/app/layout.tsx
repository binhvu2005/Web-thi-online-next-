import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/app/components/ui/Toast";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OnlineTest - Hệ thống thi trực tuyến",
  description: "Nền tảng thi trực tuyến hiện đại với giao diện thân thiện và tính năng đầy đủ",
  keywords: "thi trực tuyến, online test, exam, education",
  authors: [{ name: "OnlineTest Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="vi" className={inter.variable}>
        <body className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 font-sans antialiased">
          <ToastProvider>
            <div className="relative min-h-screen">
              {children}
            </div>
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
