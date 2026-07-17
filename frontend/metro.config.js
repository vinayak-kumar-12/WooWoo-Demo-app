const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add .mjs to sourceExts to resolve issues with lucide-react-native and other esm libraries
config.resolver.sourceExts.push('mjs');

// Intercept imports of react-native-linear-gradient and resolve them to our local wrapper
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-linear-gradient') {
    return context.resolveRequest(
      context,
      path.resolve(__dirname, 'src/components/activity/LinearGradientMock.js'),
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
