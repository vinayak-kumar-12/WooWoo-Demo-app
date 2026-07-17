import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';

const MOCK_REVIEWS = [
  {
    id: '1',
    artwork: 'Echoes of Light',
    rating: 5,
    comment: 'The lighting in this piece is absolute perfection. Highly recommended!',
    date: 'July 14, 2026',
  },
  {
    id: '2',
    artwork: 'Silent Symphony',
    rating: 4,
    comment: 'Beautiful depth and texture. Fits perfectly in my living room.',
    date: 'July 01, 2026',
  },
];

const ReviewsScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={[styles.reviewCard, theme.shadows.soft]}>
      <View style={styles.reviewHeader}>
        <Text style={styles.artworkTitle}>{item.artwork}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= item.rating ? 'star' : 'star-outline'}
            size={16}
            color="#FBBF24"
            style={styles.star}
          />
        ))}
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reviews</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={MOCK_REVIEWS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
  },
  placeholder: {
    width: 32,
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  reviewCard: {
    backgroundColor: colors.grayLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  artworkTitle: {
    fontSize: theme.typography.fontSizes.sm + 1,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
  },
  date: {
    fontSize: theme.typography.fontSizes.xs - 1,
    color: colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm - 2,
  },
  star: {
    marginRight: 2,
  },
  comment: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
});

export default ReviewsScreen;
