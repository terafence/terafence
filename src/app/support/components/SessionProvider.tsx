// src/app/support/components/SessionProvider.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkSession } from '../lib/auth';

interface SessionProviderProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export default function SessionProvider({ 
  children, 
  requireAuth = false,
  requireAdmin = false 
}: SessionProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Check if we're on client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run session checks on client side
    if (!isMounted) return;
    
    const checkUserSession = () => {
      const session = checkSession();
      
      if (requireAuth && !session.isValid) {
        // Redirect to session expired page if authentication is required
        router.push('/support/session-expired');
        return;
      }
      
      if (requireAdmin && (!session.isValid || !session.isAdmin)) {
        // Redirect to dashboard if admin access is required but user is not admin
        if (session.isValid) {
          router.push('/support/dashboard');
        } else {
          router.push('/support/session-expired');
        }
        return;
      }
      
      setIsLoading(false);
    };
    
    // Check session immediately
    checkUserSession();
    
    // Set up interval to check session every minute
    const interval = setInterval(checkUserSession, 60000);
    
    return () => clearInterval(interval);
  }, [requireAuth, requireAdmin, router, isMounted]);

  // On server-side rendering, don't show loading indicator
  if (!isMounted) {
    return <>{children}</>;
  }

  if (isLoading) {
    // Show a simple loading state
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}