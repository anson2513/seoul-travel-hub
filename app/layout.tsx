import type { Metadata } from "next";
import SplashScreen from "@/components/splash/SplashScreen";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEOUL Travel Hub",
  description: "Personal Travel Companion for Seoul 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
