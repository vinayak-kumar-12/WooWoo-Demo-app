import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Info,
  MapPin,
  Share2,
  Star,
  User,
  Users,
} from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Share } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { borderRadius, spacing, shadows } from '../../constants/spacing';
import {
  EXPLORE_PRODUCTS,
  EXPLORE_SPACES,
  EXPLORE_SERVICES,
  EXPLORE_EVENTS,
} from '../../constants/exploreData';

export const ExploreDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type, id } = route.params || {};

  // Find item by type and id
  let item = null;
  if (type === 'product') {
    item = EXPLORE_PRODUCTS.find((p) => p.id === id);
  } else if (type === 'space') {
    item = EXPLORE_SPACES.find((s) => s.id === id);
  } else if (type === 'service') {
    item = EXPLORE_SERVICES.find((s) => s.id === id);
  } else if (type === 'event') {
    item = EXPLORE_EVENTS.find((e) => e.id === id);
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Item not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${item.name || item.title}" at WOOWOO Art House!`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleActionPress = () => {
    let actionLabel = 'Action';
    if (type === 'product') actionLabel = 'Purchase Product';
    else if (type === 'space') actionLabel = 'Reserve Space';
    else if (type === 'service') actionLabel = 'Submit Inquiry';
    else if (type === 'event') actionLabel = 'Book Ticket';

    alert(`${actionLabel} initiated for "${item.name || item.title}"`);
  };

  const renderContent = () => {
    switch (type) {
      case 'product':
        return (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.infoCard}>
            <Text style={styles.infoTitle}>Product Specifications</Text>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Info size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Category</Text>
              </View>
              <Text style={styles.infoValue}>{item.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Star size={16} color="#F59E0B" />
                <Text style={styles.infoLabel}>Rating</Text>
              </View>
              <Text style={styles.infoValue}>{item.rating} / 5.0</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <DollarSign size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Price</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.primary, fontWeight: '700' }]}>
                {item.price}
              </Text>
            </View>
          </Animated.View>
        );

      case 'space':
        return (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.infoCard}>
            <Text style={styles.infoTitle}>Space details</Text>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Users size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Capacity</Text>
              </View>
              <Text style={styles.infoValue}>{item.capacity}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Access</Text>
              </View>
              <Text style={styles.infoValue}>{item.duration}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Info size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Status</Text>
              </View>
              <Text style={[styles.infoValue, { color: '#10B981', fontWeight: '600' }]}>
                {item.availability}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <DollarSign size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Pricing</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.primary, fontWeight: '700' }]}>
                {item.price}
              </Text>
            </View>
          </Animated.View>
        );

      case 'service':
        return (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.infoCard}>
            <Text style={styles.infoTitle}>Service Information</Text>
            <View style={styles.divider} />
            <Text style={styles.serviceLongDetails}>{item.details}</Text>
          </Animated.View>
        );

      case 'event':
        return (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.infoCard}>
            <Text style={styles.infoTitle}>Workshop Details</Text>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <User size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Instructor</Text>
              </View>
              <Text style={styles.infoValue}>{item.instructor}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Calendar size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Date</Text>
              </View>
              <Text style={styles.infoValue}>{item.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Time</Text>
              </View>
              <Text style={styles.infoValue}>{item.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Users size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Seats Left</Text>
              </View>
              <Text style={[styles.infoValue, { color: '#EF4444', fontWeight: '700' }]}>
                {item.seats} seats
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <DollarSign size={16} color={colors.textSecondary} />
                <Text style={styles.infoLabel}>Admission</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.primary, fontWeight: '700' }]}>
                {item.price}
              </Text>
            </View>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {item.name || item.title}
        </Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={20} color={colors.text} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Image (If available) */}
        {item.image && (
          <Animated.View entering={FadeInDown.duration(500)} style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.heroImage} />
          </Animated.View>
        )}

        <View style={styles.detailsContainer}>
          {/* Title & Tag */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryText}>
                {type.toUpperCase()} • {item.category || 'WOOWOO EXCLUSIVE'}
              </Text>
            </View>
            <Text style={styles.mainTitle}>{item.name || item.title}</Text>
          </Animated.View>

          {/* Type-Specific Content */}
          {renderContent()}

          {/* Description Section */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.descCard}>
            <Text style={styles.descTitle}>Description</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Bottom Bar with Primary Action */}
      <Animated.View entering={FadeInUp.delay(400).duration(500)} style={[styles.bottomBar, shadows.soft]}>
        <View style={styles.bottomBarPriceInfo}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>{item.price || 'Inquiry'}</Text>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleActionPress}>
          <Text style={styles.primaryBtnText}>
            {type === 'product' && 'Buy Now'}
            {type === 'space' && 'Book Space'}
            {type === 'service' && 'Send Enquiry'}
            {type === 'event' && 'Book Now'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.soft,
  },
  heroImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailsContainer: {
    paddingHorizontal: spacing.lg,
  },
  categoryRow: {
    marginBottom: spacing.xs,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  serviceLongDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  descCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBarPriceInfo: {
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
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

export default ExploreDetailScreen;
