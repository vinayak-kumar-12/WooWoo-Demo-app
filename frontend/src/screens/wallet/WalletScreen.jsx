import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  StatusBar,
  ScrollView,
  Dimensions,
  Animated as RNAnimated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  Layout, 
  ZoomIn 
} from 'react-native-reanimated';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import useAuth from '../../hooks/useAuth';

const { width } = Dimensions.get('window');

const MOCK_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'credit',
    category: 'cashback',
    amount: 50,
    title: 'Cashback Received',
    description: 'Store Order #WOO-9081',
    date: '12 Jul 2026',
    time: '10:30 AM',
    status: 'Completed',
  },
  {
    id: 'tx-2',
    type: 'debit',
    category: 'booking',
    amount: 200,
    title: 'Wallet Used',
    description: 'Studio Space A Booking',
    date: '10 Jul 2026',
    time: '02:15 PM',
    status: 'Completed',
  },
  {
    id: 'tx-3',
    type: 'credit',
    category: 'reward',
    amount: 100,
    title: 'Reward Points Earned',
    description: 'Watercolor Kit Workshop',
    date: '08 Jul 2026',
    time: '11:00 AM',
    status: 'Completed',
  },
  {
    id: 'tx-4',
    type: 'credit',
    category: 'refund',
    amount: 120,
    title: 'Refund Received',
    description: 'Cancelled Service Request',
    date: '05 Jul 2026',
    time: '04:45 PM',
    status: 'Completed',
  },
  {
    id: 'tx-5',
    type: 'debit',
    category: 'store_order',
    amount: 350,
    title: 'Store Purchase',
    description: 'Brushes & Painting Paper',
    date: '03 Jul 2026',
    time: '09:30 AM',
    status: 'Completed',
  },
  {
    id: 'tx-6',
    type: 'debit',
    category: 'service',
    amount: 150,
    title: 'Canvas Framing Service',
    description: 'Custom Order #WOO-1039',
    date: '01 Jul 2026',
    time: '06:00 PM',
    status: 'Completed',
  },
  {
    id: 'tx-7',
    type: 'credit',
    category: 'cashback',
    amount: 25,
    title: 'Cashback Received',
    description: 'Store Order #WOO-8910',
    date: '28 Jun 2026',
    time: '12:05 PM',
    status: 'Completed',
  },
];

const QUICK_ACTIONS = [
  { id: 'tx_hist', label: 'View Transactions', icon: 'receipt-outline', color: '#3B82F6' },
  { id: 'rewards', label: 'Rewards Hub', icon: 'gift-outline', color: '#10B981' },
  { id: 'cashback', label: 'Cashbacks', icon: 'cash-outline', color: '#F59E0B' },
  { id: 'analytics', label: 'Analytics', icon: 'pie-chart-outline', color: '#8B5CF6' },
];

const FILTERS = [
  'All',
  'Credit',
  'Debit',
  'Cashback',
  'Rewards',
  'Store Orders',
  'Bookings',
  'Workshops',
  'Services',
];

export const WalletScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placeholderView, setPlaceholderView] = useState(null);

  const shimmerAnim = useRef(new RNAnimated.Value(0.3)).current;

  // Pulse animation for crash-proof skeleton loader
  useEffect(() => {
    if (loading) {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(shimmerAnim, {
            toValue: 0.8,
            duration: 800,
            useNativeDriver: true,
          }),
          RNAnimated.timing(shimmerAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [loading]);

  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false);
    }, 1200);
  };

  // Filtered & Searched Transactions
  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((tx) => {
      // 1. Filter Chip
      if (activeFilter !== 'All') {
        if (activeFilter === 'Credit' && tx.type !== 'credit') return false;
        if (activeFilter === 'Debit' && tx.type !== 'debit') return false;
        if (activeFilter === 'Cashback' && tx.category !== 'cashback') return false;
        if (activeFilter === 'Rewards' && tx.category !== 'reward') return false;
        if (activeFilter === 'Store Orders' && tx.category !== 'store_order') return false;
        if (activeFilter === 'Bookings' && tx.category !== 'booking') return false;
        if (activeFilter === 'Workshops' && tx.category !== 'workshop' && tx.category !== 'reward') return false; // Reward linked to workshop
        if (activeFilter === 'Services' && tx.category !== 'service') return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = tx.title.toLowerCase().includes(query);
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesAmount = tx.amount.toString().includes(query);
        const matchesDate = tx.date.toLowerCase().includes(query);
        const matchesType = tx.type.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesAmount || matchesDate || matchesType;
      }

      return true;
    });
  }, [activeFilter, searchQuery]);

  // Analytics Computation
  const analytics = useMemo(() => {
    const cashback = MOCK_TRANSACTIONS
      .filter(tx => tx.category === 'cashback')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const rewards = MOCK_TRANSACTIONS
      .filter(tx => tx.category === 'reward')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const debit = MOCK_TRANSACTIONS
      .filter(tx => tx.type === 'debit')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const count = MOCK_TRANSACTIONS.length;

    return { cashback, rewards, debit, count };
  }, []);

  const renderTransactionItem = ({ item, index }) => {
    const isCredit = item.type === 'credit';
    const isRefund = item.category === 'refund';
    
    let iconName = 'arrow-up-circle-outline';
    let iconColor = '#EF4444';
    let iconBg = '#FFEBEE';
    
    if (isCredit) {
      iconName = 'arrow-down-circle-outline';
      iconColor = '#10B981';
      iconBg = '#E8F5E9';
    }
    if (isRefund) {
      iconName = 'refresh-circle-outline';
      iconColor = '#3B82F6';
      iconBg = '#E3F2FD';
    }

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).duration(300)}
        style={[styles.transactionCard, theme.shadows.soft]}
      >
        <View style={[styles.txIconContainer, { backgroundColor: iconBg }]}>
          <Ionicons name={iconName} size={22} color={iconColor} />
        </View>
        
        <View style={styles.txInfo}>
          <Text style={styles.txTitle}>{item.title}</Text>
          <Text style={styles.txDesc} numberOfLines={1}>{item.description}</Text>
          <Text style={styles.txTime}>{item.date} • {item.time}</Text>
        </View>
        
        <View style={styles.txMeta}>
          <Text style={[styles.txAmount, { color: isCredit ? '#10B981' : colors.text }]}>
            {isCredit ? '+' : '-'} ₹{item.amount}
          </Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.status === 'Completed' ? '#E8F5E9' : '#FFF9C4' }
          ]}>
            <Text style={[
              styles.statusText, 
              { color: item.status === 'Completed' ? '#10B981' : '#F59E0B' }
            ]}>
              {item.status}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4].map((i) => (
        <RNAnimated.View key={i} style={[styles.skeletonCard, { opacity: shimmerAnim }]} />
      ))}
    </View>
  );

  // Return the main content or placeholder overlay screen
  if (placeholderView) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
        <Animated.View entering={FadeInUp.duration(300)} style={styles.header}>
          <TouchableOpacity onPress={() => setPlaceholderView(null)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{placeholderView.label}</Text>
          <View style={{ width: 32 }} />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.duration(400)} style={styles.placeholderContainer}>
          <Ionicons name={placeholderView.icon} size={80} color={placeholderView.color} />
          <Text style={styles.placeholderTitle}>{placeholderView.label}</Text>
          <Text style={styles.placeholderSubtitle}>
            This module is being processed and will be integrated with backend services soon.
          </Text>
          <TouchableOpacity 
            style={[styles.placeholderBackBtn, { backgroundColor: placeholderView.color }]} 
            onPress={() => setPlaceholderView(null)}
          >
            <Text style={styles.placeholderBackBtnText}>Back to Wallet</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      
      {/* Header Navigation */}
      <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View style={{ width: 32 }} />
      </Animated.View>

      <FlashList
        data={loading ? [] : filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        estimatedItemSize={90}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            
            {/* 1. WALLET HEADER CARD */}
            <Animated.View entering={ZoomIn.delay(150).duration(500)} style={[styles.premiumWalletCard, theme.shadows.soft]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.userLabel}>WALLET OWNER</Text>
                  <Text style={styles.userName}>{user?.username || 'Guest Artist'}</Text>
                </View>
                <Ionicons name="sparkles" size={24} color="#FFF" style={styles.sparkleIcon} />
              </View>

              <Text style={styles.premiumBalanceLabel}>AVAILABLE BALANCE</Text>
              <Text style={styles.premiumBalance}>₹850.00</Text>

              <View style={styles.premiumMetaRow}>
                <View>
                  <Text style={styles.premiumMetaLabel}>Cashback</Text>
                  <Text style={styles.premiumMetaValue}>₹{analytics.cashback}.00</Text>
                </View>
                <View style={styles.premiumMetaDivider} />
                <View>
                  <Text style={styles.premiumMetaLabel}>Reward Points</Text>
                  <Text style={styles.premiumMetaValue}>{analytics.rewards} pts</Text>
                </View>
              </View>

              <Text style={styles.lastUpdatedText}>Last Updated: Just now</Text>
            </Animated.View>

            {/* 2. WALLET SUMMARY GRID */}
            <Text style={styles.sectionHeaderTitle}>Wallet Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={[styles.summaryCard, theme.shadows.soft]}>
                <Ionicons name="wallet-outline" size={20} color={colors.primary} />
                <Text style={styles.summaryTitle}>Balance</Text>
                <Text style={styles.summaryValue}>₹850</Text>
              </View>
              <View style={[styles.summaryCard, theme.shadows.soft]}>
                <Ionicons name="cash-outline" size={20} color="#10B981" />
                <Text style={styles.summaryTitle}>Cashback</Text>
                <Text style={styles.summaryValue}>₹{analytics.cashback}</Text>
              </View>
              <View style={[styles.summaryCard, theme.shadows.soft]}>
                <Ionicons name="gift-outline" size={20} color="#F59E0B" />
                <Text style={styles.summaryTitle}>Rewards</Text>
                <Text style={styles.summaryValue}>{analytics.rewards} pts</Text>
              </View>
              <View style={[styles.summaryCard, theme.shadows.soft]}>
                <Ionicons name="receipt-outline" size={20} color="#3B82F6" />
                <Text style={styles.summaryTitle}>Total Tx</Text>
                <Text style={styles.summaryValue}>{analytics.count}</Text>
              </View>
            </View>

            {/* 3. QUICK ACTIONS */}
            <Text style={styles.sectionHeaderTitle}>Quick Actions</Text>
            <View style={styles.quickActionsRow}>
              {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity 
                  key={action.id} 
                  style={styles.quickActionBtn}
                  onPress={() => setPlaceholderView(action)}
                >
                  <View style={[styles.quickActionIconWrap, { backgroundColor: action.color + '15' }]}>
                    <Ionicons name={action.icon} size={22} color={action.color} />
                  </View>
                  <Text style={styles.quickActionLabel} numberOfLines={2}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 4. MONTHLY ANALYTICS */}
            <Text style={styles.sectionHeaderTitle}>Monthly Analytics</Text>
            <View style={styles.analyticsWrapper}>
              <View style={[styles.analyticsCard, { borderLeftColor: '#10B981' }]}>
                <Text style={styles.analyticsCardLabel}>Total Cashback</Text>
                <Text style={[styles.analyticsCardValue, { color: '#10B981' }]}>+ ₹{analytics.cashback}</Text>
              </View>
              <View style={[styles.analyticsCard, { borderLeftColor: '#F59E0B' }]}>
                <Text style={styles.analyticsCardLabel}>Total Rewards</Text>
                <Text style={[styles.analyticsCardValue, { color: '#F59E0B' }]}>{analytics.rewards} pts</Text>
              </View>
              <View style={[styles.analyticsCard, { borderLeftColor: '#EF4444' }]}>
                <Text style={styles.analyticsCardLabel}>Wallet Used</Text>
                <Text style={[styles.analyticsCardValue, { color: '#EF4444' }]}>- ₹{analytics.debit}</Text>
              </View>
              <View style={[styles.analyticsCard, { borderLeftColor: '#3B82F6' }]}>
                <Text style={styles.analyticsCardLabel}>Total Transactions</Text>
                <Text style={[styles.analyticsCardValue, { color: '#3B82F6' }]}>{analytics.count} items</Text>
              </View>
            </View>

            {/* 5. SEARCH & FILTERS */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, amount, date, type..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersWrapper}>
              {FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text style={[styles.filterChipText, activeFilter === filter && styles.activeFilterChipText]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionHeaderTitle}>Transaction History</Text>
          </Animated.View>
        }
        ListEmptyComponent={
          loading ? renderSkeleton() : (
            <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={70} color={colors.textMuted || '#9CA3AF'} />
              <Text style={styles.emptyText}>No Transactions Found</Text>
              <Text style={styles.emptySubtitle}>
                No wallet transactions match your selected filter yet.
              </Text>
            </Animated.View>
          )
        }
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  premiumWalletCard: {
    backgroundColor: '#0F172A',
    borderRadius: theme.borderRadius.lg + 4,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  userLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  userName: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  sparkleIcon: {
    opacity: 0.8,
  },
  premiumBalanceLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: theme.spacing.sm,
  },
  premiumBalance: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: theme.spacing.md,
  },
  premiumMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#334155',
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  premiumMetaLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '600',
  },
  premiumMetaValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  premiumMetaDivider: {
    width: 1,
    height: 25,
    backgroundColor: '#334155',
    marginHorizontal: theme.spacing.xl,
  },
  lastUpdatedText: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '500',
    alignSelf: 'flex-end',
    marginTop: theme.spacing.xs,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.2,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  summaryTitle: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '800',
    marginTop: 2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  quickActionBtn: {
    width: (width - 48) / 4 - 8,
    alignItems: 'center',
  },
  quickActionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  analyticsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  analyticsCard: {
    width: '47%',
    backgroundColor: colors.grayLight,
    borderLeftWidth: 3,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    paddingLeft: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  analyticsCardLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  analyticsCardValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.md,
    height: 44,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    marginLeft: theme.spacing.sm,
    fontWeight: '500',
  },
  filtersWrapper: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: colors.white,
    fontWeight: '700',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: theme.spacing.md,
  },
  txIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  txDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  txTime: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 4,
  },
  txMeta: {
    alignItems: 'flex-end',
    marginLeft: theme.spacing.sm,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    fontSize: 8,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: 15,
    color: colors.text,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: theme.spacing.lg,
  },
  skeletonContainer: {
    marginTop: theme.spacing.sm,
  },
  skeletonCard: {
    height: 76,
    backgroundColor: '#E5E7EB',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl * 1.5,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: theme.spacing.md,
  },
  placeholderSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  placeholderBackBtn: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: 12,
    borderRadius: 25,
  },
  placeholderBackBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default WalletScreen;
