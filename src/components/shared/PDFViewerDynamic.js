'use client';

import dynamic from 'next/dynamic';

// Dynamically import PDFViewer with SSR disabled to prevent DOMMatrix errors during build
const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  ),
});

export default PDFViewer;
