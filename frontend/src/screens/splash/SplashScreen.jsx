import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../utils/colors';
import { AuthContext } from '../../context/AuthContext';

const SplashScreen = ({ navigation }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  useEffect(() => {
    // If auth state is still loading, wait
    if (loading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('AppStack');
      } else {
        navigation.replace('AuthStack');
      }
    }, 3000); 

    return () => clearTimeout(timer);
  }, [isAuthenticated, loading, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assests/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>WOOWOO</Text>
        <Text style={styles.subtitle}>Art House</Text>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Discover Creative Art & Handmade Products</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primary,
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginTop: 4,
    textAlign: 'center',
  },
  footerContainer: {
    paddingHorizontal: 40,
  },
  footerText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SplashScreen;