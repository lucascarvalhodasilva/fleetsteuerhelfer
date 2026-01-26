import { Geist, Geist_Mono } from "next/font/google";
import "./main.css";
import LayoutClient from "@/components/LayoutClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fleet-Steuer",
  description: "Fleet-Steuer – App zur Erfassung von steuerlichen Ausgaben",
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background h-full pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] flex flex-col overflow-hidden`}
      >
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
