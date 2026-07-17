import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import {
  EXPLORE_PRODUCTS,
  EXPLORE_SPACES,
  EXPLORE_SERVICES,
  EXPLORE_EVENTS,
  EXPLORE_RECOMMENDED,
} from '../../constants/exploreData';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Colours & Paints',
    'Brushes & Tools',
    'Canvas & Surfaces',
    'Stationery',
  ];

  // Filtering Logic
  const filteredProducts = EXPLORE_PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredSpaces = EXPLORE_SPACES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = EXPLORE_SERVICES.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = EXPLORE_EVENTS.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSearching = searchQuery.trim().length > 0;
  const hasSearchResults =
    filteredProducts.length > 0 ||
    filteredSpaces.length > 0 ||
    filteredServices.length > 0 ||
    filteredEvents.length > 0;

  // Navigation handlers
  const navigateToDetail = (type, id) => {
    navigation.navigate('ExploreDetail', { type, id });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Discover live exhibitions and trending curations</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          placeholder="Search art supplies, spaces, workshops..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {isSearching && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {isSearching ? (
        // Search Results State
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {!hasSearchResults ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={60} color={colors.textMuted} />
              <Text style={styles.emptyText}>No results found for "{searchQuery}"</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your keywords or category filters.</Text>
            </View>
          ) : (
            <View style={styles.searchResultsContainer}>
              <Text style={styles.searchResultTitle}>Search Results</Text>

              {/* Products Results */}
              {filteredProducts.length > 0 && (
                <View style={styles.searchSection}>
                  <Text style={styles.searchSectionTitle}>Art Supplies & Store ({filteredProducts.length})</Text>
                  {filteredProducts.map((prod) => (
                    <TouchableOpacity
                      key={prod.id}
                      style={styles.searchItemRow}
                      onPress={() => navigateToDetail('product', prod.id)}
                    >
                      <Image source={{ uri: prod.image }} style={styles.searchItemImage} />
                      <View style={styles.searchItemInfo}>
                        <Text style={styles.searchItemCategory}>{prod.category}</Text>
                        <Text style={styles.searchItemName} numberOfLines={1}>{prod.name}</Text>
                        <Text style={styles.searchItemPrice}>{prod.price}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Spaces Results */}
              {filteredSpaces.length > 0 && (
                <View style={styles.searchSection}>
                  <Text style={styles.searchSectionTitle}>Creative Spaces ({filteredSpaces.length})</Text>
                  {filteredSpaces.map((space) => (
                    <TouchableOpacity
                      key={space.id}
                      style={styles.searchItemRow}
                      onPress={() => navigateToDetail('space', space.id)}
                    >
                      <Image source={{ uri: space.image }} style={styles.searchItemImage} />
                      <View style={styles.searchItemInfo}>
                        <Text style={styles.searchItemCategory}>{space.duration}</Text>
                        <Text style={styles.searchItemName} numberOfLines={1}>{space.name}</Text>
                        <Text style={styles.searchItemPrice}>{space.price}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Events Results */}
              {filteredEvents.length > 0 && (
                <View style={styles.searchSection}>
                  <Text style={styles.searchSectionTitle}>Workshops & Events ({filteredEvents.length})</Text>
                  {filteredEvents.map((evt) => (
                    <TouchableOpacity
                      key={evt.id}
                      style={styles.searchItemRow}
                      onPress={() => navigateToDetail('event', evt.id)}
                    >
                      <Image source={{ uri: evt.image }} style={styles.searchItemImage} />
                      <View style={styles.searchItemInfo}>
                        <Text style={styles.searchItemCategory}>{evt.instructor}</Text>
                        <Text style={styles.searchItemName} numberOfLines={1}>{evt.name}</Text>
                        <Text style={styles.searchItemPrice}>{evt.price}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Services Results */}
              {filteredServices.length > 0 && (
                <View style={styles.searchSection}>
                  <Text style={styles.searchSectionTitle}>Art Services ({filteredServices.length})</Text>
                  {filteredServices.map((serv) => (
                    <TouchableOpacity
                      key={serv.id}
                      style={styles.searchItemRow}
                      onPress={() => navigateToDetail('service', serv.id)}
                    >
                      <View style={[styles.searchItemImage, styles.searchIconBox]}>
                        <Ionicons name={serv.icon} size={20} color={colors.primary} />
                      </View>
                      <View style={styles.searchItemInfo}>
                        <Text style={styles.searchItemName} numberOfLines={1}>{serv.title}</Text>
                        <Text style={styles.searchItemDesc} numberOfLines={2}>{serv.description}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      ) : (
        // Standard Discovery Feed
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Featured Gradient Banner */}
          <Animated.View entering={FadeInDown.duration(500)} style={styles.bannerWrapper}>
            <LinearGradient
              colors={[colors.primary, '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bannerContainer}
            >
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerBadge}>SUMMER FESTIVAL</Text>
                <Text style={styles.bannerTitle}>Elevate Your Canvas</Text>
                <Text style={styles.bannerSubtitle}>Get 20% off on premium workshop slots & select canvas paints.</Text>
                <TouchableOpacity
                  style={styles.bannerBtn}
                  onPress={() => navigateToDetail('event', 'event-1')}
                >
                  <Text style={styles.bannerBtnText}>Register Now</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* 1. STORE & SHOPPING */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Art Supplies Shop</Text>
              <Text style={styles.sectionSubtitle}>Premium tools for creators & collectors</Text>
            </View>
          </View>

          {/* Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryPillsScroll}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  activeCategory === cat && styles.activeCategoryPill,
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    activeCategory === cat && styles.activeCategoryPillText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Products Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScroll}
          >
            {filteredProducts.map((prod, index) => (
              <Animated.View
                entering={FadeInDown.delay(index * 100).duration(400)}
                key={prod.id}
                style={[styles.productCard, theme.shadows.soft]}
              >
                <TouchableOpacity activeOpacity={0.9} onPress={() => navigateToDetail('product', prod.id)}>
                  <Image source={{ uri: prod.image }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productCategory}>{prod.category}</Text>
                    <Text style={styles.productName} numberOfLines={1}>{prod.name}</Text>
                    <View style={styles.productRatingRow}>
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text style={styles.productRatingText}>{prod.rating}</Text>
                    </View>
                    <View style={styles.productFooter}>
                      <Text style={styles.productPrice}>{prod.price}</Text>
                      <TouchableOpacity
                        style={styles.shopNowBtn}
                        onPress={() => navigateToDetail('product', prod.id)}
                      >
                        <Text style={styles.shopNowText}>Shop Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>

          {/* 2. SPACE BOOKING */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Creative Spaces</Text>
              <Text style={styles.sectionSubtitle}>Professional art studios & galleries</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScroll}
          >
            {EXPLORE_SPACES.map((space, index) => (
              <Animated.View
                entering={FadeInDown.delay(index * 100).duration(400)}
                key={space.id}
                style={[styles.spaceCard, theme.shadows.soft]}
              >
                <TouchableOpacity activeOpacity={0.9} onPress={() => navigateToDetail('space', space.id)}>
                  <Image source={{ uri: space.image }} style={styles.spaceImage} />
                  <View style={styles.spaceBadgeContainer}>
                    <Text style={styles.spaceBadgeText}>{space.availability}</Text>
                  </View>
                  <View style={styles.spaceInfo}>
                    <Text style={styles.spaceName}>{space.name}</Text>
                    <View style={styles.spaceMetaRow}>
                      <View style={styles.spaceMetaItem}>
                        <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.spaceMetaText}>{space.capacity}</Text>
                      </View>
                      <View style={styles.spaceMetaItem}>
                        <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.spaceMetaText}>{space.duration}</Text>
                      </View>
                    </View>
                    <View style={styles.spaceFooter}>
                      <View>
                        <Text style={styles.priceSub}>Rate</Text>
                        <Text style={styles.spacePrice}>{space.price}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.bookSpaceBtn}
                        onPress={() => navigateToDetail('space', space.id)}
                      >
                        <Text style={styles.bookSpaceText}>Book Space</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>

          {/* 3. SERVICES */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Artistic Services</Text>
              <Text style={styles.sectionSubtitle}>Bespoke framing, custom printing & consulting</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScroll}
          >
            {EXPLORE_SERVICES.map((serv, index) => (
              <Animated.View
                entering={FadeInDown.delay(index * 100).duration(400)}
                key={serv.id}
                style={[styles.serviceCard, theme.shadows.soft]}
              >
                <View style={styles.serviceIconContainer}>
                  <Ionicons name={serv.icon} size={26} color={colors.primary} />
                </View>
                <Text style={styles.serviceTitle}>{serv.title}</Text>
                <Text style={styles.serviceDesc} numberOfLines={3}>{serv.description}</Text>
                <TouchableOpacity
                  style={styles.serviceBtn}
                  onPress={() => navigateToDetail('service', serv.id)}
                >
                  <Text style={styles.serviceBtnText}>Send Enquiry</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.white} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>

          {/* 4. EVENTS & WORKSHOPS */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Workshops & Masterclasses</Text>
              <Text style={styles.sectionSubtitle}>Learn from expert resident masters</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScroll}
          >
            {EXPLORE_EVENTS.map((event, index) => (
              <Animated.View
                entering={FadeInDown.delay(index * 100).duration(400)}
                key={event.id}
                style={[styles.eventCard, theme.shadows.soft]}
              >
                <TouchableOpacity activeOpacity={0.9} onPress={() => navigateToDetail('event', event.id)}>
                  <Image source={{ uri: event.image }} style={styles.eventImage} />
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventInstructor}>By {event.instructor}</Text>
                    <Text style={styles.eventTitle} numberOfLines={1}>{event.name}</Text>
                    <View style={styles.eventTimeRow}>
                      <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.eventTimeText}>{event.date}</Text>
                      <Ionicons name="time-outline" size={14} color={colors.textSecondary} style={{ marginLeft: 8 }} />
                      <Text style={styles.eventTimeText}>{event.time}</Text>
                    </View>
                    <View style={styles.eventFooter}>
                      <View>
                        <Text style={styles.priceSub}>{event.seats} seats left</Text>
                        <Text style={styles.eventPrice}>{event.price}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.bookNowBtn}
                        onPress={() => navigateToDetail('event', event.id)}
                      >
                        <Text style={styles.bookNowText}>Book Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>

          {/* 5. RECOMMENDED FOR YOU */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recommended For You</Text>
              <Text style={styles.sectionSubtitle}>Handpicked picks tailored to your style</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScroll}
          >
            {EXPLORE_RECOMMENDED.map((rec, index) => (
              <Animated.View
                entering={FadeInDown.delay(index * 100).duration(400)}
                key={rec.id}
                style={[styles.recommendedCard, theme.shadows.soft]}
              >
                <TouchableOpacity activeOpacity={0.9} onPress={() => navigateToDetail(rec.type, rec.targetId)}>
                  <Image source={{ uri: rec.image }} style={styles.recommendedImage} />
                  <View style={styles.recommendedInfo}>
                    <Text style={styles.recommendedCategory}>{rec.category.toUpperCase()}</Text>
                    <Text style={styles.recommendedTitle} numberOfLines={1}>{rec.title}</Text>
                    <View style={styles.recommendedFooter}>
                      <Text style={styles.recommendedPrice}>{rec.price}</Text>
                      <Text style={styles.viewRecommendation}>View Details</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>

        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: theme.typography.fontWeights.extraBold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: theme.spacing.sm,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSizes.sm,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bannerWrapper: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  bannerContainer: {
    borderRadius: 20,
    padding: theme.spacing.xl,
    overflow: 'hidden',
  },
  bannerInfo: {
    flex: 1,
  },
  bannerBadge: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4,
    opacity: 0.9,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  bannerSubtitle: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.85,
    marginBottom: theme.spacing.md,
  },
  bannerBtn: {
    backgroundColor: colors.white,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  categoryPillsScroll: {
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.sm,
    marginVertical: theme.spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: theme.spacing.md + 2,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeCategoryPill: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeCategoryPillText: {
    color: colors.white,
  },
  carouselScroll: {
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  productCard: {
    width: 170,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: theme.spacing.md,
  },
  productCategory: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '800',
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  productRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  productRatingText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  shopNowBtn: {
    backgroundColor: colors.primary + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shopNowText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  spaceCard: {
    width: 250,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  spaceImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  spaceBadgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  spaceBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  spaceInfo: {
    padding: theme.spacing.md,
  },
  spaceName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  spaceMetaRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  spaceMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  spaceMetaText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  spaceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 8,
  },
  priceSub: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '600',
  },
  spacePrice: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  bookSpaceBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  bookSpaceText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  serviceCard: {
    width: 220,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: theme.spacing.md + 2,
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  serviceDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  serviceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: 'auto',
  },
  serviceBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    marginRight: 4,
  },
  eventCard: {
    width: 260,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: theme.spacing.md,
  },
  eventInstructor: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '800',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  eventTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTimeText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 8,
  },
  eventPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  bookNowBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  bookNowText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  recommendedCard: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  recommendedImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  recommendedInfo: {
    padding: theme.spacing.md,
  },
  recommendedCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2,
  },
  recommendedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  recommendedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendedPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  viewRecommendation: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  searchResultsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: theme.spacing.md,
  },
  searchSection: {
    marginBottom: theme.spacing.lg,
  },
  searchSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  searchItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: theme.spacing.sm,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchItemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  searchIconBox: {
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchItemInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  searchItemCategory: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  searchItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  searchItemDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  searchItemPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
});

export default ExploreScreen;
