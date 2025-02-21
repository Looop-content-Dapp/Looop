import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Provider } from "react-redux";
import { SplashScreen, Stack } from "expo-router";
import { GiphySDK } from "@giphy/react-native-sdk";
import { PersistGate } from "redux-persist/integration/react";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { useFonts } from "expo-font";
import "../global.css";

import store, { persistor } from "../redux/store";
import { Pressable, Text } from "react-native";
import { account } from "@/appWrite";
import { Alert } from "react-native";

GiphySDK.configure({ apiKey: "R25Je48LLUMFnuTOGV2kibJO2xFGSR6i" });
SplashScreen.preventAutoHideAsync();

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
        </Stack>
        </>
  );
}

export default function _RootLayout() {
  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <BottomSheetModalProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <Pressable className="bg-Orange/08 absolute bottom-[120px] right-[12px] z-[1000px] h-[60px] w-[60px]  items-center justify-center rounded-full" onPress={async () => {
          const session = await account.getSession('current');
          if (session) {
              await account.deleteSession(session.$id);
              Alert.alert(
                  "Success",
                  "You have been logged out",
                  [
                      {
                          text: "OK",
                          onPress: () => {
                              persistor.purge();
                          },
                      },
                  ])
          }
        }}>
            <Text className="text-[#fff]">Reset</Text>
        </Pressable> */}
        <KeyboardProvider>
          <AppContent />
        </KeyboardProvider>
      </PersistGate>
    </Provider>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
