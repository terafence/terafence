'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconAlertCircle, IconArrowRight } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function SessionExpired() {
  const router = useRouter();

  useEffect(() => {
    // Clear any remaining session data
    localStorage.removeItem('userSession');
    
    // Set a timer to automatically redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/support');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [router]);

  const handleRedirect = () => {
    router.push('/support');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-[400px] shadow-lg">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <div className="flex items-center space-x-2">
              <IconAlertCircle className="text-amber-500 h-6 w-6" />
              <CardTitle className="text-xl font-bold">Session Expired</CardTitle>
            </div>
            <CardDescription>
              Your session has timed out due to inactivity
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600">
              For your security, we automatically sign you out after 10 minutes of inactivity. Please sign in again to continue.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleRedirect} className="w-full">
              Re-authenticate
              <IconArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}