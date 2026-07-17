import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import useToast from '../../hooks/useToast';

const { width } = Dimensions.get('window');

export const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;

  const { getProduct, products, fetchProducts, loading } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addRecentlyViewed } = useRecentlyViewed();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await getProduct(productId);
      if (data) {
        setProduct(data);
        fetchProducts(data.category); // Load related products
        addRecentlyViewed(data); // Log to recently viewed!
      }
    };
    loadProduct();
  }, [productId, getProduct, fetchProducts]);

  // Filter out the current product from related products
  const relatedProducts = useMemo(() => {
    return products.filter((p) => p.id !== productId).slice(0, 4);
  }, [products, productId]);

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `Check out this amazing art supply at WOOWOO Art House: ${product.name} - ${typeof product.price === 'number' ? '$' + product.price.toFixed(2) : product.price}`,
      });
    } catch (error) {
      console.log('Error sharing product:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    const success = await addToCart(product.id, quantity);
    setIsAdding(false);
    if (success) {
      showToast(`${product.name} added to Cart!`, 'success');
    } else {
      showToast('Failed to add product to Cart.', 'error');
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    setIsAdding(true);
    const success = await addToCart(product.id, quantity);
    setIsAdding(false);
    if (success) {
      navigation.navigate('Cart');
    } else {
      showToast('Failed to process Buy Now.', 'error');
    }
  };

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  if (loading && !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Generate 3 carousel images (use placeholder variations for mock visual richness)
  const images = [
    product.image,
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400',
  ];

  const priceNum = typeof product.price === 'string' ? parseFloat(product.price.replace(/[$,]/g, '')) : product.price;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Product Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerBtn, { marginRight: 8 }]} onPress={handleWishlistToggle}>
            <Ionicons 
              name={isInWishlist(product.id) ? "heart" : "heart-outline"} 
              size={20} 
              color={isInWishlist(product.id) ? "#EF4444" : colors.text} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Carousel Image */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width);
              if (slide !== selectedImageIndex) setSelectedImageIndex(slide);
            }}
            scrollEventThrottle={16}
          >
            {images.map((img, idx) => (
              <Image key={idx} source={{ uri: img }} style={styles.carouselImage} />
            ))}
          </ScrollView>
          
          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {images.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  selectedImageIndex === idx && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Product Details Section */}
        <View style={styles.infoContainer}>
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Text style={styles.productCategory}>{product.category.toUpperCase()}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            
            <View style={styles.ratingPriceRow}>
              <Text style={styles.productPrice}>${priceNum.toFixed(2)}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.ratingText}>{product.rating} / 5.0</Text>
              </View>
            </View>

            {/* Stock status badge */}
            <View style={styles.stockBadgeContainer}>
              <View style={[styles.stockStatusBadge, product.stock_status === 'in_stock' ? styles.inStock : styles.outOfStock]}>
                <Text style={styles.stockStatusText}>
                  {product.stock_status === 'in_stock' ? 'IN STOCK' : 'OUT OF STOCK'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Quantity Selector */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Select Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity style={styles.qtyBtn} onPress={decrementQty}>
                <Ionicons name="remove" size={18} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={incrementQty}>
                <Ionicons name="add" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </Animated.View>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>Related Products</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
                {relatedProducts.map((item) => {
                  const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : item.price;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.relatedCard, theme.shadows.soft]}
                      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                    >
                      <Image source={{ uri: item.image }} style={styles.relatedImage} />
                      <View style={styles.relatedInfo}>
                        <Text style={styles.relatedName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.relatedPrice}>${itemPrice.toFixed(2)}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <Animated.View entering={FadeInUp.delay(300).duration(500)} style={[styles.bottomBar, theme.shadows.soft]}>
        <TouchableOpacity
          style={[styles.cartActionBtn, styles.addToCartBtn]}
          onPress={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Ionicons name="cart-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cartActionBtn, styles.buyNowBtn]}
          onPress={handleBuyNow}
          disabled={isAdding}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
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
    marginHorizontal: theme.spacing.md,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  carouselContainer: {
    height: 280,
    position: 'relative',
  },
  carouselImage: {
    width: width,
    height: 280,
    resizeMode: 'cover',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 14,
    backgroundColor: colors.white,
  },
  infoContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  productCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  ratingPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 4,
  },
  stockBadgeContainer: {
    marginTop: theme.spacing.sm,
    flexDirection: 'row',
  },
  stockStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  inStock: {
    backgroundColor: '#E8F5E9',
  },
  outOfStock: {
    backgroundColor: '#FFEBEE',
  },
  stockStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  quantitySection: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: theme.spacing.sm,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
    backgroundColor: colors.grayLight,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: theme.spacing.md,
  },
  descriptionSection: {
    marginTop: theme.spacing.lg,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 22,
  },
  relatedSection: {
    marginTop: theme.spacing.xl,
  },
  relatedScroll: {
    paddingVertical: theme.spacing.xs,
  },
  relatedCard: {
    width: 140,
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  relatedImage: {
    width: '100%',
    height: 90,
    resizeMode: 'cover',
  },
  relatedInfo: {
    padding: theme.spacing.sm,
  },
  relatedName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  relatedPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
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
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartActionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartBtn: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginRight: theme.spacing.sm,
    flexDirection: 'row',
  },
  addToCartText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  buyNowBtn: {
    backgroundColor: colors.primary,
    marginLeft: theme.spacing.sm,
  },
  buyNowText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  backBtn: {
    marginTop: theme.spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  backBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProductDetailScreen;
