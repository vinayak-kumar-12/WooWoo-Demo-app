import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import useToast from '../../hooks/useToast';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];

const LanguageScreen = ({ navigation }) => {
  const { showToast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = await AsyncStorage.getItem('profile_language');
      if (lang) {
        setSelectedLanguage(lang);
      }
    };
    loadLanguage();
  }, []);

  const handleSelectLanguage = async (code) => {
    setSelectedLanguage(code);
    try {
      await AsyncStorage.setItem('profile_language', code);
      showToast('Language updated successfully', 'success');
      navigation.goBack();
    } catch (error) {
      showToast('Failed to update language', 'error');
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = item.code === selectedLanguage;
    return (
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => handleSelectLanguage(item.code)}
      >
        <Text style={[styles.languageName, isSelected && styles.selectedText]}>{item.name}</Text>
        {isSelected && <Ionicons name="checkmark" size={22} color={colors.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={LANGUAGES}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
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
    paddingHorizontal: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md + 4,
  },
  languageName: {
    fontSize: theme.typography.fontSizes.sm + 1,
    color: colors.text,
    fontWeight: theme.typography.fontWeights.semibold,
  },
  selectedText: {
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});

export default LanguageScreen;
