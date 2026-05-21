import type { Metadata, Viewport } from "next";
import { Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import { Navigation } from "@/components/layout/Navigation";
import { FloatingHearts } from "@/components/effects/FloatingHearts";
import { InitialLoadingOverlay } from "@/components/effects/InitialLoadingOverlay";
import { MusicPlayer } from "@/components/effects/MusicPlayer";
import { RegisterSW } from "@/components/effects/RegisterSW";
import { Toaster } from "sonner";
import "./globals.css";

const serif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "我们的故事",
  description: "乃斯 & 晨曦 的爱情小世界",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "我们的故事",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff6b4a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-cream font-sans">
        <FloatingHearts />
        <main className="pb-20">{children}</main>
        <InitialLoadingOverlay />
        <Navigation />
        <MusicPlayer />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#fff7f5",
              border: "1px solid #ffd5cc",
              color: "#44403c",
              borderRadius: "12px",
            },
          }}
        />
        <RegisterSW />
      </body>
    </html>
  );
}
