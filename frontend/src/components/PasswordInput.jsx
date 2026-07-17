import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { theme } from '../utils/theme';

/**
 * Reusable password input component with built-in eye icon toggle visibility.
 */
const PasswordInput = ({
  label,
  value,
  onChangeText,
  placeholder = '••••••••',
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: colors.text,
    marginBottom: theme.spacing.xs + 2,
    paddingLeft: 2,
  },
  inputContainer: {
    height: 52,
    backgroundColor: colors.grayLight,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainerFocused: {
    borderColor: colors.borderFocus,
    backgroundColor: colors.white,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  input: {
    fontSize: theme.typography.fontSizes.md,
    color: colors.text,
    flex: 1,
    height: '100%',
  },
  iconButton: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  errorText: {
    color: colors.error,
    fontSize: theme.typography.fontSizes.xs,
    marginTop: theme.spacing.xs,
    paddingLeft: 4,
  },
});

export default PasswordInput;
