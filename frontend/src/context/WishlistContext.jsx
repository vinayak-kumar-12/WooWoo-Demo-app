import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useToast from '../hooks/useToast';

const WishlistContext = createContext(undefined);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { showToast } = useToast();

  // Load wishlist from AsyncStorage on mount
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const storedWishlist = await AsyncStorage.getItem('@woowoo_wishlist');
        if (storedWishlist) {
          setWishlistItems(JSON.parse(storedWishlist));
        }
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      }
    };
    loadWishlist();
  }, []);

  const addToWishlist = async (product) => {
    try {
      if (wishlistItems.some(item => item.id === product.id)) {
        return;
      }
      const updatedWishlist = [...wishlistItems, product];
      setWishlistItems(updatedWishlist);
      await AsyncStorage.setItem('@woowoo_wishlist', JSON.stringify(updatedWishlist));
      showToast(`${product.name || product.title || 'Product'} added to Wishlist!`, 'success');
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
      showToast('Failed to add to wishlist', 'error');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const product = wishlistItems.find(item => item.id === productId);
      const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
      setWishlistItems(updatedWishlist);
      await AsyncStorage.setItem('@woowoo_wishlist', JSON.stringify(updatedWishlist));
      if (product) {
        showToast(`${product.name || product.title || 'Product'} removed from Wishlist`, 'info');
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      showToast('Failed to remove from wishlist', 'error');
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
