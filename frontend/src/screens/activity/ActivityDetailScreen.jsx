import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  HelpCircle,
  Info,
  MapPin,
  Share2,
  Ticket,
  User,
  Users,
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Share, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBadge from '../../components/activity/StatusBadge';
import ActivityTimeline from '../../components/activity/ActivityTimeline';
import { colors } from '../../constants/colors';
import { MOCK_ACTIVITIES } from '../../constants/activityData';
import { borderRadius, spacing, shadows } from '../../constants/spacing';
import api from '../../services/api';

export const ActivityDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { activityId } = route.params;

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      if (activityId && activityId.startsWith('DB-ORDER-')) {
        const orderIdNumeric = activityId.replace('DB-ORDER-', '');
        try {
          const response = await api.get('/orders');
          if (response.data && response.data.success) {
            const order = response.data.orders.find(o => o.id.toString() === orderIdNumeric);
            if (order) {
              const mainItem = order.items && order.items[0]
                ? order.items[0]
                : { name: 'Art Supply Purchase', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400' };

              const totalQty = order.items
                ? order.items.reduce((sum, item) => sum + item.quantity, 0)
                : 1;

              const title = totalQty > 1
                ? `${mainItem.name} (+${totalQty - 1} items)`
                : mainItem.name;

              setActivity({
                id: `DB-ORDER-${order.id}`,
                type: 'store_order',
                title,
                subtitle: `ORD-WOO-${order.id}`,
                date: order.created_at ? order.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
                status: order.status || 'pending',
                price: `$${parseFloat(order.grand_total).toFixed(2)}`,
                orderId: `ORD-WOO-${order.id}`,
                image: mainItem.image || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400',
                items: order.items,
                shippingAddress: order.shipping_address,
                customerName: order.customer_name,
                dbOrderId: order.id,
                isDbOrder: true,
              });
            }
          }
        } catch (err) {
          console.warn('Error loading order detail from API:', err);
        }
      } else {
        const mockAct = MOCK_ACTIVITIES.find((act) => act.id === activityId);
        setActivity(mockAct || null);
      }
      setLoading(false);
    };

    loadDetail();
  }, [activityId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.primary || '#000'} />
      </View>
    );
  }

  if (!activity) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Activity not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my activity at WOOWOO Art House: ${activity.title} (${activity.status})`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleSupportPress = () => {
    alert(`Connecting with Art House support regarding ID: ${activity.id}...`);
  };

  // Render type-specific detail sections
  const renderDetailSection = () => {
    switch (activity.type) {
      case 'store_order':
        return (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.infoCard}>
            <Text style={styles.infoTitle}>Order Details</Text>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ticket size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Order ID</Text>
              </View>
              <Text style={styles.infoValue}>{activity.orderId}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <DollarSign size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Total Price</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.primary, fontWeight: '700' }]}>
                {activity.price}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <CreditCard size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Payment</Text>
              </View>
              <Text style={styles.infoValue}>Apple Pay (•••• 4920)</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MapPin size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Shipment</Text>
              </View>
              <Text style={styles.infoValue}>128 Art District, NY</Text>
            </View>
          </Animated.View>
        );

      case 'space_booking':
        return (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.infoCard}>
            <Text style={styles.infoTitle}>Reservation Details</Text>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Calendar size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Date</Text>
              </View>
              <Text style={styles.infoValue}>{activity.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Time Slot</Text>
              </View>
              <Text style={styles.infoValue}>{activity.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Users size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Guests</Text>
              </View>
              <Text style={styles.infoValue}>{activity.guests} Attendees</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <DollarSign size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Amount Paid</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.primary, fontWeight: '700' }]}>
                {activity.price}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MapPin size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Location</Text>
              </View>
              <Text style={styles.infoValue}>WOOWOO Main Gallery Loft B</Text>
            </View>
          </Animated.View>
        );

      case 'service_request':
        return (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.infoCard}>
            <Text style={styles.infoTitle}>Service & Request Details</Text>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <User size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Assigned Staff</Text>
              </View>
              <Text style={styles.infoValue}>{activity.assignedStaff || 'Assigning soon...'}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Calendar size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Submission Date</Text>
              </View>
              <Text style={styles.infoValue}>{activity.date}</Text>
            </View>
            <View style={styles.descriptionSection}>
              <Text style={styles.descLabel}>Request Description</Text>
              <Text style={styles.descContent}>{activity.description}</Text>
            </View>
          </Animated.View>
        );

      case 'event_workshop':
        return (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.infoCard}>
            <Text style={styles.infoTitle}>Workshop Details</Text>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <User size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Instructor</Text>
              </View>
              <Text style={styles.infoValue}>{activity.instructor}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Calendar size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Date</Text>
              </View>
              <Text style={styles.infoValue}>{activity.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Time</Text>
              </View>
              <Text style={styles.infoValue}>{activity.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MapPin size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Venue</Text>
              </View>
              <Text style={styles.infoValue}>Workshop Studio 3, Ground Floor</Text>
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: activity.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Floating Actions on top of image */}
          <SafeAreaView style={styles.floatingHeader} edges={['top']}>
            <TouchableOpacity style={[styles.floatingBtn, shadows.soft]} onPress={() => navigation.goBack()}>
              <ArrowLeft size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.floatingBtn, shadows.soft]} onPress={handleShare}>
              <Share2 size={20} color={colors.text} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Header Title Row */}
          <Animated.View entering={FadeInUp.duration(500)}>
            <View style={styles.badgeRow}>
              <StatusBadge status={activity.status} />
              <Text style={styles.typeText}>{activity.type.replace('_', ' ')}</Text>
            </View>
            <Text style={styles.title}>{activity.title}</Text>
            <Text style={styles.subtitle}>{activity.subtitle}</Text>
          </Animated.View>

          {/* Type Specific Fields */}
          {renderDetailSection()}

          {/* Notes Section */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.notesContainer}>
            <View style={styles.notesHeader}>
              <Info size={16} color={colors.primary} />
              <Text style={styles.notesTitle}>Important Information</Text>
            </View>
            <Text style={styles.notesBody}>
              Please note: Standard processing times may vary. If you require urgent assistance, please contact the studio direct line. Ensure your tickets or QR access passes are cached offline for check-in.
            </Text>
          </Animated.View>

          {/* Timeline Section */}
          <ActivityTimeline status={activity.status} type={activity.type} dateString={activity.date} />

          {/* Contact Support Button */}
          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.supportBtnContainer}>
            <TouchableOpacity
              onPress={handleSupportPress}
              style={[styles.supportBtn, shadows.premium]}
              activeOpacity={0.9}
            >
              <HelpCircle size={20} color={colors.white} style={{ marginRight: spacing.sm }} />
              <Text style={styles.supportBtnText}>Need Help with this Activity?</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  heroSection: {
    position: 'relative',
    height: 280,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  floatingHeader: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  floatingBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.xl,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  infoValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right',
  },
  descriptionSection: {
    marginTop: spacing.md,
  },
  descLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: 4,
  },
  descContent: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  notesContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    marginBottom: spacing.md,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  notesBody: {
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 18,
    fontWeight: '600',
  },
  supportBtnContainer: {
    marginTop: spacing.xl,
  },
  supportBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
  },
  backBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  backBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ActivityDetailScreen;
