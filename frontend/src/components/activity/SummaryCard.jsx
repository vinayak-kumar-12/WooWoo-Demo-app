import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInRight,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { borderRadius, shadows, spacing } from '../../constants/spacing';
import * as LucideIcons from 'lucide-react-native';

const cardConfigs = {
  total: {
    iconName: 'Activity',
    color: colors.primary,
    bgColor: colors.primaryLight,
  },
  pending: {
    iconName: 'Clock',
    color: colors.status.pending.text,
    bgColor: colors.status.pending.bg,
  },
  completed: {
    iconName: 'CheckCircle2',
    color: colors.status.completed.text,
    bgColor: colors.status.completed.bg,
  },
  cancelled: {
    iconName: 'XCircle',
    color: colors.status.cancelled.text,
    bgColor: colors.status.cancelled.bg,
  },
};

export const SummaryCard = ({
  type,
  count,
  label,
  isActive,
  onPress,
  index,
}) => {
  const config = cardConfigs[type];
  const Icon = LucideIcons[config.iconName];
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
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
      entering={FadeInRight.delay(index * 100).duration(500)}
      style={[
        styles.shadowWrapper,
        shadows.soft,
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.cardContainer,
          isActive ? styles.activeCard : styles.inactiveCard,
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.pressable}
        >
          <View style={[styles.headerRow, { backgroundColor: config.bgColor }]}>
            {Icon && <Icon size={18} color={config.color} strokeWidth={2.5} />}
          </View>
          <Text style={styles.countText}>{count}</Text>
          <Text style={styles.labelText}>{label}</Text>
          {isActive && <View style={[styles.activeIndicator, { backgroundColor: config.color }]} />}
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    width: 110,
    height: 120,
    marginRight: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: 'transparent',
  },
  cardContainer: {
    flex: 1,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
  },
  activeCard: {
    borderColor: colors.primary,
  },
  inactiveCard: {
    borderColor: 'transparent',
  },
  pressable: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  headerRow: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.xs,
  },
  labelText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default SummaryCard;
