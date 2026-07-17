import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';

export const OrderSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, grandTotal } = route.params;

  const handleContinueShopping = () => {
    navigation.navigate('HomeTabs', { screen: 'Store' });
  };

  const handleGoToActivity = () => {
    navigation.navigate('HomeTabs', { screen: 'Activity' });
  };

  const formattedTotal = typeof grandTotal === 'number' ? grandTotal.toFixed(2) : parseFloat(grandTotal).toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Success Icon */}
        <Animated.View entering={ZoomIn.duration(600)} style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={100} color="#10B981" />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.textContainer}>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSubtitle}>
            Thank you for your order. Your transaction has been completed successfully.
          </Text>
        </Animated.View>

        {/* Order Details Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={[styles.orderCard, theme.shadows.soft]}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID</Text>
            <Text style={styles.detailValue}>#WOO-{orderId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Paid</Text>
            <Text style={[styles.detailValue, { color: colors.primary, fontWeight: '800' }]}>
              ${formattedTotal}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>CONFIRMED</Text>
            </View>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.actionContainer}>
          <TouchableOpacity style={[styles.btn, styles.primaryBtn]} onPress={handleGoToActivity}>
            <Text style={styles.primaryBtnText}>Track in "My Activity"</Text>
            <Ionicons name="eye-outline" size={16} color={colors.white} style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.secondaryBtn]} onPress={handleContinueShopping}>
            <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 22,
    paddingHorizontal: theme.spacing.md,
  },
  orderCard: {
    width: '100%',
    backgroundColor: colors.grayLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: theme.spacing.xl + 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionContainer: {
    width: '100%',
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  secondaryBtnText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default OrderSuccessScreen;
