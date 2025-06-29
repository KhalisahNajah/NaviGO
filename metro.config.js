const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure TypeScript files are properly resolved
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// Enable web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Exclude problematic TypeScript files from node_modules
config.resolver.blockList = [
  /node_modules\/.*\/.*\.ts$/,
  /node_modules\/.*\/.*\.tsx$/,
];

// Ensure we only process our own TypeScript files
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Add resolver configuration to handle module resolution properly
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;