import { Check, Clock, Package, HelpCircle } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  FadeInRight,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { borderRadius, spacing, shadows } from '../../constants/spacing';

const timelineSteps = {
  store_order: [
    { key: 'pending', title: 'Order Placed', desc: 'We have received your order.', icon: Clock },
    { key: 'confirmed', title: 'Order Confirmed', desc: 'Seller accepted and packaging.', icon: Check },
    { key: 'in_progress', title: 'In Transit', desc: 'Item is shipped and on the way.', icon: Package },
    { key: 'completed', title: 'Delivered', desc: 'Item has been delivered successfully.', icon: Check },
  ],
  space_booking: [
    { key: 'pending', title: 'Booking Request', desc: 'Request submitted.', icon: Clock },
    { key: 'confirmed', title: 'Approved & Scheduled', desc: 'Host accepted.', icon: Check },
    { key: 'in_progress', title: 'Checked In', desc: 'Reservation active.', icon: Package },
    { key: 'completed', title: 'Completed', desc: 'Reservation ended.', icon: Check },
  ],
  service_request: [
    { key: 'pending', title: 'Request Submitted', desc: 'Analyzing details.', icon: Clock },
    { key: 'confirmed', title: 'Service Confirmed', desc: 'Materials queued.', icon: Check },
    { key: 'in_progress', title: 'Restoration Active', desc: 'Specialist working.', icon: Package },
    { key: 'completed', title: 'Finished & Delivered', desc: 'Piece returned.', icon: Check },
  ],
  event_workshop: [
    { key: 'pending', title: 'Registered', desc: 'Registration received.', icon: Clock },
    { key: 'confirmed', title: 'Access Pass Issued', desc: 'Ready for check-in.', icon: Check },
    { key: 'in_progress', title: 'Workshop Active', desc: 'Event is live.', icon: Package },
    { key: 'completed', title: 'Completed', desc: 'Attended and finished.', icon: Check },
  ],
};

export const ActivityTimeline = ({ status, type, dateString }) => {
  const progressHeight = useSharedValue(0);
  const steps = timelineSteps[type] || timelineSteps.store_order;

  // Determine current active step index
  let activeIndex = 0;
  if (status === 'confirmed') activeIndex = 1;
  else if (status === 'in_progress') activeIndex = 2;
  else if (status === 'completed') activeIndex = 3;
  else if (status === 'cancelled') activeIndex = -1; // Special case

  useEffect(() => {
    if (activeIndex >= 0) {
      // Line connects up to current active step.
      // With 4 steps, there are 3 segments, each 80dp high.
      const targetHeight = activeIndex * 80;
      progressHeight.value = withDelay(500, withSpring(targetHeight, { damping: 15 }));
    } else {
      progressHeight.value = 0;
    }
  }, [activeIndex]);

  const animatedLineStyle = useAnimatedStyle(() => {
    return {
      height: progressHeight.value,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Activity Status History</Text>

      {status === 'cancelled' ? (
        <View style={styles.cancelledContainer}>
          <View style={styles.cancelledDot} />
          <View style={styles.cancelledTextContainer}>
            <Text style={styles.cancelledTitle}>Activity Cancelled</Text>
            <Text style={styles.cancelledDesc}>
              This activity was cancelled. If you believe this was an error, please reach out to customer support.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.timelineWrapper}>
          {/* Vertical Lines */}
          <View style={styles.trackLine} />
          <Animated.View style={[styles.progressLine, animatedLineStyle]} />

          {/* Steps List */}
          {steps.map((step, index) => {
            const isFinished = index < activeIndex;
            const isActive = index === activeIndex;
            const isUpcoming = index > activeIndex;
            const StepIcon = step.icon;

            return (
              <View key={step.key} style={styles.stepRow}>
                {/* Node circle */}
                <View
                  style={[
                    styles.node,
                    isFinished && styles.nodeFinished,
                    isActive && styles.nodeActive,
                    isUpcoming && styles.nodeUpcoming,
                    shadows.soft,
                  ]}
                >
                  <StepIcon
                    size={12}
                    color={
                      isFinished
                        ? colors.white
                        : isActive
                        ? colors.primary
                        : colors.textMuted
                    }
                  />
                </View>

                {/* Step Info */}
                <Animated.View
                  entering={FadeInRight.delay(index * 150).duration(400)}
                  style={styles.textWrapper}
                >
                  <Text
                    style={[
                      styles.stepTitle,
                      isActive && styles.stepTitleActive,
                      isUpcoming && styles.stepTitleUpcoming,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                  {isActive && dateString && (
                    <Text style={styles.stepDate}>{dateString}</Text>
                  )}
                </Animated.View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xl,
  },
  cancelledContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.status.cancelled.bg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.status.cancelled.border,
  },
  cancelledDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.cancelled.text,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  cancelledTextContainer: {
    flex: 1,
  },
  cancelledTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.status.cancelled.text,
    marginBottom: 4,
  },
  cancelledDesc: {
    fontSize: 12,
    color: colors.status.cancelled.text,
    lineHeight: 18,
    fontWeight: '600',
  },
  timelineWrapper: {
    position: 'relative',
    paddingLeft: spacing.xl,
  },
  trackLine: {
    position: 'absolute',
    left: 10,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: colors.border,
  },
  progressLine: {
    position: 'absolute',
    left: 10,
    top: 10,
    width: 2,
    backgroundColor: colors.primary,
  },
  stepRow: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'flex-start',
    position: 'relative',
  },
  node: {
    position: 'absolute',
    left: -18,
    top: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 2,
  },
  nodeFinished: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  nodeActive: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
  },
  nodeUpcoming: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  textWrapper: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  stepTitleActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  stepTitleUpcoming: {
    color: colors.textMuted,
  },
  stepDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stepDate: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default ActivityTimeline;
