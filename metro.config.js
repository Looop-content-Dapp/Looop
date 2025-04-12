const { withNativeWind } = require('nativewind/metro');
const { withLibsodiumResolver } = require("@burnt-labs/abstraxion-react-native/metro.libsodium");
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

// Apply both libsodium resolver and NativeWind
module.exports = withNativeWind(withLibsodiumResolver(config), { input: './global.css' });