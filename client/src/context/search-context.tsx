import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Topic } from '@/types';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentTopic: Topic;
  setCurrentTopic: (topic: Topic) => void;
}

export const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  currentTopic: 'All',
  setCurrentTopic: () => {},
});

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTopic, setCurrentTopic] = useState<Topic>('All');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, currentTopic, setCurrentTopic }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext); 