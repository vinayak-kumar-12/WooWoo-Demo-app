import { Filter, Search, X } from 'lucide-react-native';
import React, { useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { borderRadius, shadows, spacing } from '../../constants/spacing';

export const SearchBar = ({
  value,
  onChangeText,
  onFilterPress,
  hasActiveFilters = false,
}) => {
  const inputRef = useRef(null);
  const filterScale = useSharedValue(1);

  const handleFilterPressIn = () => {
    filterScale.value = withSpring(0.9);
  };

  const handleFilterPressOut = () => {
    filterScale.value = withSpring(1);
  };

  const filterAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: filterScale.value }],
    };
  });

  return (
    <Animated.View entering={FadeIn.delay(300).duration(400)} style={styles.container}>
      <View style={[styles.searchBox, shadows.soft]}>
        <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder="Search activities..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              onChangeText('');
              inputRef.current?.blur();
            }}
            style={styles.clearButton}
          >
            <X size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <Animated.View style={filterAnimatedStyle}>
        <TouchableOpacity
          onPress={onFilterPress}
          onPressIn={handleFilterPressIn}
          onPressOut={handleFilterPressOut}
          style={[
            styles.filterButton,
            shadows.soft,
            hasActiveFilters && styles.filterButtonActive,
          ]}
          activeOpacity={0.8}
        >
          <Filter size={20} color={hasActiveFilters ? colors.white : colors.text} />
          {hasActiveFilters && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    marginVertical: spacing.md,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    height: 52,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    height: '100%',
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing.xs,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});

export default SearchBar;
