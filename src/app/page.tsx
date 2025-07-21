'use client';

import Image from 'next/image';
import { useState } from 'react';

const SOCIALS = [
  { href: 'https://www.youtube.com/@Clinikoop', icon: 'youtube', label: 'YouTube' },
  { href: 'https://www.linkedin.com/company/clinikoop/', icon: 'linkedin', label: 'LinkedIn' },
  { href: 'https://tr.pinterest.com/clinikoop/', icon: 'pinterest', label: 'Pinterest' },
  { href: 'https://www.tiktok.com/@clinikoop', icon: 'tiktok', label: 'TikTok' },
  { href: 'https://x.com/Clinikoop', icon: 'twitter', label: 'X' },
  { href: 'https://www.instagram.com/clinikoop/', icon: 'instagram', label: 'Instagram' },
  { href: 'https://www.facebook.com/Clinikoop', icon: 'facebook', label: 'Facebook' },
];

function SocialIcon({ icon, label }: { icon: string; label: string }) {
  switch (icon) {
    case 'youtube':
      return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.11-2.116C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.388.57A2.994 2.994 0 0 0 .502 6.186C0 8.347 0 12 0 12s0 3.653.502 5.814a2.994 2.994 0 0 0 2.11 2.116C4.772 20.5 12 20.5 12 20.5s7.228 0 9.388-.57a2.994 2.994 0 0 0 2.11-2.116C24 15.653 24 12 24 12s0-3.653-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
    case 'linkedin':
      return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>;
    case 'pinterest':
      return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.388 7.627 11.093-.105-.943-.2-2.393.042-3.425.219-.963 1.41-6.137 1.41-6.137s-.36-.72-.36-1.782c0-1.67.968-2.918 2.172-2.918 1.025 0 1.52.77 1.52 1.693 0 1.032-.656 2.574-.995 4.01-.283 1.2.601 2.178 1.782 2.178 2.138 0 3.782-2.254 3.782-5.507 0-2.88-2.07-4.89-5.03-4.89-3.43 0-5.44 2.572-5.44 5.23 0 1.032.397 2.142.893 2.744.099.12.113.225.083.345-.09.36-.292 1.14-.332 1.297-.05.2-.16.242-.37.146-1.38-.64-2.24-2.65-2.24-4.27 0-3.48 2.94-7.65 8.77-7.65 4.69 0 7.77 3.39 7.77 7.03 0 4.82-2.68 8.42-6.65 8.42-1.33 0-2.58-.72-3.01-1.54l-.82 3.13c-.24.92-.72 2.07-1.08 2.77.81.25 1.67.39 2.57.39 6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>;
    case 'tiktok':
      return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.004 0c-6.627 0-12 5.373-12 12 0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm3.75 8.25c.414 0 .75.336.75.75v2.25c0 2.623-2.127 4.75-4.75 4.75s-4.75-2.127-4.75-4.75v-2.25c0-.414.336-.75.75-.75s.75.336.75.75v2.25c0 1.654 1.346 3 3 3s3-1.346 3-3v-2.25c0-.414.336-.75.75-.75zm-3.75-2.25c.414 0 .75.336.75.75v.75c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-.75c0-.414.336-.75.75-.75zm0 12c-.414 0-.75-.336-.75-.75v-.75c0-.414.336-.75.75-.75s.75.336.75.75v.75c0 .414-.336.75-.75.75z"/></svg>;
    case 'twitter':
      return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg>;
    case 'instagram':
      return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344 2.697 2.325 2.465 3.437 2.406 4.718.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.059 1.281.291 2.393 1.272 3.374.981.981 2.093 1.213 3.374 1.272C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 1.281-.059 2.393-.291 3.374-1.272.981-.981 1.213-2.093 1.272-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.291-2.393-1.272-3.374-.981-.981-2.093-1.213-3.374-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>;
    case 'facebook':
      return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>;
    default:
      return null;
  }
}

const TEXTS = {
  tr: {
    title: 'Clinikoop Çok Yakında!',
    desc: 'Diş klinikleri için yeni nesil teklif ve hasta yönetim platformu yakında yayında! Takipte kalın.',
    contact: 'İletişim: info@gmail.com',
    soon: 'Çok Yakında',
    lang: 'Türkçe',
    switch: 'English',
  },
  en: {
    title: 'Clinikoop Coming Soon!',
    desc: 'A next-gen offer and patient management platform for dental clinics is launching soon! Stay tuned.',
    contact: 'Contact: info@gmail.com',
    soon: 'Coming Soon',
    lang: 'English',
    switch: 'Türkçe',
  },
};

export default function ComingSoonPage() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const t = TEXTS[lang];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-50">
      <div className="absolute top-4 right-4">
        <button
          className="px-4 py-2 rounded-lg bg-white/80 text-blue-700 font-semibold shadow hover:bg-white"
          onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
        >
          {t.switch}
        </button>
      </div>
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 md:p-16 flex flex-col items-center border border-blue-100 relative z-10">
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full bg-blue-900 p-4 shadow-lg">
            <Image src="/logo.png" alt="Clinikoop Logo" width={80} height={80} className="object-contain" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4 text-center">{t.title}</h1>
        <p className="text-gray-600 text-lg mb-8 text-center max-w-md">
          {t.desc}
        </p>
        <a
          href="mailto:info@clinikoop.com"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold mb-6"
        >
          {t.contact}
        </a>
        <div className="flex gap-4 mt-2">
          {SOCIALS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-blue-700 hover:text-blue-900 bg-white rounded-full p-2 shadow transition"
            >
              <SocialIcon icon={s.icon} label={s.label} />
            </a>
          ))}
        </div>
      </div>
      <div className="mt-12 text-white/80 text-sm z-10">&copy; {new Date().getFullYear()} Clinikoop</div>
    </div>
  );
} 