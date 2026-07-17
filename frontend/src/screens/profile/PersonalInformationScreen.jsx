import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import useAuth from '../../hooks/useAuth';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';

const PersonalInformationScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState(DEFAULT_AVATAR);

  useEffect(() => {
    const loadProfileData = async () => {
      const storedUsername = await AsyncStorage.getItem('profile_username');
      const storedImage = await AsyncStorage.getItem('profile_image');
      setUsername(storedUsername || user?.username || '');
      setImageUri(storedImage || DEFAULT_AVATAR);
    };
    loadProfileData();
  }, [user]);

  const renderInfoRow = (label, value) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <Image source={{ uri: imageUri }} style={[styles.avatar, theme.shadows.medium]} />
        </View>

        <View style={[styles.infoCard, theme.shadows.soft]}>
          {renderInfoRow('Username', username)}
          <View style={styles.divider} />
          {renderInfoRow('Email Address', user?.email || 'guest@example.com')}
          <View style={styles.divider} />
          {renderInfoRow('Account Provider', 'Email & Password')}
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.border,
  },
  infoCard: {
    backgroundColor: colors.grayLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  infoRow: {
    paddingVertical: theme.spacing.md + 4,
    paddingHorizontal: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: theme.typography.fontSizes.sm + 1,
    fontWeight: theme.typography.fontWeights.semibold,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: theme.spacing.md,
  },
});

export default PersonalInformationScreen;
