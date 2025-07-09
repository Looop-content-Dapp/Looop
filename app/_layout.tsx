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
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { setupPlayer } from "../services/PlaybackService";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});
// In your app initialization
setupPlayer();

import { useFonts } from "expo-font";
import "../global.css";

import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import { NotificationProvider } from "@/context/NotificationContext";
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TrackPlayer from "react-native-track-player";
import store, { persistor } from "../redux/store";
import { Animated, Pressable } from "react-native";
import { Text } from "react-native";
import { useAppSelector } from "@/redux/hooks";

Sentry.init({
  dsn: "https://0d0b04e2a4f98122a0e2014b2a86b10c@o4509128364195840.ingest.de.sentry.io/4509128384774224",

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Register the playback service
TrackPlayer.registerPlaybackService(() => playbackService);

GiphySDK.configure({ apiKey: "R25Je48LLUMFnuTOGV2kibJO2xFGSR6i" });

function AppContent() {
  const { userdata } = useAppSelector((state) => state.auth);
  const { onBoarded } = useAppSelector((state) => state.misc);
  const animation = useMemo(() => new Animated.Value(1), []);
  const [fontsLoaded, fontsError] = useFonts({
    PlusJakartaSansBold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    PlusJakartaSansLight: require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    PlusJakartaSansMedium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    PlusJakartaSansRegular: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    TankerRegular: require("../assets/fonts/Tanker-Regular.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    if (!fontsLoaded) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        SplashScreen.hideAsync()
        // Navigate to appropriate screen after animation
        if (onBoarded === false && userdata === null) {
          router.replace("/onboarding2");
        } else if (onBoarded === true && userdata === null) {
          router.replace("/(auth)");
        } else {
          router.replace("/(musicTabs)/(home)/");
        }
      });
    }
  }, [fontsLoaded, animation, onBoarded, userdata]);

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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <NotificationProvider>
          <QueryClientProvider client={queryClient}>
            <PortalProvider>
              <BottomSheetModalProvider>
                <Provider store={store}>
                  <PersistGate loading={null} persistor={persistor}>
                    <MusicPlayerProvider>
                      {/* <Pressable className="bg-Orange/08 absolute bottom-[120px] -[12px] z-[1000px] h-[60px] w-[60px]  items-center justify-center rounded-full" onPress={async () => {
                router.push("/(auth)/enterUserName")
              }}>
            <Text className="text-[#fff]">Reset</Text>
           </Pressable> */}
                      <KeyboardProvider>
                        <AppContent />
                      </KeyboardProvider>
                    </MusicPlayerProvider>
                  </PersistGate>
                </Provider>
              </BottomSheetModalProvider>
            </PortalProvider>
          </QueryClientProvider>
        </NotificationProvider>
    </GestureHandlerRootView>
  );
});
