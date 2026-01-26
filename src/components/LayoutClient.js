"use client";
import { AppProvider } from "@/context/AppContext";
import { UIProvider } from "@/context/UIContext";
import Header from "@/components/ui/Header";
import BottomTabBar from "@/components/ui/BottomTabBar";
import BackButtonHandler from "@/components/BackButtonHandler";

export default function LayoutClient({ children }) {
  return (
    <AppProvider>
      <UIProvider>
        <BackButtonHandler />
        <Header />
        <main className="flex-1 min-h-0 w-full max-w-4xl mx-auto overflow-y-auto">
          {children}
        </main>
        <BottomTabBar />
      </UIProvider>
    </AppProvider>
  );
}
