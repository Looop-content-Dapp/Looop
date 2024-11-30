import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Provider } from "react-redux";
import { SplashScreen, Stack } from "expo-router";
import { GiphySDK } from "@giphy/react-native-sdk";
import { PersistGate } from "redux-persist/integration/react";

import { useFonts } from "expo-font";
import "../global.css";

import store, { persistor } from "../redux/store";

GiphySDK.configure({ apiKey: "R25Je48LLUMFnuTOGV2kibJO2xFGSR6i" });
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const [fontsLoaded, fontsError] = useFonts({
    PlusJakartaSansBold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    PlusJakartaSansLight: require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    PlusJakartaSansMedium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    PlusJakartaSansRegular: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded && !fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        style="light"
        backgroundColor="transparent"
        translucent={false}
      />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#0A0B0F" },
          headerShown: false,
        }}
        initialRouteName={"index"}
      >
        {/* Define all possible screens here */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(musicTabs)" />
        <Stack.Screen name="(communityTabs)" />
        <Stack.Screen name="musicDetails" />
        <Stack.Screen name="(settingUp)" />
        <Stack.Screen name="loadingScreen" />
        <Stack.Screen
          name="nowPlaying"
          options={{
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen name="creatorOnboarding" />
        <Stack.Screen name="(artisteTabs)" />
        <Stack.Screen
          name="createPlaylist"
          options={{
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen name="communityDetails" />
      </Stack>
    </GestureHandlerRootView>
  );
}

export default function _RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <KeyboardProvider>
          <AppContent />
        </KeyboardProvider>
      </PersistGate>
    </Provider>
  );
}
