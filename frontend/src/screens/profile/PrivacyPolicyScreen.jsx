import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.policyTitle}>1. Data Collection</Text>
        <Text style={styles.policyText}>
          We collect personal identification information such as your name, email address, shipping and billing addresses, and payment details only when you purchase artworks or configure your account.
        </Text>

        <Text style={styles.policyTitle}>2. Use of Information</Text>
        <Text style={styles.policyText}>
          Your collected information is used solely to process your orders, ship requested artwork pieces, send transactional updates, and optimize your overall app experiences.
        </Text>

        <Text style={styles.policyTitle}>3. Security Protocols</Text>
        <Text style={styles.policyText}>
          All transactions are processed through secure gateways, and sensitive tokens are encrypted. We employ industry standard practices to prevent unauthorized breaches.
        </Text>
      </ScrollView>
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
  content: {
    padding: theme.spacing.lg,
  },
  policyTitle: {
    fontSize: theme.typography.fontSizes.sm + 1,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  policyText: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
});

export default PrivacyPolicyScreen;
