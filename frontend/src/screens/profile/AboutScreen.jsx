import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.appName}>WOOWOO Art House</Text>
        <Text style={styles.version}>Version 1.0.0 (Build 2026.07)</Text>
        <Text style={styles.description}>
          WOOWOO Art House is a premium boutique mobile platform where art collectors and independent artists discover, list, bid, and trade unique physical and digital masterpieces.
        </Text>
        <View style={[styles.infoBox, theme.shadows.soft]}>
          <Text style={styles.copyright}>© 2026 WOOWOO Art House, Inc.</Text>
          <Text style={styles.rights}>All rights reserved.</Text>
        </View>
      </View>
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
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: theme.typography.fontSizes.xl + 4,
    fontWeight: theme.typography.fontWeights.extraBold,
    color: colors.primary,
    marginBottom: 6,
  },
  version: {
    fontSize: theme.typography.fontSizes.xs,
    color: colors.textMuted,
    marginBottom: theme.spacing.xl,
  },
  description: {
    fontSize: theme.typography.fontSizes.sm + 1,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  infoBox: {
    backgroundColor: colors.grayLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  copyright: {
    fontSize: theme.typography.fontSizes.xs,
    color: colors.text,
    fontWeight: theme.typography.fontWeights.bold,
  },
  rights: {
    fontSize: theme.typography.fontSizes.xs - 1,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default AboutScreen;
