// src/context/LoadingContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { LoadingOverlay } from '../components/Loading/LoadingOverlay';

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const showLoading = (msg?: string) => {
    setMessage(msg);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setMessage(undefined);
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      <LoadingOverlay open={isLoading} message={message} />
    </LoadingContext.Provider>
  );
}