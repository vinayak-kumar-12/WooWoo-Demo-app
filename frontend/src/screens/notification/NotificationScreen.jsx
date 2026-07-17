import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Order Confirmed 🛍️',
    body: 'Your order #WOO-9081 has been successfully confirmed and is being prepared.',
    time: '2 hours ago',
    unread: true,
    icon: 'bag-handle-outline',
    iconColor: colors.primary || '#1A1A1A',
  },
  {
    id: '2',
    title: 'Workshop Tomorrow 🎨',
    body: 'Reminder: The Creative Watercolor kit workshop starts tomorrow at 10:00 AM. Get your supplies ready!',
    time: '5 hours ago',
    unread: true,
    icon: 'calendar-outline',
    iconColor: '#10B981',
  },
  {
    id: '3',
    title: 'Space Booking Approved 🏢',
    body: 'Your booking request for Studio Space A has been approved for July 20th.',
    time: '1 day ago',
    unread: false,
    icon: 'key-outline',
    iconColor: '#3B82F6',
  },
  {
    id: '4',
    title: 'Cashback Received 💰',
    body: 'Congratulations! You earned ₹50 cashback on your last store purchase.',
    time: '2 days ago',
    unread: false,
    icon: 'cash-outline',
    iconColor: '#F59E0B',
  },
];

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const markAllRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.notificationCard, item.unread && styles.unreadCard]}>
      <View style={[styles.iconContainer, { backgroundColor: item.iconColor + '15' }]}>
        <Ionicons name={item.icon} size={22} color={item.iconColor} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, item.unread && styles.unreadText]}>{item.title}</Text>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead} style={styles.markReadButton}>
          <Text style={styles.markReadText}>Mark Read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color={colors.textMuted} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
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
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
  },
  markReadButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markReadText: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  listContainer: {
    paddingVertical: theme.spacing.sm,
  },
  notificationCard: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  unreadCard: {
    backgroundColor: colors.primary + '05',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semibold,
    color: colors.text,
  },
  unreadText: {
    fontWeight: theme.typography.fontWeights.bold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  body: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  time: {
    fontSize: theme.typography.fontSizes.xs,
    color: colors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: colors.textMuted,
    fontWeight: theme.typography.fontWeights.medium,
  },
});

export default NotificationScreen;
