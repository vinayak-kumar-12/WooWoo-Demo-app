import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';

const MOCK_ORDERS = [
  {
    id: 'ORD-5829',
    date: 'July 14, 2026',
    total: '$1,200',
    status: 'Delivered',
    artwork: 'Echoes of Light',
  },
  {
    id: 'ORD-9174',
    date: 'June 28, 2026',
    total: '$950',
    status: 'In Transit',
    artwork: 'Silent Symphony',
  },
];

const MyOrdersScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={[styles.orderCard, theme.shadows.soft]}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text style={[styles.statusText, item.status === 'Delivered' ? styles.statusDelivered : styles.statusTransit]}>
          {item.status}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.orderBody}>
        <Text style={styles.artworkTitle}>{item.artwork}</Text>
        <Text style={styles.orderDate}>Ordered on {item.date}</Text>
        <Text style={styles.orderTotal}>Total: {item.total}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={MOCK_ORDERS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
  },
  placeholder: {
    width: 32,
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  orderCard: {
    backgroundColor: colors.grayLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing.sm,
  },
  orderId: {
    fontSize: theme.typography.fontSizes.sm + 1,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
  },
  statusText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    textTransform: 'uppercase',
  },
  statusDelivered: {
    color: colors.success,
  },
  statusTransit: {
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: theme.spacing.sm,
  },
  orderBody: {
    gap: 4,
  },
  artworkTitle: {
    fontSize: theme.typography.fontSizes.sm + 2,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
  },
  orderDate: {
    fontSize: theme.typography.fontSizes.xs,
    color: colors.textMuted,
  },
  orderTotal: {
    fontSize: theme.typography.fontSizes.sm + 1,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.primary,
    marginTop: 4,
  },
});

export default MyOrdersScreen;
