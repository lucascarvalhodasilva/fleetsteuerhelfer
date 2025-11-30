"use client";
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function Navbar() {
  const { selectedYear, setSelectedYear } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const years = [2024, 2025, 2026]; // Example years, could be dynamic

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

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors">
            Fleet-Steuer
          </Link>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10 text-foreground font-medium transition-all duration-200 border border-primary/10 group"
            >
              <span className="text-xs uppercase tracking-wider text-muted-foreground group-hover:text-primary/80 transition-colors">Jahr</span>
              <span className="text-sm font-bold text-primary">{selectedYear}</span>
              <svg 
                className={`w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100 z-50">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                      ${selectedYear === year 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'text-foreground/80 hover:bg-primary/5 hover:text-primary'
                      }`}
                  >
                    {year}
                    {selectedYear === year && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6 text-sm font-medium">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          <Link href="/meals" className="text-muted-foreground hover:text-foreground transition-colors">Werbungskosten</Link>
          <Link href="/equipment" className="text-muted-foreground hover:text-foreground transition-colors">Arbeitsmittel</Link>
          <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors">Einstellungen</Link>
        </div>
      </div>
    </nav>
  );
}
