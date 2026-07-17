import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { theme } from '../../utils/theme';
import { messages } from '../../constants/messages';
import { getSignupErrors } from '../../utils/validators';
import useForm from '../../hooks/useForm';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import CustomInput from '../../components/CustomInput';
import PasswordInput from '../../components/PasswordInput';

/**
 * Premium, modern Signup Screen.
 * Includes entrance transitions, linear gradient buttons, eye visibility toggles,
 * and field-level real-time form validation.
 */
const SignupScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { signup } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Success checkmark scale animation value
  const checkScale = useSharedValue(0);

  // Form hook integration
  const { values, errors, handleChange, runValidation } = useForm(
    { username: '', email: '', password: '', confirmPassword: '' },
    (v) => getSignupErrors(v.username, v.email, v.password, v.confirmPassword)
  );

  /**
   * Action handler for user account registration
   */
  const handleSignup = async () => {
    if (!runValidation()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);
    try {
      await signup(values.username.trim(), values.email.trim(), values.password);
      
      // Success Micro-animation sequence
      setSuccess(true);
      checkScale.value = withSpring(1, { damping: 10, stiffness: 80 });
      showToast("Account created successfully. Please log in.", 'success');

      setTimeout(() => {
        // Since we did not auto-login, navigate back to Login screen
        navigation.navigate('Login');
      }, 1500);
    } catch (err) {
      showToast(err.message || messages.error.generic, 'error');
    } finally {
      setLoading(false);
    }
  };

  const animatedCheckStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  // Max width constraint for tablet screens
  const isTablet = width > 600;
  const contentWidth = isTablet ? 480 : '100%';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      
      {success && (
        <View style={styles.successOverlay}>
          <Animated.View style={[styles.successCircle, animatedCheckStyle]}>
            <Ionicons name="checkmark" size={60} color={colors.white} />
          </Animated.View>
          <Text style={styles.successOverlayText}>Creating account...</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isTablet && { alignItems: 'center' },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.innerContainer, { width: contentWidth }]}>
            
            {/* Header Text */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(800).springify()}
              style={styles.headerContainer}
            >
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join WOOWOO Art House today</Text>
            </Animated.View>

            {/* Form Container */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(800).springify()}
              style={styles.formContainer}
            >
              <CustomInput
                label="Username"
                placeholder="john_doe"
                value={values.username}
                onChangeText={(text) => handleChange('username', text)}
                error={errors.username}
                autoCapitalize="none"
              />

              <CustomInput
                label="Email Address"
                placeholder="name@example.com"
                value={values.email}
                onChangeText={(text) => handleChange('email', text)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <PasswordInput
                label="Password"
                placeholder="••••••••"
                value={values.password}
                onChangeText={(text) => handleChange('password', text)}
                error={errors.password}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="••••••••"
                value={values.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                error={errors.confirmPassword}
              />

              {/* Signup Button with Premium Gradient */}
              <TouchableOpacity
                onPress={handleSignup}
                disabled={loading || success}
                activeOpacity={0.85}
                style={styles.buttonWrapper}
              >
                <LinearGradient
                  colors={[colors.primary, '#818CF8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.gradientButton, (loading || success) && styles.buttonDisabled]}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Footer Navigation */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(800).springify()}
              style={styles.footerContainer}
            >
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                <Text style={styles.linkText}>Log In</Text>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSizes.title - 2,
    fontWeight: theme.typography.fontWeights.extraBold,
    color: colors.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.subtitle - 1,
    fontWeight: theme.typography.fontWeights.medium,
    color: colors.textMuted,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginTop: theme.spacing.md,
  },
  gradientButton: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.bold,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.fontSizes.sm,
    color: colors.textMuted,
  },
  linkText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.primary,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 10000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  successOverlayText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.text,
  },
});

export default SignupScreen;
