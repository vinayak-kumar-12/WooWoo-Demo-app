import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecentlyViewedContext = createContext(undefined);

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadRecentlyViewed = async () => {
      try {
        const stored = await AsyncStorage.getItem('@woowoo_recently_viewed');
        if (stored) {
          setRecentlyViewed(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load recently viewed:', err);
      }
    };
    loadRecentlyViewed();
  }, []);

  const addRecentlyViewed = async (product) => {
    try {
      // Avoid duplicate entries: remove existing occurrence, then unshift
      const filtered = recentlyViewed.filter(item => item.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10); // Keep last 10
      setRecentlyViewed(updated);
      await AsyncStorage.setItem('@woowoo_recently_viewed', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save recently viewed:', err);
    }
  };

  const clearRecentlyViewed = async () => {
    try {
      setRecentlyViewed([]);
      await AsyncStorage.removeItem('@woowoo_recently_viewed');
    } catch (err) {
      console.error('Failed to clear recently viewed:', err);
    }
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};
