import { Geist, Geist_Mono } from "next/font/google";
import "./main.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/ui/Header";
import BottomTabBar from "@/components/ui/BottomTabBar";

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
        <AppProvider>
          <Header />
          <main className="flex-1 min-h-0 w-full max-w-4xl mx-auto overflow-y-auto">
            {children}
          </main>
          <BottomTabBar />
        </AppProvider>
      </body>
    </html>
  );
}
