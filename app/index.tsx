import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAppSelector } from "@/redux/hooks";
import AppLogo from "@/assets/images/logo";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function Page() {
  const { userdata } = useAppSelector((state) => state.auth);
  const { onBoarded } = useAppSelector((state) => state.misc);
  const animation = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.hideAsync();
        // Add any additional asset loading here
        await Promise.all([]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
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
  }, [isAppReady, animation, onBoarded, userdata]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#FF6D1B" }]}>
      <View className="flex-1 items-center bg-[#FF6D1B] justify-center gap-y-3">
        <AppLogo />
      </View>
      {!isAppReady && (
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { opacity: animation }]}
        >
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants?.expoConfig?.splash?.resizeMode || "contain",
              transform: [{ scale: animation }],
            }}
            source={{ uri: Constants?.expoConfig?.splash?.image }}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
