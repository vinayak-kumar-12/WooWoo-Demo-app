import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { borderRadius, spacing } from '../../constants/spacing';

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const StatusBadge = ({ status }) => {
  const stylesForStatus = colors.status[status] || colors.status.pending;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.badge,
        {
          backgroundColor: stylesForStatus.bg,
          borderColor: stylesForStatus.border,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: stylesForStatus.text }]} />
      <Text style={[styles.text, { color: stylesForStatus.text }]}>
        {statusLabels[status]}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default StatusBadge;
