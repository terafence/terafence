'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkSession } from './lib/auth';
import OTPLogin from './components/OTPLogin';
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";

export default function SupportPage() {
  const router = useRouter();

  useEffect(() => {
    const session = checkSession();
    if (session.isValid) {
      router.push('/support/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar/>
      <OTPLogin/>
      <Footer/>
    </div>
  );
}