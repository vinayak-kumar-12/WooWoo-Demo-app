import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  FlatList,
  Dimensions,
  Animated as RNAnimated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import CustomButton from '../../components/CustomButton';
import api from '../../services/api';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { useWishlist } from '../../context/WishlistContext';
import { useActivities } from '../../hooks/useActivities';
import {
  EXPLORE_PRODUCTS,
  EXPLORE_SPACES,
  EXPLORE_SERVICES,
  EXPLORE_EVENTS,
  EXPLORE_RECOMMENDED,
} from '../../constants/exploreData';

const { width } = Dimensions.get('window');

const BANNERS = [
  {
    id: '1',
    title: 'Upcoming Workshop',
    subtitle: 'Impressionist Oil Masterclass',
    tag: 'LIMITED SEATS',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400',
    type: 'event',
    targetId: 'event-1',
  },
  {
    id: '2',
    title: 'Special Offer',
    subtitle: '10% off Artist Oil Paints',
    tag: 'SHOP NOW',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400',
    type: 'product',
    targetId: 'prod-1',
  },
  {
    id: '3',
    title: 'New Arrivals',
    subtitle: 'Sable Fine Detail Brush Pack',
    tag: 'NEW RELEASE',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400',
    type: 'product',
    targetId: 'prod-2',
  },
];

const HomeScreen = ({ navigation }) => {
  const { user, logout, logoutAll } = useAuth();
  const { showToast } = useToast();
  const { recentlyViewed } = useRecentlyViewed();
  const { activities, onRefresh: refreshActivities } = useActivities();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);

  const bannerFlatListRef = useRef(null);
  const shimmerAnim = useRef(new RNAnimated.Value(0.3)).current;

  // Pulse animation for crash-proof skeleton loader
  useEffect(() => {
    if (loading) {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(shimmerAnim, {
            toValue: 0.8,
            duration: 800,
            useNativeDriver: true,
          }),
          RNAnimated.timing(shimmerAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [loading]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/me');
      setProfileData(response.data.user);
    } catch (err) {
      console.warn('Failed to fetch profile details:', err);
      setError('Failed to fetch profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Sliding banner timer
  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      const nextIndex = (activeBanner + 1) % BANNERS.length;
      setActiveBanner(nextIndex);
      bannerFlatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4000);
    return () => clearInterval(timer);
  }, [activeBanner, loading]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    await refreshActivities();
    setRefreshing(false);
    showToast('Dashboard updated', 'success');
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      navigation.replace('AuthStack');
    } catch (err) {
      showToast('Logout failed', 'error');
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAll();
      showToast('Logged out of all devices', 'success');
      navigation.replace('AuthStack');
    } catch (err) {
      showToast('Global logout failed', 'error');
    }
  };

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleRecommendedPress = (item) => {
    if (item.type === 'product') {
      navigation.navigate('ProductDetail', { productId: item.targetId });
    } else {
      navigation.navigate('ExploreDetail', { type: item.type, id: item.targetId });
    }
  };

  const displayUser = profileData || user;

  // Premium Custom Skeleton Loader (safe and cross-platform)
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
        <View style={styles.header}>
          <RNAnimated.View style={[styles.skeletonHeaderName, { opacity: shimmerAnim }]} />
          <RNAnimated.View style={[styles.skeletonHeaderIcon, { opacity: shimmerAnim }]} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <RNAnimated.View style={[styles.skeletonBanner, { opacity: shimmerAnim }]} />
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4, 5].map((i) => (
              <RNAnimated.View key={i} style={[styles.skeletonCard, { opacity: shimmerAnim }]} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      {/* Header Greeting & Bell */}
      <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
        <View style={styles.greetingContainer}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarMiniText}>
              {getInitials(displayUser?.username || 'User')}
            </Text>
          </View>
          <View style={{ marginLeft: theme.spacing.sm }}>
            <Text style={styles.welcomeText}>{getGreeting()},</Text>
            <Text style={styles.brandText}>{displayUser?.username || 'Guest'} 👋</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.bellButton} onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          <View style={styles.bellBadge} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Search Bar (Navigates to Explore) */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.searchBarWrapper}>
          <TouchableOpacity
            style={styles.searchBar}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('HomeTabs', { screen: 'Explore' })}
          >
            <Ionicons name="search-outline" size={20} color={colors.textMuted} />
            <Text style={styles.searchPlaceholder}>Search Products, Spaces, Services, Events...</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Auto Sliding Banner */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.bannerWrapper}>
          <FlatList
            ref={bannerFlatListRef}
            data={BANNERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveBanner(index);
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.bannerItem}
                activeOpacity={0.9}
                onPress={() => {
                  if (item.type === 'product') {
                    navigation.navigate('ProductDetail', { productId: item.targetId });
                  } else {
                    navigation.navigate('ExploreDetail', { type: item.type, id: item.targetId });
                  }
                }}
              >
                <Image source={{ uri: item.image }} style={styles.bannerImage} />
                <View style={styles.bannerOverlay} />
                <View style={styles.bannerContent}>
                  <View style={styles.bannerTag}>
                    <Text style={styles.bannerTagText}>{item.tag}</Text>
                  </View>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          {/* Banner Dots */}
          <View style={styles.bannerDots}>
            {BANNERS.map((_, idx) => (
              <View
                key={idx}
                style={[styles.bannerDot, activeBanner === idx && styles.activeBannerDot]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Quick Actions Grid */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('HomeTabs', { screen: 'Store' })}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#ECEFF1' }]}>
                <Ionicons name="bag-handle-outline" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Shop</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('HomeTabs', { screen: 'Explore' })}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="business-outline" size={24} color="#1E88E5" />
              </View>
              <Text style={styles.actionLabel}>Book Space</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('HomeTabs', { screen: 'Explore' })}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="color-palette-outline" size={24} color="#43A047" />
              </View>
              <Text style={styles.actionLabel}>Services</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('HomeTabs', { screen: 'Explore' })}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#FFF8E1' }]}>
                <Ionicons name="calendar-outline" size={24} color="#FFB300" />
              </View>
              <Text style={styles.actionLabel}>Workshops</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Wallet')}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#EDE7F6' }]}>
                <Ionicons name="wallet-outline" size={24} color="#5E35B1" />
              </View>
              <Text style={styles.actionLabel}>Wallet</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Wallet Summary */}
        <Animated.View entering={FadeInDown.delay(220).duration(500)} style={[styles.walletSummaryCard, theme.shadows.soft]}>
          <View style={styles.walletHeaderRow}>
            <View>
              <Text style={styles.walletLabel}>WALLET BALANCE</Text>
              <Text style={styles.walletBalance}>₹850.00</Text>
            </View>
            <TouchableOpacity style={styles.walletViewBtn} onPress={() => navigation.navigate('Wallet')}>
              <Text style={styles.walletViewText}>View Wallet</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.walletMiniRow}>
            <View style={styles.walletMiniItem}>
              <Text style={styles.walletMiniLabel}>Cashback</Text>
              <Text style={styles.walletMiniValue}>₹150.00</Text>
            </View>
            <View style={styles.walletMiniDivider} />
            <View style={styles.walletMiniItem}>
              <Text style={styles.walletMiniLabel}>Rewards</Text>
              <Text style={styles.walletMiniValue}>₹200.00</Text>
            </View>
          </View>
        </Animated.View>

        {/* Featured Products */}
        <Animated.View entering={FadeInDown.delay(250).duration(500)} style={styles.horizontalSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('HomeTabs', { screen: 'Store' })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {EXPLORE_PRODUCTS.map((prod) => (
              <TouchableOpacity
                key={prod.id}
                style={[styles.featuredProdCard, theme.shadows.soft]}
                onPress={() => navigation.navigate('ProductDetail', { productId: prod.id })}
              >
                <Image source={{ uri: prod.image }} style={styles.featuredProdImage} />
                <View style={styles.featuredProdInfo}>
                  <Text style={styles.featuredProdName} numberOfLines={1}>{prod.name}</Text>
                  <Text style={styles.featuredProdPrice}>{prod.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Upcoming Workshops */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.horizontalSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Workshops</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {EXPLORE_EVENTS.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, theme.shadows.soft]}
                onPress={() => navigation.navigate('ExploreDetail', { type: 'event', id: event.id })}
              >
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
                  <Text style={styles.eventMeta}>{event.date} • {event.time}</Text>
                  <Text style={styles.eventPrice}>{event.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Popular Spaces */}
        <Animated.View entering={FadeInDown.delay(350).duration(500)} style={styles.horizontalSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Spaces</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {EXPLORE_SPACES.map((space) => (
              <TouchableOpacity
                key={space.id}
                style={[styles.spaceCard, theme.shadows.soft]}
                onPress={() => navigation.navigate('ExploreDetail', { type: 'space', id: space.id })}
              >
                <Image source={{ uri: space.image }} style={styles.spaceImage} />
                <View style={styles.spaceInfo}>
                  <Text style={styles.spaceName} numberOfLines={1}>{space.name}</Text>
                  <Text style={styles.spaceMeta}>{space.capacity} • {space.duration}</Text>
                  <Text style={styles.spacePrice}>{space.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Featured Services */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.horizontalSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Services</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {EXPLORE_SERVICES.map((serv) => (
              <TouchableOpacity
                key={serv.id}
                style={[styles.serviceCard, theme.shadows.soft]}
                onPress={() => navigation.navigate('ExploreDetail', { type: 'service', id: serv.id })}
              >
                <View style={styles.serviceIconWrap}>
                  <Ionicons name={serv.icon} size={22} color={colors.primary} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle} numberOfLines={1}>{serv.title}</Text>
                  <Text style={styles.serviceDesc} numberOfLines={2}>{serv.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Recently Viewed Products */}
        {recentlyViewed && recentlyViewed.length > 0 && (
          <Animated.View entering={FadeInDown.delay(420).duration(500)} style={styles.horizontalSection}>
            <Text style={styles.sectionTitle}>Recently Viewed Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {recentlyViewed.map((prod) => {
                const priceNum = typeof prod.price === 'string' ? parseFloat(prod.price.replace(/[$,]/g, '')) : prod.price;
                return (
                  <TouchableOpacity
                    key={`rv-${prod.id}`}
                    style={[styles.featuredProdCard, theme.shadows.soft]}
                    onPress={() => navigation.navigate('ProductDetail', { productId: prod.id })}
                  >
                    <Image source={{ uri: prod.image }} style={styles.featuredProdImage} />
                    <View style={styles.featuredProdInfo}>
                      <Text style={styles.featuredProdName} numberOfLines={1}>{prod.name}</Text>
                      <Text style={styles.featuredProdPrice}>${priceNum.toFixed(2)}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        {/* Recommended For You */}
        <Animated.View entering={FadeInDown.delay(450).duration(500)} style={styles.horizontalSection}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {EXPLORE_RECOMMENDED.map((rec) => (
              <TouchableOpacity
                key={rec.id}
                style={[styles.featuredProdCard, theme.shadows.soft]}
                onPress={() => handleRecommendedPress(rec)}
              >
                <Image source={{ uri: rec.image }} style={styles.featuredProdImage} />
                <View style={styles.featuredProdInfo}>
                  <Text style={styles.featuredProdCategory}>{rec.category.toUpperCase()}</Text>
                  <Text style={styles.featuredProdName} numberOfLines={1}>{rec.title}</Text>
                  <Text style={styles.featuredProdPrice}>{rec.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Recent Activity Preview (Last 3) */}
        {activities && activities.length > 0 && (
          <Animated.View entering={FadeInDown.delay(480).duration(500)} style={styles.recentActivitiesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity Preview</Text>
              <TouchableOpacity onPress={() => navigation.navigate('HomeTabs', { screen: 'Activity' })}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityList}>
              {activities.slice(0, 3).map((act, index) => (
                <View key={act.id} style={styles.activityPreviewRow}>
                  <Image source={{ uri: act.image }} style={styles.activityPreviewImage} />
                  <View style={styles.activityPreviewText}>
                    <Text style={styles.activityPreviewTitle} numberOfLines={1}>{act.title}</Text>
                    <Text style={styles.activityPreviewSubtitle}>{act.subtitle} • {act.date}</Text>
                  </View>
                  <View style={styles.activityPreviewPriceCol}>
                    <Text style={styles.activityPreviewPrice}>{act.price}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}


      </ScrollView>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMiniText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  welcomeText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  brandText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginTop: 1,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchBarWrapper: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 46,
    paddingHorizontal: theme.spacing.md,
  },
  searchPlaceholder: {
    fontSize: 13,
    color: colors.textMuted,
    marginLeft: theme.spacing.sm,
    fontWeight: '500',
  },
  bannerWrapper: {
    height: 180,
    marginVertical: theme.spacing.xs,
  },
  bannerItem: {
    width: width - (theme.spacing.lg * 2),
    height: 180,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginLeft: theme.spacing.lg,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bannerContent: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
  },
  bannerTag: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  bannerTagText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginHorizontal: 3,
  },
  activeBannerDot: {
    backgroundColor: colors.primary,
    width: 14,
  },
  quickActionsContainer: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
  },
  walletSummaryCard: {
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  walletHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletViewText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 2,
  },
  walletMiniRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  walletMiniItem: {
    flex: 1,
  },
  walletMiniLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '600',
  },
  walletMiniValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '700',
    marginTop: 1,
  },
  walletMiniDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
    marginHorizontal: theme.spacing.md,
  },
  horizontalSection: {
    marginTop: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    paddingHorizontal: theme.spacing.lg,
  },
  horizontalScroll: {
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
  },
  featuredProdCard: {
    width: 140,
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
  },
  featuredProdImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  featuredProdInfo: {
    padding: theme.spacing.sm,
  },
  featuredProdName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  featuredProdPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  featuredProdCategory: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: 2,
  },
  eventCard: {
    width: 180,
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: theme.spacing.sm,
  },
  eventName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  eventMeta: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  eventPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  spaceCard: {
    width: 180,
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
  },
  spaceImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  spaceInfo: {
    padding: theme.spacing.sm,
  },
  spaceName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  spaceMeta: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  spacePrice: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  serviceCard: {
    width: 180,
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: theme.spacing.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  serviceIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  serviceDesc: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 14,
  },
  recentActivitiesSection: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  activityList: {
    marginTop: theme.spacing.md,
  },
  activityPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    backgroundColor: colors.white,
    marginBottom: theme.spacing.sm,
  },
  activityPreviewImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  activityPreviewText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  activityPreviewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  activityPreviewSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  activityPreviewPriceCol: {
    alignItems: 'flex-end',
  },
  activityPreviewPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  profileCard: {
    backgroundColor: colors.grayLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: theme.spacing.md,
  },
  infoContainer: {
    width: '100%',
  },
  profileLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  profileValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 11,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonContainer: {
    width: '100%',
    marginTop: theme.spacing.sm,
  },
  logoutButton: {
    backgroundColor: colors.black,
    height: 44,
  },
  logoutAllButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.error,
    height: 44,
  },
  // Skeletons
  skeletonHeaderName: {
    height: 24,
    width: 150,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  skeletonHeaderIcon: {
    height: 40,
    width: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
  },
  skeletonBanner: {
    height: 180,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  skeletonGrid: {
    paddingHorizontal: 16,
  },
  skeletonCard: {
    height: 90,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 16,
  },
});

export default HomeScreen;
