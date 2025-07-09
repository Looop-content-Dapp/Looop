import { Platform } from "react-native";

// Get the local IP address of your development machine
// For iOS simulator, use localhost
// For Android emulator, use 10.0.2.2
// For physical devices, use your computer's local IP address
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === "ios") {
      return "http://localhost:3001/api/v1";
    } else if (Platform.OS === "android") {
      return "http://10.0.2.2:3000";
    }
  }
  // Production URL
  return "https://api.looopmusic.com";
};

const getWebSocketUrl = () => {
  if (__DEV__) {
    if (Platform.OS === "ios") {
      return "ws://localhost:3001/api/v1";
    } else if (Platform.OS === "android") {
      return "ws://10.0.2.2:3000";
    }
  }
  // Production WebSocket URL
  return "wss://api.looopmusic.com";
};

export const ENV = {
  API_URL: getBaseUrl(),
  WS_URL: getWebSocketUrl(),
};
