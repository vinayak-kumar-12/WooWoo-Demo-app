import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Eye, MapPin, Phone, Calendar, Download, Trash, XCircle, Share2, HelpCircle } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colors';
import { borderRadius, spacing } from '../../constants/spacing';

export const ActivityActionsBottomSheet = ({
  sheetRef,
  activity,
  onActionPress,
  onClose,
  onChange,
  index = -1,
}) => {
  const snapPoints = useMemo(() => ['40%', '55%'], []);

  const renderBackdrop = (props) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
    />
  );

  const getActionsForType = () => {
    if (!activity) return [];

    switch (activity.type) {
      case 'store_order':
        return [
          { key: 'view_details', label: 'View Order Details', icon: Eye, color: colors.text },
          { key: 'track', label: 'Track Shipment', icon: MapPin, color: colors.primary },
          { key: 'invoice', label: 'Download Invoice', icon: Download, color: colors.textSecondary },
          { key: 'support', label: 'Contact Support', icon: Phone, color: colors.textSecondary },
        ];
      case 'space_booking':
        return [
          { key: 'view_details', label: 'View Booking Details', icon: Eye, color: colors.text },
          { key: 'directions', label: 'Get Directions', icon: MapPin, color: colors.primary },
          { key: 'cancel', label: 'Cancel Booking', icon: Trash, color: '#DC2626' },
        ];
      case 'service_request':
        return [
          { key: 'view_details', label: 'View Request Details', icon: Eye, color: colors.text },
          { key: 'contact', label: 'Contact Specialist', icon: Phone, color: colors.primary },
          { key: 'support', label: 'Support Assistance', icon: HelpCircle, color: colors.textSecondary },
        ];
      case 'event_workshop':
        return [
          { key: 'view_details', label: 'View Workshop Details', icon: Eye, color: colors.text },
          { key: 'ticket', label: 'View Access Ticket', icon: Eye, color: colors.primary },
          { key: 'calendar', label: 'Add to Calendar', icon: Calendar, color: colors.textSecondary },
          { key: 'share', label: 'Share Event', icon: Share2, color: colors.textSecondary },
        ];
      default:
        return [];
    }
  };


  const actions = getActionsForType();

  return (
    <BottomSheet
      ref={sheetRef}
      index={index}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      onClose={onClose}
      onChange={onChange}
    >
      <BottomSheetView style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {activity?.title || 'Activity Actions'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {activity?.subtitle || 'Select an action'}
          </Text>
        </View>

        {/* Actions List */}
        <View style={styles.actionsList}>
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <TouchableOpacity
                key={act.key}
                onPress={() => onActionPress(act.key, activity)}
                style={styles.actionRow}
                activeOpacity={0.7}
              >
                <Icon size={20} color={act.color} style={styles.actionIcon} />
                <Text style={[styles.actionLabel, { color: act.color }]}>
                  {act.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
  },
  handleIndicator: {
    backgroundColor: colors.border,
    width: 48,
    height: 5,
  },
  contentContainer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
  },
  header: {
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionsList: {
    paddingVertical: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingVertical: spacing.sm,
  },
  actionIcon: {
    marginRight: spacing.md,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ActivityActionsBottomSheet;
