import { useState, useCallback } from 'react';
import api from '../services/api';
import { DUMMY_PRODUCTS } from '../constants/productsData';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    try {
      const url = category && category !== 'All' 
        ? `/products?category=${encodeURIComponent(category)}`
        : '/products';
      const response = await api.get(url);
      if (response.data && response.data.success && response.data.products && response.data.products.length > 0) {
        setProducts(response.data.products);
      } else {
        // Fallback to local data
        let filtered = DUMMY_PRODUCTS;
        if (category && category !== 'All') {
          filtered = DUMMY_PRODUCTS.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
          );
        }
        setProducts(filtered);
      }
    } catch (err) {
      console.warn('API call failed in useProducts hook, falling back to local dummy data:', err.message);
      let filtered = DUMMY_PRODUCTS;
      if (category && category !== 'All') {
        filtered = DUMMY_PRODUCTS.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
      }
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data && response.data.success && response.data.product) {
        return response.data.product;
      }
      const localProduct = DUMMY_PRODUCTS.find((p) => p.id.toString() === id.toString());
      return localProduct || null;
    } catch (err) {
      console.warn('API details call failed in useProducts hook, falling back to local dummy data:', err.message);
      const localProduct = DUMMY_PRODUCTS.find((p) => p.id.toString() === id.toString());
      return localProduct || null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProduct,
  };
};
