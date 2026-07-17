import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import { useCart } from '../../context/CartContext';

export const CartScreen = () => {
  const navigation = useNavigation();
  const {
    cartItems,
    loading,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    deliveryCharge,
    cartTotal,
  } = useCart();

  const handleQtyChange = async (item, action) => {
    const newQty = action === 'inc' ? item.quantity + 1 : item.quantity - 1;
    if (newQty < 1) {
      await removeFromCart(item.id);
    } else {
      await updateQuantity(item.id, newQty);
    }
  };

  const handleRemove = async (id) => {
    await removeFromCart(id);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigation.navigate('Checkout');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      {loading && cartItems.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={colors.textMuted} />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Explore the store and add premium art supplies to get started!</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Store')}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.itemsList}>
              {cartItems.map((item, index) => {
                const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : item.price;
                return (
                  <Animated.View
                    entering={FadeInDown.delay(index * 100).duration(400)}
                    key={item.id}
                    style={[styles.cartItemRow, theme.shadows.soft]}
                  >
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemCategory}>{item.category.toUpperCase()}</Text>
                      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.itemPrice}>${itemPrice.toFixed(2)}</Text>
                      
                      {/* Quantity Controls */}
                      <View style={styles.qtyContainer}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQtyChange(item, 'dec')}>
                          <Ionicons name="remove" size={16} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQtyChange(item, 'inc')}>
                          <Ionicons name="add" size={16} color={colors.text} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Remove Button */}
                    <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id)}>
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>

            {/* Bill Summary */}
            <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Bill Summary</Text>
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${cartSubtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Charges</Text>
                <Text style={[styles.summaryValue, deliveryCharge === 0 && { color: '#10B981', fontWeight: '700' }]}>
                  {deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={[styles.summaryRow, { marginTop: 4 }]}>
                <Text style={styles.grandTotalLabel}>Total Amount</Text>
                <Text style={styles.grandTotalValue}>${cartTotal.toFixed(2)}</Text>
              </View>
            </Animated.View>
          </ScrollView>

          {/* Checkout Bar */}
          <Animated.View entering={FadeInUp.duration(500)} style={[styles.checkoutBar, theme.shadows.soft]}>
            <View style={styles.totalInfo}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${cartTotal.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
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
  },
  itemsList: {
    padding: theme.spacing.lg,
  },
  cartItemRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  itemImage: {
    width: 76,
    height: 76,
    borderRadius: theme.borderRadius.md,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  itemCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.grayLight,
    marginTop: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 8,
  },
  removeBtn: {
    padding: 8,
    marginLeft: theme.spacing.sm,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalInfo: {
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: theme.spacing.xl,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkoutBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: theme.spacing.lg,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
  shopBtn: {
    marginTop: theme.spacing.xl,
    backgroundColor: colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md - 2,
    borderRadius: 24,
  },
  shopBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CartScreen;
