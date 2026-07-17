import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Bell } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  FadeInUp,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

export const ActivityHeader = ({
  unreadCount = 2,
  onNotificationPress,
}) => {
  const navigation = useNavigation();
  const bellRotation = useSharedValue(0);

  // Animate bell on load to catch user's eye
  useEffect(() => {
    const timer = setTimeout(() => {
      bellRotation.value = withSequence(
        withTiming(-15, { duration: 100 }),
        withTiming(15, { duration: 150 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 150 })
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const triggerBellShake = () => {
    bellRotation.value = withSequence(
      withTiming(-20, { duration: 80 }),
      withTiming(20, { duration: 120 }),
      withTiming(-15, { duration: 80 }),
      withTiming(15, { duration: 80 }),
      withTiming(0, { duration: 120 })
    );
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  const bellAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${bellRotation.value}deg` }],
    };
  });

  return (
    <Animated.View 
      entering={FadeInUp.duration(600).springify().damping(15)} 
      style={styles.container}
    >
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bellButton}
          onPress={triggerBellShake}
          activeOpacity={0.7}
        >
          <Animated.View style={bellAnimatedStyle}>
            <Bell size={24} color={colors.text} />
          </Animated.View>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>My Activity</Text>
      <Text style={styles.subtitle}>
        Track your orders, bookings, services and workshops.
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
});

export default ActivityHeader;
