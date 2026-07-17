import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../hooks/useCheckout';
import { useAuth } from '../../hooks/useAuth';

export const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { cartItems, cartSubtotal, deliveryCharge, cartTotal, clearCart } = useCart();
  const { placeOrder, processPayment } = useCheckout();

  const [shippingAddress, setShippingAddress] = useState('');
  const [customerName, setCustomerName] = useState(user?.username || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid shipping address.');
      return;
    }
    if (!customerName.trim()) {
      Alert.alert('Validation Error', 'Please enter your name.');
      return;
    }
    if (!customerEmail.trim()) {
      Alert.alert('Validation Error', 'Please enter your email.');
      return;
    }

    setIsProcessing(true);

    const payload = {
      customerName,
      customerEmail,
      shippingAddress,
      subtotal: cartSubtotal,
      deliveryCharge,
      discount: 0.00,
      grandTotal: cartTotal,
      items: cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : item.price,
      })),
    };

    // 1. Save pending order in backend database
    const order = await placeOrder(payload);
    if (!order) {
      setIsProcessing(false);
      Alert.alert('Checkout Error', 'Failed to place order record. Please try again.');
      return;
    }

    // 2. Start Razorpay Transaction
    await processPayment(
      {
        id: order.id,
        grand_total: order.grand_total,
        customer_name: customerName,
        customer_email: customerEmail,
      },
      // Signature verified successfully
      (paymentId) => {
        setIsProcessing(false);
        clearCart(); // Clear local context cart
        navigation.navigate('OrderSuccess', {
          orderId: order.id,
          grandTotal: order.grand_total,
        });
      },
      // Payment failed or cancelled
      (errorMsg) => {
        setIsProcessing(false);
        Alert.alert('Payment Transaction Error', errorMsg || 'Payment cancelled or verification failed.');
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Customer Details */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Enter your name"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={customerEmail}
              onChangeText={setCustomerEmail}
              keyboardType="email-address"
              placeholder="Enter email address"
              autoCapitalize="none"
            />
          </View>
        </Animated.View>

        {/* 2. Shipping Address */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={shippingAddress}
            onChangeText={setShippingAddress}
            placeholder="Enter full shipping delivery address..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </Animated.View>

        {/* 3. Payment Method */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodRow}>
            <Ionicons name="card" size={22} color={colors.primary} />
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodName}>Razorpay Payment Gateway</Text>
              <Text style={styles.paymentMethodDesc}>Secure online payment via cards, UPI, net banking</Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
          </View>
        </Animated.View>

        {/* 4. Order Summary */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          {cartItems.map((item) => {
            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : item.price;
            return (
              <View key={item.id} style={styles.summaryItemRow}>
                <Text style={styles.summaryItemName} numberOfLines={1}>
                  {item.name} <Text style={{ color: colors.textMuted }}>x{item.quantity}</Text>
                </Text>
                <Text style={styles.summaryItemPrice}>${(itemPrice * item.quantity).toFixed(2)}</Text>
              </View>
            );
          })}

          <View style={styles.divider} />
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Subtotal</Text>
            <Text style={styles.billValue}>${cartSubtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery charge</Text>
            <Text style={styles.billValue}>${deliveryCharge.toFixed(2)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Discount</Text>
            <Text style={[styles.billValue, { color: '#10B981' }]}>$0.00</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>${cartTotal.toFixed(2)}</Text>
          </View>
        </Animated.View>

      </ScrollView>

      {/* Place Order Sticky Button */}
      <Animated.View entering={FadeInUp.duration(500)} style={[styles.bottomBar, theme.shadows.soft]}>
        <TouchableOpacity
          style={[styles.placeOrderBtn, isProcessing && styles.disabledBtn]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Text style={styles.placeOrderText}>Pay & Place Order • ${cartTotal.toFixed(2)}</Text>
              <Ionicons name="shield-checkmark" size={18} color={colors.white} style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: theme.spacing.md,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.md,
    height: 44,
    paddingHorizontal: theme.spacing.md,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.grayLight,
  },
  textArea: {
    height: 80,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: colors.primary + '05',
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  paymentMethodName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  paymentMethodDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  summaryItemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: theme.spacing.md,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  billLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  billValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  grandTotalValue: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },
  placeOrderBtn: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  placeOrderText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CheckoutScreen;
