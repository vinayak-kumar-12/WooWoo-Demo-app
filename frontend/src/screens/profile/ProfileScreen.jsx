import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';

const StatCard = ({ icon, number, label, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.statCard, theme.shadows.soft]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color={colors.primary} />
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const SettingItem = ({ icon, title, value, isDestructive, onValueChange, showSwitch, switchValue, onPress }) => {
  const textColor = isDestructive ? colors.error : colors.text;
  const iconColor = isDestructive ? colors.error : colors.text;

  return (
    <TouchableOpacity
      style={styles.settingItem}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={iconColor} />
        <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onValueChange}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
            thumbColor={switchValue ? colors.primary : colors.grayLight}
          />
        ) : (
          <>
            {value ? <Text style={styles.settingValue}>{value}</Text> : null}
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const isFocused = useIsFocused();
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState(DEFAULT_AVATAR);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      const storedUsername = await AsyncStorage.getItem('profile_username');
      const storedImage = await AsyncStorage.getItem('profile_image');
      const storedDarkMode = await AsyncStorage.getItem('profile_dark_mode');
      const storedNotifications = await AsyncStorage.getItem('profile_notifications');

      setUsername(storedUsername || user?.username || '');
      setImageUri(storedImage || DEFAULT_AVATAR);
      setDarkMode(storedDarkMode === 'true');
      setNotifications(storedNotifications !== 'false');
    };

    if (isFocused) {
      loadProfileData();
    }
  }, [isFocused, user]);

  const handleToggleDarkMode = async (value) => {
    setDarkMode(value);
    await AsyncStorage.setItem('profile_dark_mode', String(value));
  };

  const handleToggleNotifications = async (value) => {
    setNotifications(value);
    await AsyncStorage.setItem('profile_notifications', String(value));
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              showToast('Logged out successfully', 'success');
              navigation.replace('AuthStack');
            } catch (err) {
              showToast('Logout failed', 'error');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: imageUri }} style={[styles.avatarImage, theme.shadows.medium]} />
          </View>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.email}>{user?.email || 'guest@example.com'}</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            icon="bag-check-outline"
            number="12"
            label="Orders"
            onPress={() => navigation.navigate('MyOrders')}
          />
          <StatCard
            icon="heart-outline"
            number="45"
            label="Wishlist"
            onPress={() => navigation.navigate('Wishlist')}
          />
          <StatCard
            icon="star-outline"
            number="8"
            label="Reviews"
            onPress={() => navigation.navigate('Reviews')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account settings</Text>
          <View style={[styles.sectionCard, theme.shadows.soft]}>
            <SettingItem
              icon="person-outline"
              title="Personal Information"
              onPress={() => navigation.navigate('PersonalInformation')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="receipt-outline"
              title="My Orders"
              onPress={() => navigation.navigate('MyOrders')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="heart-outline"
              title="Wishlist"
              onPress={() => navigation.navigate('Wishlist')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="location-outline"
              title="Saved Addresses"
              onPress={() => navigation.navigate('SavedAddresses')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="card-outline"
              title="Payment Methods"
              onPress={() => navigation.navigate('PaymentMethods')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App settings</Text>
          <View style={[styles.sectionCard, theme.shadows.soft]}>
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              showSwitch={true}
              switchValue={notifications}
              onValueChange={handleToggleNotifications}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              showSwitch={true}
              switchValue={darkMode}
              onValueChange={handleToggleDarkMode}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="globe-outline"
              title="Language"
              onPress={() => navigation.navigate('Language')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="help-circle-outline"
              title="Help & Support"
              onPress={() => navigation.navigate('HelpSupport')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="information-circle-outline"
              title="About"
              onPress={() => navigation.navigate('About')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="log-out-outline"
              title="Log Out"
              isDestructive={true}
              onPress={handleLogout}
            />
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
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.border,
  },
  username: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
  },
  email: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.textMuted,
    marginTop: 4,
  },
  editProfileButton: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: colors.grayLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editProfileText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.grayLight,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: theme.typography.fontSizes.md + 2,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.xs,
    color: colors.textMuted,
    fontWeight: theme.typography.fontWeights.medium,
  },
  section: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  sectionCard: {
    backgroundColor: colors.grayLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: theme.typography.fontSizes.sm + 1,
    fontWeight: theme.typography.fontWeights.semibold,
    marginLeft: theme.spacing.md,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.textMuted,
    marginRight: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: theme.spacing.md + 26,
  },
});

export default ProfileScreen;
