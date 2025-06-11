import { Stack } from "expo-router";
import React from "react";

export default function _Setttingslayout() {
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
      <Stack.Screen name="two-factor" />
      <Stack.Screen name="verify-2fa" />
      <Stack.Screen name="passcode" />
      <Stack.Screen name="face-id" />
    </Stack>
  );
}
