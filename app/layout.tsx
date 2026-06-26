import type { Metadata, Viewport } from "next";
import SplashScreen from "@/components/splash/SplashScreen";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "SEOUL Travel Hub",
  title: "SEOUL Travel Hub",
  description: "Personal Travel Companion for Seoul 2026.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "韓旅 Hub",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/images/app-icon-black-gold.png",
    apple: "/images/app-icon-black-gold.png",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F5F2",
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
