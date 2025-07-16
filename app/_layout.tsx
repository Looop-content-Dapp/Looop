import { playbackService } from "@/services/PlaybackService";
import { GiphySDK } from "@giphy/react-native-sdk";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalProvider } from "@gorhom/portal";
import { Buffer } from "buffer";
import { router, SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { setupPlayer } from "../services/PlaybackService";
// In your app initialization
setupPlayer();

import { useFonts } from "expo-font";
import "../global.css";

import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import { NotificationProvider } from "@/context/NotificationContext";
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TrackPlayer from "react-native-track-player";
import { Animated, Pressable } from "react-native";
import { Text } from "react-native";
import { useAuth, useAuthActions, useMisc } from "@/stores/hooks";

Sentry.init({
  dsn: "https://0d0b04e2a4f98122a0e2014b2a86b10c@o4509128364195840.ingest.de.sentry.io/4509128384774224",

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Register the playback service
TrackPlayer.registerPlaybackService(() => playbackService);

SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

GiphySDK.configure({ apiKey: "R25Je48LLUMFnuTOGV2kibJO2xFGSR6i" });

function AppContent() {
 const { authToken,  settingDone } = useAuth();
  const { onBoarded } = useMisc();
  const animation = useMemo(() => new Animated.Value(1), []);
  const [fontsLoaded, fontsError] = useFonts({
    PlusJakartaSansBold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    PlusJakartaSansLight: require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    PlusJakartaSansMedium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    PlusJakartaSansRegular: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    TankerRegular: require("../assets/fonts/Tanker-Regular.otf"),
  });

   const isTokenExpired = (token: string | null): boolean => {
    if (token === null) {
      return true;
    }
    try {
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      console.log('decodedPayload', decodedPayload);
      return Date.now() >= decodedPayload.exp * 1000;
    } catch {
      return true; // If there's any error parsing, assume token is expired
    }
  };

  console.log("onBoarded", onBoarded, "authToken", authToken, "isTokenExpired", isTokenExpired(authToken));
  useEffect(() => {
    if (fontsLoaded) {
        // Navigate to appropriate screen after animation
         if (
        onBoarded === false &&
        (authToken === null || isTokenExpired(authToken)) &&
        settingDone === false
      ) {
         SplashScreen.hideAsync()
        router.replace('/onboarding2');
      } else if (
        onBoarded === true &&
        (authToken === null || isTokenExpired(authToken)) &&
        settingDone === false
      ) {
         SplashScreen.hideAsync()
        router.replace('/(auth)');
      } else if(
        onBoarded === true &&
        authToken !== null &&
        !isTokenExpired(authToken) && settingDone === false
      ){
        SplashScreen.hideAsync()
        router.replace('/(settingUp)');
      }else if (
        onBoarded === true &&
        authToken !== null &&
        !isTokenExpired(authToken) && settingDone === true
      ) {
         SplashScreen.hideAsync()
        router.replace('/(musicTabs)');
      }
    }
  }, [fontsLoaded, animation, onBoarded, authToken]);

  return (
    <>
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
        initialRouteName={"onboarding2"}
      >
        {/* Define all possible screens here */}
        <Stack.Screen name="onboarding2" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(musicTabs)" />
        <Stack.Screen name="(communityTabs)" />
        <Stack.Screen name="(settingUp)" />
        <Stack.Screen name="loadingScreen" />
        <Stack.Screen
          name="nowPlaying"
          options={{
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen
          name="createPlaylist"
          options={{
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen name="communityDetails" />
        <Stack.Screen
          name="withdrawFundsScreen"
          options={{
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen
          name="connectedAccountsScreen"
          options={{
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen name="settings" />
        <Stack.Screen
          name="payment"
          options={{
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen name="wallet" />
        <Stack.Screen
          name="queue"
          options={{
            presentation: "fullScreenModal",
          }}
        />
      </Stack>
    </>
  );
}

export default Sentry.wrap(function _RootLayout() {
  const queryClient = new QueryClient();
  const { clearAuth} = useAuthActions()
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <NotificationProvider>
          <QueryClientProvider client={queryClient}>
            <PortalProvider>
              <BottomSheetModalProvider>
                    <MusicPlayerProvider>
                      {/* <Pressable className="bg-Orange/08 absolute bottom-[120px] -[12px] z-[1000px] h-[60px] w-[60px]  items-center justify-center rounded-full" onPress={clearAuth}>
            <Text className="text-[#fff]">Reset</Text>
           </Pressable> */}
                      <KeyboardProvider>
                        <AppContent />
                      </KeyboardProvider>
                    </MusicPlayerProvider>
              </BottomSheetModalProvider>
            </PortalProvider>
          </QueryClientProvider>
        </NotificationProvider>
    </GestureHandlerRootView>
  );
});
