import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { Slot, Stack, Tabs } from "expo-router";

export default () => {
  return (
    <Stack
    screenOptions={{
      headerShown: true,
      contentStyle: {
        backgroundColor: "#040405",
      },
      headerStyle: {
        backgroundColor: "#040405",
      },
      title: "",
    }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="payInCrypto" />
    </Stack>
  );
};
