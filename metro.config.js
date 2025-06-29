const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add TypeScript support
config.resolver.sourceExts.push('ts', 'tsx');

// Enable web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Enable modern package exports and conditional exports
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['require', 'import', 'react-native'];

module.exports = config;