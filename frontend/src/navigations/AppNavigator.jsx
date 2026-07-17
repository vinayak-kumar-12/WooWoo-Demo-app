import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';

import HomeScreen from '../screens/home/HomeScreen';
import StoreScreen from '../screens/store/StoreScreen';
import ExploreScreen from '../screens/explore/ExploreScreen';
import ActivityScreen from '../screens/activity/ActivityScreen';
import ActivityDetailScreen from '../screens/activity/ActivityDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

import EditProfileScreen from '../screens/profile/EditProfileScreen';
import PersonalInformationScreen from '../screens/profile/PersonalInformationScreen';
import MyOrdersScreen from '../screens/profile/MyOrdersScreen';
import WishlistScreen from '../screens/profile/WishlistScreen';
import ReviewsScreen from '../screens/profile/ReviewsScreen';
import SavedAddressesScreen from '../screens/profile/SavedAddressesScreen';
import PaymentMethodsScreen from '../screens/profile/PaymentMethodsScreen';
import LanguageScreen from '../screens/profile/LanguageScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import PrivacyPolicyScreen from '../screens/profile/PrivacyPolicyScreen';
import AboutScreen from '../screens/profile/AboutScreen';
import NotificationScreen from '../screens/notification/NotificationScreen';
import { ExploreDetailScreen } from '../screens/explore/ExploreDetailScreen';
import ProductDetailScreen from '../screens/store/ProductDetailScreen';
import CartScreen from '../screens/store/CartScreen';
import CheckoutScreen from '../screens/store/CheckoutScreen';
import OrderSuccessScreen from '../screens/store/OrderSuccessScreen';
import WalletScreen from '../screens/wallet/WalletScreen';

import { colors } from '../utils/colors';
import { theme } from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.labelStyle,
        tabBarIconStyle: styles.iconStyle,
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Store') {
            iconName = focused ? 'bag-handle' : 'bag-handle-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Activity') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={size - 2} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          );
        },
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="ExploreDetail" component={ExploreDetailScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    elevation: 8,
    backgroundColor: colors.white,
    borderRadius: 24,
    height: 64,
    borderTopWidth: 0,
    paddingTop: 8,
    ...theme.shadows.premium,
  },
  labelStyle: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
  },
  iconStyle: {
    marginTop: Platform.OS === 'ios' ? 0 : 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
});

export default AppNavigator;
