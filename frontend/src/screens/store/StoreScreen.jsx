import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl, TextInput, Animated as RNAnimated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import useToast from '../../hooks/useToast';

const CATEGORIES = [
  'All',
  'Art Supplies',
  'Stationery',
  'Canvas & Surfaces',
  'Colours & Paints',
  'Brushes & Tools',
  'Creative Kits',
];

const StoreScreen = () => {
  const navigation = useNavigation();
  const { products, fetchProducts, loading } = useProducts();
  const { cartItems, addToCart } = useCart();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const shimmerAnim = useRef(new RNAnimated.Value(0.3)).current;

  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory, fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const name = product.name || '';
      const desc = product.description || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [products, searchQuery]);

  // Pulse animation for skeleton loader
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts(activeCategory);
    setRefreshing(false);
  };

  const handleQuickAdd = async (productId, productName) => {
    const success = await addToCart(productId, 1);
    if (success) {
      showToast(`${productName || 'Product'} added to Cart!`, 'success');
    } else {
      showToast('Failed to add product to Cart.', 'error');
    }
  };

  const renderItem = ({ item, index }) => {
    const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : item.price;
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).duration(400)}
        style={[styles.card, theme.shadows.soft]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
          <Image source={{ uri: item.image }} style={styles.artworkImage} />
          <View style={styles.cardInfo}>
            <Text style={styles.artworkCategory}>{item.category.toUpperCase()}</Text>
            <Text style={styles.artworkTitle} numberOfLines={1}>{item.name}</Text>
            
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>{item.rating} / 5.0</Text>
            </View>
 
            <View style={styles.priceRow}>
              <Text style={styles.artworkPrice}>${priceNum.toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.addButton}
                activeOpacity={0.7}
                onPress={() => handleQuickAdd(item.id, item.name)}
              >
                <Ionicons name="add" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Art Store</Text>
          <Text style={styles.headerSubtitle}>Discover & collect premium art supplies</Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Cart')}
        >
          <Ionicons name="cart-outline" size={24} color={colors.black} />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.categoryBadge,
                activeCategory === cat && styles.activeCategoryBadge,
              ]}
              activeOpacity={0.7}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.activeCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
 
        {/* Featured Artwork Grid */}
        {loading && products.length === 0 ? (
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4].map((i) => (
              <RNAnimated.View key={i} style={[styles.skeletonCard, { opacity: shimmerAnim }]} />
            ))}
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-handle-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtitle}>Try changing the search query or category pill.</Text>
          </View>
        ) : (
          <View style={styles.listWrapper}>
            <FlashList
              data={filteredProducts}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              estimatedItemSize={230}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: theme.typography.fontSizes.sm,
    color: colors.text,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
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
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl + 40,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    height: 40,
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 2,
    borderRadius: theme.borderRadius.round,
    backgroundColor: colors.grayLight,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  activeCategoryBadge: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: theme.typography.fontSizes.xs + 1,
    fontWeight: theme.typography.fontWeights.semibold,
    color: colors.textMuted,
  },
  activeCategoryText: {
    color: colors.white,
  },
  listWrapper: {
    minHeight: 400,
    width: '100%',
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg - 4,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: 6,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  artworkImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  cardInfo: {
    padding: theme.spacing.sm + 2,
  },
  artworkCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  artworkTitle: {
    fontSize: 13,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  artworkPrice: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    paddingVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: theme.spacing.md,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.lg - 4,
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  skeletonCard: {
    width: '47%',
    height: 220,
    backgroundColor: '#E5E7EB',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
});

export default StoreScreen;
