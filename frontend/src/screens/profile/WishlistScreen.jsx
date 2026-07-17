import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import { useWishlist } from '../../context/WishlistContext';

const WishlistScreen = () => {
  const navigation = useNavigation();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const handleProductPress = (productId) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const renderItem = ({ item, index }) => {
    const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[$,]/g, '')) : item.price;
    return (
      <Animated.View 
        entering={FadeInDown.delay(index * 100).duration(400)}
        style={[styles.card, theme.shadows.soft]}
      >
        <TouchableOpacity style={styles.cardPressArea} onPress={() => handleProductPress(item.id)}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>{item.name || item.title}</Text>
            <Text style={styles.category}>{item.category || 'Art Supplies'}</Text>
            <Text style={styles.price}>${priceNum.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} onPress={() => removeFromWishlist(item.id)}>
          <Ionicons name="trash-outline" size={20} color={colors.error || '#EF4444'} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <FlatList
        data={wishlistItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={80} color={colors.textMuted || '#9CA3AF'} />
            <Text style={styles.emptyText}>Your Wishlist is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Browse through our collection of premium art products and save your favorites here.
            </Text>
            <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate('HomeTabs', { screen: 'Store' })}>
              <Text style={styles.exploreBtnText}>Go to Store</Text>
            </TouchableOpacity>
          </Animated.View>
        }
      />
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
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  placeholder: {
    width: 32,
  },
  listContainer: {
    padding: theme.spacing.lg,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  cardPressArea: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.sm,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  category: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: 18,
    color: colors.text,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  exploreBtn: {
    marginTop: theme.spacing.xl,
    backgroundColor: colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: 10,
    borderRadius: 20,
  },
  exploreBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default WishlistScreen;
