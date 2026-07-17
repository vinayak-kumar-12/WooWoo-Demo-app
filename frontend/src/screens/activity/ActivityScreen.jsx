import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActivityActionsBottomSheet from '../../components/activity/ActivityActionsBottomSheet';
import ActivityCard from '../../components/activity/ActivityCard';
import ActivityHeader from '../../components/activity/ActivityHeader';
import CategoryTabs from '../../components/activity/CategoryTabs';
import EmptyState from '../../components/activity/EmptyState';
import FilterBottomSheet from '../../components/activity/FilterBottomSheet';
import LoadingSkeleton from '../../components/activity/LoadingSkeleton';
import SearchBar from '../../components/activity/SearchBar';
import SummaryCard from '../../components/activity/SummaryCard';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { useActivities } from '../../hooks/useActivities';

export const ActivityScreen = () => {
  const navigation = useNavigation();
  const {
    activities,
    isLoading,
    isRefreshing,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatuses,
    toggleStatusFilter,
    sortBy,
    setSortBy,
    onRefresh,
    summary,
    clearFilters,
  } = useActivities();

  // Bottom Sheet References
  const filterSheetRef = useRef(null);
  const actionsSheetRef = useRef(null);

  // Selected Activity for Options Sheet
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Active status filter selected via Summary Cards
  const [activeSummaryFilter, setActiveSummaryFilter] = useState('total');

  // Bottom Sheet Mounted States (conditional rendering for zero touch-blocking)
  const [isFilterMounted, setIsFilterMounted] = useState(false);
  const [isActionsMounted, setIsActionsMounted] = useState(false);

  // Handle Summary Card Clicks (filters list by status)
  const handleSummaryCardPress = (filterType) => {
    setActiveSummaryFilter(filterType);
    clearFilters(); // Clear other filters to avoid confusion

    if (filterType === 'pending') {
      toggleStatusFilter('pending');
    } else if (filterType === 'completed') {
      toggleStatusFilter('completed');
    } else if (filterType === 'cancelled') {
      toggleStatusFilter('cancelled');
    }
  };

  // Open Actions Bottom Sheet
  const handleActionTrigger = (actionType, activity) => {
    if (actionType === 'more') {
      setSelectedActivity(activity);
      setIsActionsMounted(true);
    } else {
      // Direct action triggered from swipe (e.g. track, directions, contact, ticket)
      handleActionPress(actionType, activity);
    }
  };

  // Handle Sheet Actions
  const handleActionPress = (action, activity) => {
    actionsSheetRef.current?.close();
    
    if (action === 'view_details') {
      navigation.navigate('ActivityDetail', { activityId: activity.id });
    } else {
      // Simulate actions for demonstration
      alert(`Action "${action.replace('_', ' ')}" triggered for ${activity.title}`);
    }
  };

  const renderSummaryCards = () => (
    <View style={styles.summaryContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.summaryListContent}
      >
        {[
          { type: 'total', count: summary.total, label: 'All Activities' },
          { type: 'pending', count: summary.pending, label: 'Pending' },
          { type: 'completed', count: summary.completed, label: 'Completed' },
          { type: 'cancelled', count: summary.cancelled, label: 'Cancelled' },
        ].map((item, index) => (
          <SummaryCard
            key={item.type}
            type={item.type}
            count={item.count}
            label={item.label}
            isActive={activeSummaryFilter === item.type}
            onPress={() => handleSummaryCardPress(item.type)}
            index={index}
          />
        ))}
      </ScrollView>
    </View>
  );

  // Combined List Header
  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      {renderSummaryCards()}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => {
          setIsFilterMounted(true);
        }}
        hasActiveFilters={selectedStatuses.length > 0 || sortBy !== 'newest'}
      />
      <CategoryTabs
        selectedTab={selectedCategory}
        onTabSelect={setSelectedCategory}
      />
    </View>
  );

  // List Item Render
  const renderActivityItem = ({ item, index }) => (
    <ActivityCard
      activity={item}
      index={index}
      onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id, activity: item })}
      onActionTrigger={(actionType) => handleActionTrigger(actionType, item)}
    />
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Header (Stay fixed at top) */}
        <ActivityHeader unreadCount={2} onNotificationPress={() => navigation.navigate('Notifications')} />

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <View style={{ flex: 1 }}>
            <FlashList
              data={activities}
              renderItem={renderActivityItem}
              estimatedItemSize={92}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={
                <EmptyState
                  onExplorePress={() => navigation.navigate('Store')}
                  title={searchQuery ? 'No Results Found' : 'No Activities Yet'}
                  subtitle={
                    searchQuery
                      ? 'No activities match your search term. Try a different search query or reset filters.'
                      : 'You haven\'t made any bookings or orders yet. Explore our art shop!'
                  }
                />
              }
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                />
              }
              style={{ flex: 1 }}
              contentContainerStyle={styles.listContent}
            />
          </View>
        )}

        {/* Filter Sheet */}
        {isFilterMounted && (
          <FilterBottomSheet
            sheetRef={filterSheetRef}
            index={0}
            selectedStatuses={selectedStatuses}
            onToggleStatus={toggleStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onApply={() => {
              filterSheetRef.current?.close();
            }}
            onReset={() => {
              clearFilters();
              setActiveSummaryFilter('total');
              filterSheetRef.current?.close();
            }}
            onChange={(index) => {
              if (index === -1) {
                setIsFilterMounted(false);
              }
            }}
          />
        )}

        {/* Context Action Options Sheet */}
        {isActionsMounted && (
          <ActivityActionsBottomSheet
            sheetRef={actionsSheetRef}
            index={0}
            activity={selectedActivity}
            onActionPress={handleActionPress}
            onClose={() => {
              actionsSheetRef.current?.close();
            }}
            onChange={(index) => {
              if (index === -1) {
                setIsActionsMounted(false);
                setSelectedActivity(null);
              }
            }}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    backgroundColor: colors.background,
  },
  summaryContainer: {
    paddingVertical: 8,
    marginTop: spacing.xs,
  },
  summaryListContent: {
    paddingLeft: spacing.xxl,
    paddingRight: spacing.lg,
    paddingVertical: 8,
  },
  listContent: {
    paddingBottom: 120,
  },
});

export default ActivityScreen;
