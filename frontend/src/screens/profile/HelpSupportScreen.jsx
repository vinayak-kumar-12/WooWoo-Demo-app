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

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Original paintings typically ship within 5-7 business days, depending on shipping destination and artist location.',
  },
  {
    q: 'Are art pieces certified?',
    a: 'Yes, every artwork purchased through WOOWOO Art House comes with a signed Certificate of Authenticity.',
  },
];

const HelpSupportScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQS.map((faq, idx) => (
          <View key={idx} style={[styles.faqCard, theme.shadows.soft]}>
            <Text style={styles.question}>{faq.q}</Text>
            <Text style={styles.answer}>{faq.a}</Text>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: theme.spacing.lg }]}>Contact Us</Text>
        <View style={[styles.contactCard, theme.shadows.soft]}>
          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={22} color={colors.primary} />
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>support@woowooarthouse.com</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={22} color={colors.primary} />
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>Phone Support</Text>
              <Text style={styles.contactValue}>+1 (800) 555-0199</Text>
            </View>
          </View>
        </View>
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
  sectionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
    marginBottom: theme.spacing.md,
  },
  faqCard: {
    backgroundColor: colors.grayLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  question: {
    fontSize: theme.typography.fontSizes.sm + 1,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
    marginBottom: 6,
  },
  answer: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: colors.grayLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  contactDetails: {
    marginLeft: theme.spacing.md,
  },
  contactLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.textMuted,
  },
  contactValue: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: colors.text,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});

export default HelpSupportScreen;
