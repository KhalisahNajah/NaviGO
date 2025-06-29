const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure TypeScript files are properly resolved
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// Enable web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Enable package exports for modern Node.js modules
config.resolver.unstable_enablePackageExports = true;

// Add condition names for proper module resolution
config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
  'import'
];

// Ensure proper handling of TypeScript files in node_modules
config.transformer.babelTransformerPath = require.resolve('metro-react-native-babel-transformer');

module.exports = config;