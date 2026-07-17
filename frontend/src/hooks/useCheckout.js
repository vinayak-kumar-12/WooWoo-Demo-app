import { useState, useCallback } from 'react';
import api from '../services/api';
import { startRazorpayPayment } from '../services/payment/razorpayService';

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const placeOrder = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/orders', payload);
      if (response.data && response.data.success) {
        return response.data.order;
      } else {
        setError(response.data?.message || 'Failed to place order');
        return null;
      }
    } catch (err) {
      setError(err.message || 'Error creating order record');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const processPayment = useCallback(
    async (order, onSuccess, onFailure) => {
      setLoading(true);
      try {
        await startRazorpayPayment(
          {
            id: order.id,
            grand_total: order.grand_total,
            customer_name: order.customer_name,
            customer_email: order.customer_email,
          },
          (paymentId) => {
            setLoading(false);
            onSuccess(paymentId);
          },
          (errDescription) => {
            setLoading(false);
            onFailure(errDescription);
          }
        );
      } catch (err) {
        setLoading(false);
        onFailure(err.message || 'Payment system error');
      }
    },
    []
  );

  return {
    placeOrder,
    processPayment,
    loading,
    error,
  };
};
