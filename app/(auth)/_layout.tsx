import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  return (
    <>
      <StatusBar translucent={true} backgroundColor="#040405" style="light" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#040405",
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#040405",
            },
          }}
        />
      </SafeAreaView>
    </>
  );
}
