import React, { useEffect } from "react";
import { StyleSheet, StatusBar, ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";
import { useAppSelector } from "@/redux/hooks";

import AppLogo from "@/assets/images/logo";

export default function Page() {
  const { userdata } = useAppSelector((state) => state.auth);
  const { onBoarded } = useAppSelector((state) => state.misc);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onBoarded === false && userdata === null) {
        router.replace("/(settingUp)");
      } else if (onBoarded === true && userdata === null) {
        router.replace("/(auth)/signin");
      } else {
        router.replace("/(musicTabs)/(home)/");
        // router.replace("/(settingUp)/");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [userdata]);

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: "#FF6D1B" }]}>
        <StatusBar
          backgroundColor={"transparent"}
          translucent={true}
          barStyle="light-content"
        />
        <View className="flex-1 items-center bg-[#FF6D1B] justify-center gap-y-3">
          <AppLogo />
          <ActivityIndicator size={36} className="text-white" />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
