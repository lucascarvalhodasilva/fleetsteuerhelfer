"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 pb-[env(safe-area-inset-bottom)] px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.08)] overflow-visible">
      <div className="flex justify-around items-center h-20 px-6 max-w-md mx-auto relative">
        {/* Dashboard */}
        <Link 
          href="/"
          className={`flex flex-col items-center justify-center space-y-1 active:scale-90 transition-all duration-200 group ${
            pathname === '/' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <div className={`p-2 rounded-2xl transition-all duration-300 ${pathname === '/' ? 'bg-blue-50 -translate-y-0.5' : 'group-hover:bg-gray-100'}`}>
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
            pathname.startsWith('/expenses') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <div className={`p-2 rounded-2xl transition-all duration-300 ${pathname.startsWith('/expenses') ? 'bg-blue-50 -translate-y-0.5' : 'group-hover:bg-gray-100'}`}>
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
              ? 'bg-blue-600 text-white scale-105 ring-4 ring-white' 
              : 'bg-blue-600 text-white ring-4 ring-white hover:bg-blue-700'
          }`}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className={`text-[10px] font-medium mt-1 ${
            pathname.startsWith('/trips') ? 'text-blue-600' : 'text-gray-400'
          }`}>Fahrten</span>
        </Link>

        {/* Equipment */}
        <Link 
          href="/equipment"
          className={`flex flex-col items-center justify-center space-y-1 active:scale-90 transition-all duration-200 group ${
            pathname.startsWith('/equipment') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <div className={`p-2 rounded-2xl transition-all duration-300 ${pathname.startsWith('/equipment') ? 'bg-blue-50 -translate-y-0.5' : 'group-hover:bg-gray-100'}`}>
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
            pathname.startsWith('/settings') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <div className={`p-2 rounded-2xl transition-all duration-300 ${pathname.startsWith('/settings') ? 'bg-blue-50 -translate-y-0.5' : 'group-hover:bg-gray-100'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-[10px] font-medium">Optionen</span>
        </Link>
      </div>
    </nav>
  );
}
