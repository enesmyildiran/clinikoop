'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaYoutube, FaLinkedin, FaPinterest, FaTiktok, FaXTwitter, FaInstagram, FaFacebook } from 'react-icons/fa6';
import { FiCopy } from 'react-icons/fi';
import { TfiWorld } from 'react-icons/tfi';
import { TbFlag, TbFlagFilled } from 'react-icons/tb';

const SOCIALS = [
  { href: 'https://www.youtube.com/@Clinikoop', icon: <FaYoutube />, label: 'YouTube' },
  { href: 'https://www.linkedin.com/company/clinikoop/', icon: <FaLinkedin />, label: 'LinkedIn' },
  { href: 'https://tr.pinterest.com/clinikoop/', icon: <FaPinterest />, label: 'Pinterest' },
  { href: 'https://www.tiktok.com/@clinikoop', icon: <FaTiktok />, label: 'TikTok' },
  { href: 'https://x.com/Clinikoop', icon: <FaXTwitter />, label: 'X' },
  { href: 'https://www.instagram.com/clinikoop/', icon: <FaInstagram />, label: 'Instagram' },
  { href: 'https://www.facebook.com/Clinikoop', icon: <FaFacebook />, label: 'Facebook' },
];

const TEXTS = {
  tr: {
    title: 'Clinikoop Çok Yakında!',
    desc: 'Diş klinikleri için yeni nesil teklif ve hasta yönetim platformu yakında yayında! Takipte kalın.',
    contact: 'E-posta adresi kopyalandı!',
    soon: 'Çok Yakında',
    lang: 'Türkçe',
    switch: 'English',
    flag: <Image src="/turkish-flag.png" alt="Türkçe" width={24} height={24} className="inline-block align-middle" />,
    flagSwitch: <Image src="/english-flag.png" alt="English" width={24} height={24} className="inline-block align-middle" />,
    mail: 'info [@] clinikoop [.] com',
    mailCopy: 'info@clinikoop.com',
    mailLabel: 'E-posta adresini kopyala',
  },
  en: {
    title: 'Clinikoop Coming Soon!',
    desc: 'A next-gen offer and patient management platform for dental clinics is launching soon! Stay tuned.',
    contact: 'Email address copied!',
    soon: 'Coming Soon',
    lang: 'English',
    switch: 'Türkçe',
    flag: <Image src="/english-flag.png" alt="English" width={24} height={24} className="inline-block align-middle" />,
    flagSwitch: <Image src="/turkish-flag.png" alt="Türkçe" width={24} height={24} className="inline-block align-middle" />,
    mail: 'info [at] clinikoop [dot] com',
    mailCopy: 'info@clinikoop.com',
    mailLabel: 'Copy email address',
  },
};

export default function ComingSoonPage() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [copied, setCopied] = useState(false);
  const t = TEXTS[lang];

  const handleCopy = () => {
    navigator.clipboard.writeText(t.mailCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-50">
      <div className="absolute top-4 right-4 flex gap-2 items-center z-20">
        <button
          className="px-3 py-2 rounded-lg bg-white/80 text-blue-700 font-semibold shadow hover:bg-white flex items-center gap-2"
          onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
          aria-label={t.switch}
        >
          {lang === 'tr' ? (
            <span className="flex items-center gap-1">{TEXTS.en.flag}<span className="hidden md:inline">EN</span></span>
          ) : (
            <span className="flex items-center gap-1">{TEXTS.tr.flag}<span className="hidden md:inline">TR</span></span>
          )}
        </button>
      </div>
      <div className="bg-white/90 rounded-2xl shadow-xl p-6 md:p-12 flex flex-col items-center border border-blue-100 relative z-10">
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full bg-blue-900 p-2 md:p-6 shadow-lg flex items-center justify-center" style={{ width: 160, height: 160 }}>
            <Image src="/logo2.png" alt="Clinikoop Logo" width={128} height={128} className="object-contain" priority />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4 text-center">{t.title}</h1>
        <p className="text-gray-600 text-lg mb-8 text-center max-w-md">
          {t.desc}
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-semibold mb-6"
          aria-label={t.mailLabel}
        >
          <FiCopy className="w-5 h-5" />
          <span>{t.mail}</span>
        </button>
        {copied && <div className="text-green-600 text-sm mb-2">{t.contact}</div>}
        <div className="flex gap-4 mt-2">
          {SOCIALS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-blue-700 hover:text-blue-900 bg-white rounded-full p-3 shadow transition text-2xl flex items-center justify-center"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
      <div className="mt-12 text-white/80 text-sm z-10">&copy; {new Date().getFullYear()} Clinikoop</div>
    </div>
  );
} 