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

const MOCK_CARDS = [
  {
    id: '1',
    type: 'Visa',
    last4: '4242',
    expDate: '12/28',
    cardholder: 'Jane Doe',
  },
  {
    id: '2',
    type: 'Mastercard',
    last4: '8827',
    expDate: '09/29',
    cardholder: 'Jane Doe',
  },
];

const PaymentMethodsScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={[styles.card, theme.shadows.soft]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardType}>{item.type}</Text>
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardNumber}>••••  ••••  ••••  {item.last4}</Text>
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardLabel}>CARDHOLDER</Text>
          <Text style={styles.cardValue}>{item.cardholder}</Text>
        </View>
        <View>
          <Text style={styles.cardLabel}>EXPIRES</Text>
          <Text style={styles.cardValue}>{item.expDate}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={MOCK_CARDS}
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
  card: {
    backgroundColor: colors.black,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  cardType: {
    color: colors.white,
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
  },
  cardNumber: {
    color: colors.white,
    fontSize: theme.typography.fontSizes.lg + 2,
    letterSpacing: 2,
    marginBottom: theme.spacing.xl,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: 4,
  },
  cardValue: {
    color: colors.white,
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold,
  },
});

export default PaymentMethodsScreen;
