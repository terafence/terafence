'use client';

import { useState } from 'react';

interface SubscriptionData {
  email: string;
  name?: string;
  company?: string;
  interests?: string[];
  source?: string;
}

interface UseNewsletterSubscriptionOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseNewsletterSubscriptionReturn {
  subscribe: (data: SubscriptionData) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Custom hook for newsletter subscription functionality
 */
export function useNewsletterSubscription(
  options?: UseNewsletterSubscriptionOptions
): UseNewsletterSubscriptionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const subscribe = async (data: SubscriptionData): Promise<void> => {
    try {
      setIsLoading(true);
      reset();

      // Basic validation
      if (!data.email) {
        throw new Error('Email is required');
      }

      if (!validateEmail(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe to the newsletter');
      }

      setIsSuccess(true);
      options?.onSuccess?.();
    } catch (err) {
      setIsError(true);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      options?.onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscribe,
    isLoading,
    isSuccess,
    isError,
    error,
    reset,
  };
}

export default useNewsletterSubscription;