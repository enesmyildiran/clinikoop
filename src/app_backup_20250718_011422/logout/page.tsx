"use client";
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/login' });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <span>Çıkış yapılıyor...</span>
    </div>
  );
} 