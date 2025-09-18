"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail } from 'lucide-react';

const UltraForbiddenPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#020010] text-white overflow-hidden relative font-sans">
      {/* Background: Multi-layered animated elements */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-purple-900/50 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-[20%] right-[10%] w-80 h-80 bg-cyan-900/50 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[15%] left-[20%] w-72 h-72 bg-red-900/40 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Kinetic Typography: Large "403" in the background */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <h1 className="text-[30vw] md:text-[25rem] font-black text-white/5 select-none">
          403
        </h1>
      </div>

      {/* Main Content Card: Advanced Glassmorphism */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <div 
          className="w-full max-w-lg p-8 md:p-12 space-y-6 bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-purple-900/20"
        >
          {/* Interactive Icon Placeholder (e.g., for a Spline/3D element) */}
          <div className="w-24 h-24 mx-auto flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border-2 border-white/20 rounded-full">
            <div className="w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
          </div>
          
          <div className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-purple-400 mb-2">
              ACCESS DENIED
            </h2>
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Permission Required
            </p>
          </div>

          <p className="text-center text-slate-400 max-w-sm mx-auto">
            You are authenticated, but your account lacks the necessary permissions to view this page. This is not an error, but a security measure.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4">
            <button
              onClick={handleGoHome}
              className="group relative w-full max-w-xs inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 ease-in-out bg-purple-700 rounded-xl hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#020010]"
            >
              <span className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 transition duration-300 group-hover:opacity-100"></span>
              Return to Dashboard
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a href="mailto:support@example.com" className="text-sm text-slate-500 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Request Access
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltraForbiddenPage;
