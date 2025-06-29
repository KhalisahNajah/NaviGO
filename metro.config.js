const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Include TypeScript files in source extensions
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ttf', 'otf', 'woff', 'woff2'];

// Remove TypeScript blocking from node_modules to allow expo modules to work
config.resolver.blockList = [];

// Force module resolution to use compiled JavaScript versions when available
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Disable TypeScript transformer for node_modules
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
});

// Add platforms
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;