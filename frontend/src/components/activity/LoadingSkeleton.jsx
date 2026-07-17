import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { colors } from '../../constants/colors';
import { borderRadius, spacing } from '../../constants/spacing';

export const LoadingSkeleton = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Summary Cards Shimmer */}
        <View style={styles.summaryContainer}>
          {[1, 2, 3, 4].map((i) => (
            <Animated.View key={i} style={[styles.summaryCard, { opacity: fadeAnim }]} />
          ))}
        </View>

        {/* Search Bar Shimmer */}
        <View style={styles.searchBarContainer}>
          <Animated.View style={[styles.searchBar, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.filterBtn, { opacity: fadeAnim }]} />
        </View>

        {/* Category Tabs Shimmer */}
        <View style={styles.tabsContainer}>
          {[1, 2, 3, 4].map((i) => (
            <Animated.View key={i} style={[styles.tabChip, { width: i % 2 === 0 ? 100 : 70, opacity: fadeAnim }]} />
          ))}
        </View>

        {/* Activity Cards Shimmer */}
        <View style={styles.listContainer}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.card}>
              <Animated.View style={[styles.avatar, { opacity: fadeAnim }]} />
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Animated.View style={[styles.title, { opacity: fadeAnim }]} />
                  <Animated.View style={[styles.price, { opacity: fadeAnim }]} />
                </View>
                <Animated.View style={[styles.subtitle, { opacity: fadeAnim }]} />
                <View style={styles.footerRow}>
                  <Animated.View style={[styles.date, { opacity: fadeAnim }]} />
                  <Animated.View style={[styles.badge, { opacity: fadeAnim }]} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    marginVertical: spacing.md,
  },
  summaryCard: {
    width: 110,
    height: 120,
    backgroundColor: '#E5E7EB',
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
  },
  searchBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    marginVertical: spacing.md,
  },
  searchBar: {
    flex: 1,
    height: 52,
    backgroundColor: '#E5E7EB',
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
  },
  filterBtn: {
    width: 52,
    height: 52,
    backgroundColor: '#E5E7EB',
    borderRadius: borderRadius.xl,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
  },
  tabChip: {
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
  },
  listContainer: {
    paddingHorizontal: spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    height: 92,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: '#E5E7EB',
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    width: '60%',
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  price: {
    width: '20%',
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  subtitle: {
    width: '40%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  date: {
    width: '30%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  badge: {
    width: '25%',
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
  },
});

export default LoadingSkeleton;
