import React from "react";
import { Stack } from "expo-router";

export default function _CreatorOnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#040405",
        },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
