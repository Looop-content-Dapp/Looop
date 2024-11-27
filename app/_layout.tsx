import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { Provider } from "react-redux";
import { SplashScreen, Stack } from "expo-router";
import "../global.css";
import store from "../redux/store";
import { useFonts } from "expo-font";
import { GiphySDK } from "@giphy/react-native-sdk";
import { AuthProvider } from "../context/AuthContextProvider";
import { getItem } from "../utils/asyncStorage";
import { Client } from "react-native-appwrite";

const client = new Client()
  .setProject("6737282100305ba6f174")
  .setPlatform("com.looop.Looop");

// Initialize before your App component
GiphySDK.configure({ apiKey: "R25Je48LLUMFnuTOGV2kibJO2xFGSR6i" });

SplashScreen.preventAutoHideAsync();

export default function _RootLayout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  // Font loading
  const [fontsLoaded, fontsError] = useFonts({
    PlusJakartaSansBold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    PlusJakartaSansLight: require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    PlusJakartaSansMedium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    PlusJakartaSansRegular: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onBoarded = await getItem("onBoarded");
        setInitialRoute(onBoarded === "true" ? "(auth)" : "index");

        if (fontsLoaded && !fontsError) {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setInitialRoute("index");
      }
    };

    if (fontsLoaded && !fontsError) {
      checkOnboarding();
    }
  }, [fontsLoaded, fontsError]);

  // Hide splash screen when everything is ready
  useEffect(() => {
    const prepareApp = async () => {
      if (fontsLoaded && !fontsError && initialRoute) {
        await SplashScreen.hideAsync();
      }
    };
    prepareApp();
  }, [fontsLoaded, fontsError, initialRoute]);

  const tokenCache = {
    async getToken(key: string) {
      return SecureStore.getItemAsync(key);
    },
    async saveToken(key: string, value: string) {
      return SecureStore.setItemAsync(key, value);
    },
  };

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  // Don't render anything until we know the initial route and fonts are loaded
  if (initialRoute === null || !fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Provider store={store}>
          <AuthProvider>
            <KeyboardProvider>
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
                  initialRouteName={initialRoute}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(musicTabs)" />
                  <Stack.Screen name="(auth)" />
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
            </KeyboardProvider>
          </AuthProvider>
        </Provider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
