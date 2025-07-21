'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white/80 rounded-2xl shadow-xl p-8 md:p-16 flex flex-col items-center border border-blue-100">
        <div className="mb-6">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#3B82F6"/>
            <text x="32" y="40" textAnchor="middle" fontSize="32" fill="white" fontFamily="Arial, sans-serif">C</text>
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4 text-center">Clinikoop Çok Yakında!</h1>
        <p className="text-gray-600 text-lg mb-8 text-center max-w-md">
          Diş klinikleri için yeni nesil teklif ve hasta yönetim platformu yakında yayında! Takipte kalın.
        </p>
        <a
          href="mailto:info@clinikoop.com"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold"
        >
          İletişim: info@clinikoop.com
        </a>
      </div>
      <div className="mt-12 text-gray-400 text-sm">&copy; {new Date().getFullYear()} Clinikoop</div>
    </div>
  );
} 