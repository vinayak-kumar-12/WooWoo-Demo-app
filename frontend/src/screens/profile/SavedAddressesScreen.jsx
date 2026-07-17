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

const MOCK_ADDRESSES = [
  {
    id: '1',
    label: 'Home',
    fullName: 'Jane Doe',
    addressLine: '123 Fine Art Lane, Apt 4B',
    cityStateZip: 'New York, NY 10001',
    phone: '+1 (555) 019-2834',
  },
  {
    id: '2',
    label: 'Office',
    fullName: 'Jane Doe',
    addressLine: '500 Gallery Plaza, Suite 10',
    cityStateZip: 'Brooklyn, NY 11201',
    phone: '+1 (555) 019-5829',
  },
];

const SavedAddressesScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={[styles.addressCard, theme.shadows.soft]}>
      <View style={styles.addressHeader}>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{item.label}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      <Text style={styles.fullName}>{item.fullName}</Text>
      <Text style={styles.addressText}>{item.addressLine}</Text>
      <Text style={styles.addressText}>{item.cityStateZip}</Text>
      <Text style={styles.phone}>{item.phone}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={MOCK_ADDRESSES}
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
  addressCard: {
    backgroundColor: colors.grayLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  labelContainer: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm - 4,
  },
  labelText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.primary,
  },
  fullName: {
    fontSize: theme.typography.fontSizes.sm + 1,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  addressText: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 18,
  },
  phone: {
    fontSize: theme.typography.fontSizes.xs + 1,
    color: colors.textMuted,
    marginTop: 8,
  },
});

export default SavedAddressesScreen;
