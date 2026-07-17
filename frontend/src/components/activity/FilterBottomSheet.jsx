import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { X, Check } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colors';
import { borderRadius, shadows, spacing } from '../../constants/spacing';

const STATUS_FILTERS = [
  { status: 'pending', label: 'Pending' },
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'completed', label: 'Completed' },
  { status: 'cancelled', label: 'Cancelled' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export const FilterBottomSheet = ({
  sheetRef,
  selectedStatuses,
  onToggleStatus,
  sortBy,
  onSortChange,
  onApply,
  onReset,
  onChange,
  index = -1,
}) => {
  const snapPoints = useMemo(() => ['55%', '70%'], []);

  const renderBackdrop = (props) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
    />
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={index}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      onChange={onChange}
    >
      <BottomSheetView style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Filter & Sort</Text>
          <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Reset All</Text>
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Status Selection */}
          <Text style={styles.sectionTitle}>Filter by Status</Text>
          <View style={styles.statusGrid}>
            {STATUS_FILTERS.map((item) => {
              const isSelected = selectedStatuses.includes(item.status);
              const stylesForStatus = colors.status[item.status] || colors.status.pending;
              return (
                <TouchableOpacity
                  key={item.status}
                  onPress={() => onToggleStatus(item.status)}
                  style={[
                    styles.statusChip,
                    isSelected
                      ? {
                          backgroundColor: stylesForStatus.bg,
                          borderColor: stylesForStatus.text,
                        }
                      : styles.statusChipInactive,
                  ]}
                  activeOpacity={0.8}
                >
                  {isSelected && (
                    <Check
                      size={14}
                      color={stylesForStatus.text}
                      style={{ marginRight: spacing.xs }}
                      strokeWidth={3}
                    />
                  )}
                  <Text
                    style={[
                      styles.statusChipText,
                      isSelected ? { color: stylesForStatus.text } : { color: colors.textSecondary },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Sort Selection */}
          <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Sort By</Text>
          <View style={styles.sortContainer}>
            {SORT_OPTIONS.map((option) => {
              const isSelected = sortBy === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => onSortChange(option.value)}
                  style={[
                    styles.sortRow,
                    isSelected && styles.sortRowActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.sortText,
                      isSelected && styles.sortTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.radioDotOuter}>
                      <View style={styles.radioDotInner} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Apply CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.applyBtn, shadows.premium]}
            onPress={onApply}
            activeOpacity={0.9}
          >
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
  },
  handleIndicator: {
    backgroundColor: colors.border,
    width: 48,
    height: 5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  resetBtnText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  body: {
    paddingVertical: spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    borderWidth: 1.5,
  },
  statusChipInactive: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sortContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortRowActive: {
    backgroundColor: colors.primaryLight + '50', // translucent primary light
  },
  sortText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sortTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  radioDotOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  footer: {
    paddingVertical: spacing.md,
  },
  applyBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default FilterBottomSheet;
