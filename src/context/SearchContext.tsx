// src/context/SearchContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  openSearch: () => void;
  closeSearch: () => void;
  isSearchOpen: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <SearchContext.Provider value={{ openSearch, closeSearch, isSearchOpen }}>
      {children}
    </SearchContext.Provider>
  );
}