const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force JavaScript resolution and avoid TypeScript files in node_modules
config.resolver.sourceExts = ['js', 'jsx', 'json'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ttf', 'otf', 'woff', 'woff2'];

// Completely block TypeScript files from node_modules
config.resolver.blockList = [
  /node_modules\/.*\.ts$/,
  /node_modules\/.*\.tsx$/,
];

// Force module resolution to use compiled JavaScript versions
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