const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const { withLibsodiumResolver } = require("@burnt-labs/abstraxion-react-native/metro.libsodium");

const config = getDefaultConfig(__dirname);

// Apply both libsodium resolver and NativeWind
module.exports = withNativeWind(withLibsodiumResolver(config), { input: './global.css' });
