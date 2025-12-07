"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const { selectedYear, setSelectedYear } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i); // [2024, 2025, 2026, 2027, 2028] 

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { name: 'Reisen', href: '/trips', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { name: 'Mittel', href: '/equipment', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    )},
    { name: 'Optionen', href: '/settings', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/trips')) return 'Fahrtenbuch';
    if (pathname.startsWith('/equipment')) return 'Arbeitsmittel';
    if (pathname.startsWith('/expenses')) return 'Ausgaben';
    if (pathname.startsWith('/settings')) return 'Einstellungen';
    return '';
  };

  // Scroll to top instantly on navigation to avoid leftover scroll positions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try all targets to ensure we really jump to top on mobile
      const scrollTopNow = () => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };
      // Run immediately and once after paint to catch late layout shifts
      scrollTopNow();
      requestAnimationFrame(scrollTopNow);
    }
  }, [pathname]);

  return (
    <>
      {/* Top Bar: Page Title + Year Selector */}
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        <div className="container-custom flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {getPageTitle()}
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-foreground font-medium transition-all duration-200 border border-border/50 group active:scale-95"
              >
                <span className="text-xs uppercase tracking-wider text-muted-foreground group-hover:text-primary/80 transition-colors hidden sm:inline">Steuerjahr</span>
                <span className="text-base font-bold text-primary">{selectedYear}</span>
                <svg 
                  className={`w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 15l-6-6-6 6" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-100 z-50">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 text-base transition-colors flex items-center justify-between
                        ${selectedYear === year 
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-foreground/80 hover:bg-secondary'
                        }`}
                    >
                      {year}
                      {selectedYear === year && (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Bottom Navigation - Always visible for Tablet App feel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] overflow-visible">
        <div className="flex justify-around items-center h-20 px-6 max-w-md mx-auto relative">
          {/* Dashboard */}
          <Link 
            href="/"
            className={`flex flex-col items-center justify-center space-y-1 active:scale-90 transition-all duration-200 group ${
              pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all duration-300 ${pathname === '/' ? 'bg-primary/15 -translate-y-0.5' : 'group-hover:bg-secondary/50'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          {/* Expenses */}
          <Link 
            href="/expenses"
            className={`flex flex-col items-center justify-center space-y-1 active:scale-90 transition-all duration-200 group ${
              pathname.startsWith('/expenses') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all duration-300 ${pathname.startsWith('/expenses') ? 'bg-primary/15 -translate-y-0.5' : 'group-hover:bg-secondary/50'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium">Ausgaben</span>
          </Link>

          {/* Trips - Main Highlight */}
          <Link 
            href="/trips"
            className="relative -top-6 group flex flex-col items-center"
          >
            <div className={`flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
              pathname.startsWith('/trips') 
                ? 'bg-primary text-primary-foreground scale-105 ring-4 ring-background' 
                : 'bg-primary text-primary-foreground ring-4 ring-background hover:bg-primary/90'
            }`}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className={`text-[10px] font-medium mt-1 ${
              pathname.startsWith('/trips') ? 'text-primary' : 'text-muted-foreground'
            }`}>Fahrten</span>
          </Link>

          {/* Equipment */}
          <Link 
            href="/equipment"
            className={`flex flex-col items-center justify-center space-y-1 active:scale-90 transition-all duration-200 group ${
              pathname.startsWith('/equipment') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all duration-300 ${pathname.startsWith('/equipment') ? 'bg-primary/15 -translate-y-0.5' : 'group-hover:bg-secondary/50'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium">Mittel</span>
          </Link>

          {/* Settings */}
          <Link 
            href="/settings"
            className={`flex flex-col items-center justify-center space-y-1 active:scale-90 transition-all duration-200 group ${
              pathname.startsWith('/settings') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`p-2 rounded-2xl transition-all duration-300 ${pathname.startsWith('/settings') ? 'bg-primary/15 -translate-y-0.5' : 'group-hover:bg-secondary/50'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium">Optionen</span>
          </Link>
        </div>
      </div>
      
   
    </>
  );
}
