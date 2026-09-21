// src/hooks/useSlowNetwork.ts
import { useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

interface UseSlowNetworkOptions {
  delay?: number; // Minimum delay to show loading
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useSlowNetwork() {
  const { showLoading, hideLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);

  const executeWithLoading = async <T>(
    asyncFunction: () => Promise<T>,
    options: UseSlowNetworkOptions = {}
  ): Promise<T | undefined> => {
    const { delay = 800, onSuccess, onError } = options;
    
    try {
      setIsLoading(true);
      showLoading('Loading...');

      // Simulate network delay if needed
      const startTime = Date.now();
      const result = await asyncFunction();
      const elapsed = Date.now() - startTime;

      // Ensure minimum loading time for better UX
      if (elapsed < delay) {
        await new Promise(resolve => setTimeout(resolve, delay - elapsed));
      }

      onSuccess?.();
      return result;
    } catch (error) {
      onError?.(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  return { executeWithLoading, isLoading };
}

// Simulate API call with delay
export const simulateApiCall = <T>(data: T, delay: number = 1500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};