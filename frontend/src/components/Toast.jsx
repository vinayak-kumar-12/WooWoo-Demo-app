import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../utils/colors';
import { theme } from '../utils/theme';

/**
 * Premium custom Toast notification component.
 * Uses react-native-reanimated spring physics for smooth entrance/exit.
 */
const Toast = ({ message, type = 'success', onDismiss }) => {
  const translateY = useSharedValue(-100);

  useEffect(() => {
    // Entrance animation
    translateY.value = withSpring(40, { damping: 15, stiffness: 100 });

    // Auto dismiss timer
    const timer = setTimeout(() => {
      // Exit animation
      translateY.value = withTiming(-100, { duration: 300 }, () => {
        if (onDismiss) {
          runOnJS(onDismiss)();
        }
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [translateY, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const isSuccess = type === 'success';

  return (
    <Animated.View
      style={[
        styles.container,
        isSuccess ? styles.successContainer : styles.errorContainer,
        theme.shadows.medium,
        animatedStyle,
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.indicator, isSuccess ? styles.successIndicator : styles.errorIndicator]} />
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: '8%',
    right: '8%',
    backgroundColor: '#1E293B', // Sleek dark charcoal
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    zIndex: 9999,
  },
  successContainer: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  errorContainer: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  successIndicator: {
    backgroundColor: colors.success,
  },
  errorIndicator: {
    backgroundColor: colors.error,
  },
  messageText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});

export default Toast;
