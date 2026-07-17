import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';

const EditProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState(DEFAULT_AVATAR);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      const storedUsername = await AsyncStorage.getItem('profile_username');
      const storedImage = await AsyncStorage.getItem('profile_image');
      setUsername(storedUsername || user?.username || '');
      setImageUri(storedImage || DEFAULT_AVATAR);
    };
    loadProfileData();
  }, [user]);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast('Permission to access gallery is required', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleRemoveImage = async () => {
    setImageUri(DEFAULT_AVATAR);
  };

  const handleSave = async () => {
    if (!username.trim()) {
      showToast('Username cannot be empty', 'error');
      return;
    }
    setSaving(true);
    try {
      await AsyncStorage.setItem('profile_username', username.trim());
      await AsyncStorage.setItem('profile_image', imageUri);
      showToast('Profile updated successfully', 'success');
      navigation.goBack();
    } catch (error) {
      showToast('Failed to save profile changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.avatarSection}>
            <Image source={{ uri: imageUri }} style={styles.avatar} />
            <View style={styles.imageActions}>
              <TouchableOpacity onPress={handlePickImage} style={styles.imageButton}>
                <Text style={styles.imageButtonText}>Change Photo</Text>
              </TouchableOpacity>
              {imageUri !== DEFAULT_AVATAR && (
                <TouchableOpacity onPress={handleRemoveImage} style={[styles.imageButton, styles.removeButton]}>
                  <Text style={[styles.imageButtonText, styles.removeButtonText]}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardView: {
    flex: 1,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  imageActions: {
    flexDirection: 'row',
  },
  imageButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: colors.grayLight,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 4,
  },
  imageButtonText: {
    fontSize: theme.typography.fontSizes.xs + 1,
    fontWeight: theme.typography.fontWeights.semibold,
    color: colors.text,
  },
  removeButton: {
    borderColor: colors.error + '50',
    backgroundColor: colors.error + '05',
  },
  removeButtonText: {
    color: colors.error,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSizes.sm + 1,
    color: colors.text,
    backgroundColor: colors.grayLight,
  },
  saveButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.bold,
  },
});

export default EditProfileScreen;
