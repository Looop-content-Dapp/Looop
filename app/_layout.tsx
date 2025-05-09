import "react-native-get-random-values";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Provider } from "react-redux";
import { router, SplashScreen, Stack } from "expo-router";
import { GiphySDK } from "@giphy/react-native-sdk";
import { PersistGate } from "redux-persist/integration/react";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { playbackService } from '@/services/PlaybackService';
import { setupPlayer } from '../services/PlaybackService';
import { PortalProvider } from "@gorhom/portal";
import { AbstraxionProvider } from "@burnt-labs/abstraxion-react-native";
import { Buffer } from "buffer";
import crypto from "react-native-quick-crypto";

// @ts-ignore
global.crypto = crypto as unknown as Crypto;
global.Buffer = Buffer;

// In your app initialization
setupPlayer();

import { useFonts } from "expo-font";
import "../global.css";

import store, { persistor } from "../redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import TrackPlayer from 'react-native-track-player';
import * as Sentry from '@sentry/react-native';
import { NotificationProvider } from "@/context/NotificationContext";
import { Pressable, Text } from "react-native";



Sentry.init({
  dsn: 'https://0d0b04e2a4f98122a0e2014b2a86b10c@o4509128364195840.ingest.de.sentry.io/4509128384774224',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const config = {
    // Network configuration
    rpcUrl: "https://rpc.xion-testnet-2.burnt.com:443",
    restUrl: "https://api.xion-testnet-2.burnt.com:443",
    gasPrice: "0.001uxion",
    granter: "xion1m27pnvh7pp5dw0wda7w00cxr3kht8uxt2fjayn",

    // Optional configurations
    treasury: "xion13jetl8j9kcgsva86l08kpmy8nsnzysyxs06j4s69c6f7ywu7q36q4k5smc",
    callbackUrl: "looop://",

  };

// Register the playback service
TrackPlayer.registerPlaybackService(() => playbackService);

GiphySDK.configure({ apiKey: "R25Je48LLUMFnuTOGV2kibJO2xFGSR6i" });
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
function AppContent() {
  const [fontsLoaded, fontsError] = useFonts({
    PlusJakartaSansBold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    PlusJakartaSansLight: require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    PlusJakartaSansMedium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    PlusJakartaSansRegular: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    TankerRegular: require("../assets/fonts/Tanker-Regular.otf"),
  });

  useEffect(() => {
    if (fontsLoaded && !fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

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
        <Stack.Screen name="uploadMusic" options={{
          presentation: "fullScreenModal"
        }} />
        <Stack.Screen
          name="withdrawFundsScreen"
          options={{
            presentation: "fullScreenModal"
          }} />
        <Stack.Screen name="connectedAccountsScreen"
          options={{
            presentation: "fullScreenModal"
          }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="payment"
          options={{
            presentation: "fullScreenModal"
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
         <AbstraxionProvider config={config}>
         <NotificationProvider>
      <QueryClientProvider client={queryClient}>
      <PortalProvider>
        <BottomSheetModalProvider>

          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
            <MusicPlayerProvider>

        {/* <Pressable className="bg-Orange/08 absolute bottom-[120px] -[12px] z-[1000px] h-[60px] w-[60px]  items-center justify-center rounded-full" onPress={async () => {
                router.push("/(settingUp)")
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
      </AbstraxionProvider>
    </GestureHandlerRootView>
  );
});
