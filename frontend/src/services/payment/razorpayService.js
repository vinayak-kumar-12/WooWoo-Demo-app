import { Alert } from 'react-native';
import api from '../api';

export const startRazorpayPayment = async (orderData, onSuccess, onFailure) => {
  try {
    // 1. Request backend to create Razorpay Order
    const orderResponse = await api.post('/payments/create-order', {
      orderId: orderData.id,
    });

    if (!orderResponse.data || !orderResponse.data.success) {
      throw new Error(orderResponse.data?.message || 'Failed to create payment gateway order');
    }

    const { key, razorpayOrderId, amount, currency, mock } = orderResponse.data;

    // Prefill options
    const options = {
      description: `Art Purchase - Order #${orderData.id}`,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=200', // WOOWOO logo placeholder
      currency: currency || 'INR',
      key: key || process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
      amount: amount,
      name: 'WOOWOO Art House',
      order_id: razorpayOrderId,
      prefill: {
        email: orderData.customer_email || 'customer@example.com',
        contact: '9999999999',
        name: orderData.customer_name || 'Guest User',
      },
      theme: {
        color: '#1A1A1A', // Dark aesthetic matching WOOWOO brand colors
      },
    };

    // If it's a mock order (sandbox mode or credentials not configured)
    if (mock) {
      console.log('Razorpay running in Mock Sandbox Mode');
      Alert.alert(
        'Payment Checkout',
        `Initiating payment of ₹${orderData.grand_total} for Order #${orderData.id}.\nChoose payment outcome:`,
        [
          {
            text: 'Cancel',
            onPress: () => onFailure('Payment cancelled by user'),
            style: 'cancel',
          },
          {
            text: 'Fail Payment',
            onPress: () => onFailure('Payment authorization failed'),
          },
          {
            text: 'Authorize Success',
            onPress: async () => {
              const mockPaymentId = `pay_mock_${Date.now()}`;
              const mockSignature = 'mock_signature';
              try {
                // Verify with backend
                const verifyResponse = await api.post('/payments/verify', {
                  orderId: orderData.id,
                  razorpayOrderId: razorpayOrderId,
                  razorpayPaymentId: mockPaymentId,
                  razorpaySignature: mockSignature,
                });

                if (verifyResponse.data && verifyResponse.data.success) {
                  onSuccess(mockPaymentId, mockSignature);
                } else {
                  onFailure(verifyResponse.data?.message || 'Verification failed');
                }
              } catch (err) {
                onFailure(err.message || 'Payment verification failed');
              }
            },
          },
        ]
      );
      return;
    }

    // Try executing native SDK payment flow
    try {
      const RazorpayCheckout = require('react-native-razorpay').default;
      RazorpayCheckout.open(options)
        .then(async (data) => {
          // Send verification to backend
          try {
            const verifyResponse = await api.post('/payments/verify', {
              orderId: orderData.id,
              razorpayOrderId: data.razorpay_order_id,
              razorpayPaymentId: data.razorpay_payment_id,
              razorpaySignature: data.razorpay_signature,
            });

            if (verifyResponse.data && verifyResponse.data.success) {
              onSuccess(data.razorpay_payment_id, data.razorpay_signature);
            } else {
              onFailure(verifyResponse.data?.message || 'Payment signature verification failed');
            }
          } catch (err) {
            onFailure(err.message || 'Verification endpoint failed');
          }
        })
        .catch((error) => {
          console.log('Razorpay SDK payment failure:', error);
          onFailure(error.description || 'Payment failed or cancelled');
        });
    } catch (sdkError) {
      console.warn('Razorpay Native SDK not found or failed to load. Defaulting to Web Sandbox Flow.');
      // Auto-fallback mock flow for Expo Go compatibility
      Alert.alert(
        'Razorpay Sandbox',
        `Simulated checkout for ₹${orderData.grand_total} (Order #${orderData.id})`,
        [
          { text: 'Cancel', onPress: () => onFailure('Payment cancelled'), style: 'cancel' },
          {
            text: 'Pay Successfully',
            onPress: async () => {
              const mockPaymentId = `pay_mock_${Date.now()}`;
              const mockSignature = 'mock_signature';
              try {
                const verifyResponse = await api.post('/payments/verify', {
                  orderId: orderData.id,
                  razorpayOrderId: razorpayOrderId,
                  razorpayPaymentId: mockPaymentId,
                  razorpaySignature: mockSignature,
                });

                if (verifyResponse.data && verifyResponse.data.success) {
                  onSuccess(mockPaymentId, mockSignature);
                } else {
                  onFailure(verifyResponse.data?.message || 'Verification failed');
                }
              } catch (err) {
                onFailure(err.message || 'Payment verification failed');
              }
            },
          },
        ]
      );
    }
  } catch (error) {
    console.error('Error starting Razorpay payment:', error);
    onFailure(error.message || 'Failed to initiate checkout process');
  }
};
