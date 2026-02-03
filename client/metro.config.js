// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable experimental features for Expo Router
  unstable_experimentalStoreDir: true,
});

// Add any custom config settings here
config.resolver.sourceExts.push('mjs');

// Make sure you use the resolved config
module.exports = config;
