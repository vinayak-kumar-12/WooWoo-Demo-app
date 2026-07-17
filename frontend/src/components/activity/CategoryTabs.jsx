import React, { useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInRight,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { borderRadius, spacing, shadows } from '../../constants/spacing';

const TABS = [
  'All',
  'Store Orders',
  'Space Bookings',
  'Service Requests',
  'Events & Workshops',
];

const TabChip = ({ label, isActive, onPress, index }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50).duration(400)}
      style={animatedStyle}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.chip,
          isActive ? styles.chipActive : styles.chipInactive,
          isActive && shadows.soft,
        ]}
        activeOpacity={0.9}
      >
        <Text style={[styles.chipText, isActive ? styles.textActive : styles.textInactive]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const CategoryTabs = ({
  selectedTab,
  onTabSelect,
}) => {
  const scrollViewRef = useRef(null);

  // Auto scroll selected tab to view
  useEffect(() => {
    const selectedIndex = TABS.indexOf(selectedTab);
    if (selectedIndex !== -1 && scrollViewRef.current) {
      // Estimate offset
      const approxOffset = selectedIndex * 110;
      scrollViewRef.current.scrollTo({ x: Math.max(0, approxOffset - 80), animated: true });
    }
  }, [selectedTab]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TABS.map((tab, index) => (
        <TabChip
          key={tab}
          label={tab}
          isActive={selectedTab === tab}
          onPress={() => onTabSelect(tab)}
          index={index}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: spacing.lg,
    height: 40,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipInactive: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  textActive: {
    color: colors.white,
  },
  textInactive: {
    color: colors.textSecondary,
  },
});

export default CategoryTabs;
