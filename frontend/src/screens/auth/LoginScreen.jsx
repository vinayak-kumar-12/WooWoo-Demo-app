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
import { getLoginErrors } from '../../utils/validators';
import useForm from '../../hooks/useForm';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import CustomInput from '../../components/CustomInput';
import PasswordInput from '../../components/PasswordInput';


/**
 * Premium, modern Login Screen.
 * Includes entrance transitions, linear gradient buttons, eye visibility toggles,
 * and a Google sign-in placeholder section.
 */
const LoginScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Success checkmark scale animation value
  const checkScale = useSharedValue(0);

  // Form hook integration
  const { values, errors, handleChange, runValidation } = useForm(
    { email: '', password: '' },
    (v) => getLoginErrors(v.email, v.password)
  );

  /**
   * Action handler for user email/password login
   */
  const handleLogin = async () => {
    if (!runValidation()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(values.email.trim(), values.password);
      
      // Success Micro-animation sequence
      setSuccess(true);
      checkScale.value = withSpring(1, { damping: 10, stiffness: 80 });
      showToast(messages.success.login, 'success');

      setTimeout(() => {
        navigation.replace('AppStack');
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
          <Text style={styles.successOverlayText}>Signing in...</Text>
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
            
            {/* Logo with fade + pop entrance */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(800).springify()}
              style={styles.logoContainer}
            >
              <View style={[styles.logoCircle, theme.shadows.medium]}>
                <Text style={styles.logoText}>w</Text>
              </View>
            </Animated.View>

            {/* Header Text */}
            <Animated.View
              entering={FadeInUp.delay(200).duration(800).springify()}
              style={styles.headerContainer}
            >
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Log in to access your WOOWOO gallery</Text>
            </Animated.View>

            {/* Form Container */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(800).springify()}
              style={styles.formContainer}
            >
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

              <TouchableOpacity style={styles.forgotPasswordContainer} activeOpacity={0.7}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button with Premium Gradient */}
              <TouchableOpacity
                onPress={handleLogin}
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
                    <Text style={styles.buttonText}>Log In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* OR Separator and Google Login hidden as Google/Firebase Auth is removed */}

            {/* Footer Navigation */}
            <Animated.View
              entering={FadeInDown.delay(600).duration(800).springify()}
              style={styles.footerContainer}
            >
              <Text style={styles.footerText}>Don't have an account yet? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.7}>
                <Text style={styles.linkText}>Sign Up</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: theme.borderRadius.lg + 4,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: theme.typography.fontWeights.extraBold,
    color: colors.white,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: colors.primary,
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    color: colors.textMuted,
    paddingHorizontal: theme.spacing.md,
  },
  socialContainer: {
    width: '100%',
  },
  googleButton: {
    height: 52,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    marginRight: theme.spacing.sm,
  },
  googleButtonText: {
    color: colors.text,
    fontSize: theme.typography.fontSizes.md - 1,
    fontWeight: theme.typography.fontWeights.semibold,
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

export default LoginScreen;
