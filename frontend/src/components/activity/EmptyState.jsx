import { Inbox, Compass } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { borderRadius, shadows, spacing } from '../../constants/spacing';

export const EmptyState = ({
  title = 'No Activities Found',
  subtitle = 'Try adjusting your filters or explore our art gallery and shop to make a purchase.',
  onExplorePress,
}) => {
  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <Animated.View
        entering={SlideInDown.delay(100).duration(600).springify().damping(15)}
        style={[styles.box, shadows.soft]}
      >
        <View style={styles.iconContainer}>
          <Inbox size={48} color={colors.primary} strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {onExplorePress && (
          <TouchableOpacity
            style={[styles.button, shadows.premium]}
            onPress={onExplorePress}
            activeOpacity={0.9}
          >
            <Compass size={18} color={colors.white} style={styles.btnIcon} />
            <Text style={styles.btnText}>Explore Art House</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxxl,
  },
  box: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xxl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xxl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    height: 48,
    borderRadius: borderRadius.round,
  },
  btnIcon: {
    marginRight: spacing.sm,
  },
  btnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default EmptyState;
