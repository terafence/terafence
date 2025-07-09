'use client';

import { useState } from 'react';

interface NewsletterSubscribeProps {
  /** Layout variant */
  variant?: 'modern' | 'footer' | 'sidebar';
  /** Source identifier for tracking */
  source?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Modern newsletter subscription component
 */
export default function NewsletterSubscribe({
  variant = 'modern',
  source = 'website',
  className = '',
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe. Please try again.');
      }
      
      setStatus('success');
      setEmail('');
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  // Modern variant (matches screenshot)
  if (variant === 'modern') {
    return (
      <div className={`w-full bg-white py-12 px-4 rounded-3xl ${className}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Stay in the loop</h2>
          
          <p className="text-xl text-gray-600 mb-10">
            Subscribe to our newsletter for the latest updates, exclusive content, and special offers.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`block w-full rounded-xl border ${
                    status === 'error' ? 'border-red-300' : 'border-gray-300'
                  } py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-1 
                  focus:ring-purple-500 focus:border-purple-500 text-lg`}
                  aria-label="Email address"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-xl bg-purple-500 px-6 py-3 text-lg font-medium text-white 
                shadow-sm hover:bg-purple-600 transition-colors flex items-center justify-center"
              >
                {status === 'loading' ? 'Subscribing...' : (
                  <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 5L20 12L13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
            
            {status === 'success' && (
              <p className="mt-3 text-sm text-green-600">Thank you! Your subscription has been confirmed.</p>
            )}
            
            {status === 'error' && (
              <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
            )}
            
            <p className="mt-5 text-sm text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Original sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`w-full ${className}`}>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className={`w-full pl-3 pr-16 py-2.5 rounded-md bg-white shadow-sm border 
                ${status === 'error' ? 'border-red-300' : 'border-gray-200'} 
                text-sm transition focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none`}
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="absolute right-1 top-1 rounded-md bg-[#0c1e35] px-2.5 py-1.5 text-xs font-medium text-white 
                shadow-sm hover:bg-blue-800 transition-colors disabled:opacity-70"
              aria-label="Subscribe"
            >
              {status === 'loading' ? 'Sending...' : 'Subscribe'}
            </button>
          </div>
          
          {status === 'success' && (
            <p className="mt-2 text-xs text-green-600">Thank you for subscribing to our newsletter.</p>
          )}
          
          {status === 'error' && (
            <p className="mt-2 text-xs text-red-600">{errorMessage}</p>
          )}
        </form>
      </div>
    );
  }
  
  // Original footer variant
  return (
    <div className={`w-full bg-[#f9fafb] border border-gray-100 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="text-center max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscribe to our newsletter</h3>
        <p className="text-sm text-gray-600 mb-4">Stay updated with the latest cybersecurity insights and product news</p>
        
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`block w-full rounded-md border ${status === 'error' ? 'border-red-300' : 'border-gray-300'} 
                  py-2.5 pl-10 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500 
                  focus:border-blue-500 sm:text-sm sm:leading-6`}
                aria-label="Email address"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex-none rounded-md bg-[#0c1e35] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm 
                hover:bg-blue-800 transition-colors flex items-center justify-center gap-1 disabled:opacity-70"
            >
              {status === 'loading' ? 'Subscribing...' : (
                <>
                  Subscribe
                  <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>
          
          {status === 'success' && (
            <p className="mt-2 text-sm text-green-600">Thank you! Your subscription has been confirmed.</p>
          )}
          
          {status === 'error' && (
            <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
          )}
          
          <p className="mt-3 text-xs text-gray-500">
            By subscribing, you agree to our <a href="/privacy-policy" className="underline hover:text-blue-700">Privacy Policy</a> 
            and consent to receive updates from our company.
          </p>
        </form>
      </div>
    </div>
  );
}