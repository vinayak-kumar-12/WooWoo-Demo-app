import { useState, useEffect, useMemo, useCallback } from 'react';
import { MOCK_ACTIVITIES, getActivitiesSummary } from '../constants/activityData';
import api from '../services/api';

export const useActivities = () => {
  const [dbOrders, setDbOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  // Helper to map DB order to Activity object
  const mapOrderToActivity = useCallback((order) => {
    const mainItem = order.items && order.items[0]
      ? order.items[0]
      : { name: 'Art Supply Purchase', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400' };

    const totalQty = order.items
      ? order.items.reduce((sum, item) => sum + item.quantity, 0)
      : 1;

    const title = totalQty > 1
      ? `${mainItem.name} (+${totalQty - 1} items)`
      : mainItem.name;

    return {
      id: `DB-ORDER-${order.id}`,
      type: 'store_order',
      title,
      subtitle: `ORD-WOO-${order.id}`,
      date: order.created_at ? order.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      status: order.status || 'pending',
      price: `$${parseFloat(order.grand_total).toFixed(2)}`,
      orderId: `ORD-WOO-${order.id}`,
      image: mainItem.image || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400',
      items: order.items,
      shippingAddress: order.shipping_address,
      customerName: order.customer_name,
      dbOrderId: order.id,
      isDbOrder: true,
    };
  }, []);

  const loadActivities = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const response = await api.get('/orders');
      if (response.data && response.data.success) {
        const mapped = response.data.orders.map(mapOrderToActivity);
        setDbOrders(mapped);
      }
    } catch (err) {
      console.warn('Error loading real activities from server:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [mapOrderToActivity]);

  // Load activities initially
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Combine DB orders and MOCK activities
  const combinedActivities = useMemo(() => {
    return [...dbOrders, ...MOCK_ACTIVITIES];
  }, [dbOrders]);

  // Compute overall summaries based on unfiltered data
  const summary = useMemo(() => {
    return getActivitiesSummary(combinedActivities);
  }, [combinedActivities]);

  // Pull-to-refresh
  const onRefresh = useCallback(() => {
    loadActivities(true);
  }, [loadActivities]);

  // Category mapping
  const categoryMap = {
    'All': 'all',
    'Store Orders': 'store_order',
    'Space Bookings': 'space_booking',
    'Service Requests': 'service_request',
    'Events & Workshops': 'event_workshop',
  };

  // Filtered and sorted activities
  const filteredActivities = useMemo(() => {
    let result = [...combinedActivities];

    // 1. Filter by category
    const mappedType = categoryMap[selectedCategory];
    if (mappedType && mappedType !== 'all') {
      result = result.filter(act => act.type === mappedType);
    }

    // 2. Filter by statuses (from bottom sheet)
    if (selectedStatuses.length > 0) {
      result = result.filter(act => selectedStatuses.includes(act.status));
    }

    // 3. Filter by search query (Order ID, booking name, workshop name, service name, description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(act => {
        const matchesTitle = act.title.toLowerCase().includes(query);
        const matchesSubtitle = act.subtitle ? act.subtitle.toLowerCase().includes(query) : false;
        
        let matchesTypeSpecific = false;
        if (act.type === 'store_order') {
          matchesTypeSpecific = act.orderId.toLowerCase().includes(query);
        } else if (act.type === 'service_request') {
          matchesTypeSpecific = act.description.toLowerCase().includes(query) || 
                                (act.assignedStaff ? act.assignedStaff.toLowerCase().includes(query) : false);
        } else if (act.type === 'event_workshop') {
          matchesTypeSpecific = act.instructor.toLowerCase().includes(query);
        }
        
        return matchesTitle || matchesSubtitle || matchesTypeSpecific;
      });
    }

    // 4. Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [combinedActivities, selectedCategory, selectedStatuses, searchQuery, sortBy]);

  const toggleStatusFilter = useCallback((status) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSortBy('newest');
    setSearchQuery('');
  }, []);

  return {
    activities: filteredActivities,
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
  };
};
