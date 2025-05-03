// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// we need .cjs so that Firebase's "auth" entry‑points can be loaded,
// and we disable the new packageExports enforcement
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
