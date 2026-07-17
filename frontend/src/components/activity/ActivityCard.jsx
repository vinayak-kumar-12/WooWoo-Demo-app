import React, { useRef } from 'react';
import { Image, StyleSheet, Text, Pressable, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { ChevronRight, ShoppingBag, MapPin, Hammer, Sparkles, MoreHorizontal, Eye } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { borderRadius, shadows, spacing } from '../../constants/spacing';
import StatusBadge from './StatusBadge';

const typeConfigs = {
  store_order: {
    icon: ShoppingBag,
    color: colors.primary,
    bgColor: colors.primaryLight,
  },
  space_booking: {
    icon: MapPin,
    color: colors.status.confirmed.text,
    bgColor: colors.status.confirmed.bg,
  },
  service_request: {
    icon: Hammer,
    color: colors.status.in_progress.text,
    bgColor: colors.status.in_progress.bg,
  },
  event_workshop: {
    icon: Sparkles,
    color: colors.status.pending.text,
    bgColor: colors.status.pending.bg,
  },
};

export const ActivityCard = ({
  activity,
  onPress,
  onActionTrigger,
  index,
}) => {
  const swipeableRef = useRef(null);
  const scale = useSharedValue(1);
  const config = typeConfigs[activity.type];
  const Icon = config.icon;

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const getPrimaryActionLabel = () => {
    switch (activity.type) {
      case 'store_order':
        return 'Track';
      case 'space_booking':
        return 'Directions';
      case 'service_request':
        return 'Contact';
      case 'event_workshop':
        return 'Ticket';
      default:
        return 'Action';
    }
  };

  const renderRightActions = () => {
    return (
      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.primaryActionBtn,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => {
            swipeableRef.current?.close();
            onActionTrigger(getPrimaryActionLabel().toLowerCase());
          }}
        >
          <Eye size={18} color={colors.white} />
          <Text style={styles.actionBtnText}>{getPrimaryActionLabel()}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.moreActionBtn,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => {
            swipeableRef.current?.close();
            onActionTrigger('more');
          }}
        >
          <MoreHorizontal size={18} color={colors.text} />
          <Text style={[styles.actionBtnText, { color: colors.text }]}>More</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(500)}
      style={[styles.shadowWrapper, shadows.soft]}
    >
      <View style={styles.outerContainer}>
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          friction={2}
          rightThreshold={40}
          overshootRight={false}
        >
          <Animated.View style={[styles.card, animatedStyle]}>
            <Pressable
              onPress={onPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={styles.innerContainer}
            >
              {/* Left Image / Icon Container */}
              <View style={styles.imageWrapper}>
                {activity.image ? (
                  <Image
                    source={{ uri: activity.image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
                    <Icon size={24} color={config.color} />
                  </View>
                )}
                <View style={[styles.typeBadge, { backgroundColor: config.color }]}>
                  <Icon size={10} color={colors.white} />
                </View>
              </View>

              {/* Middle Content */}
              <View style={styles.contentContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.title} numberOfLines={1}>
                    {activity.title}
                  </Text>
                  {activity.price && (
                    <Text style={styles.priceText}>{activity.price}</Text>
                  )}
                </View>

                <Text style={styles.subtitle} numberOfLines={1}>
                  {activity.subtitle}
                </Text>

                <View style={styles.footerRow}>
                  <Text style={styles.dateText}>
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                  <StatusBadge status={activity.status} />
                </View>
              </View>

              {/* Right Chevron */}
              <ChevronRight size={18} color={colors.textMuted} style={styles.chevron} />
            </Pressable>
          </Animated.View>
        </Swipeable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.md,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  outerContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  card: {
    backgroundColor: colors.white,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: spacing.md,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    width: 150,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: spacing.sm,
  },
  primaryActionBtn: {
    backgroundColor: colors.primary,
  },
  moreActionBtn: {
    backgroundColor: colors.border,
  },
  actionBtnText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
});

export default ActivityCard;
