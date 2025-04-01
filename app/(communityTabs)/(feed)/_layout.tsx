import React from "react";
import { Stack } from "expo-router";
import { useHeader } from "@/hooks/useHeader";

export default function FeedLayout() {
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
      }}
    >
        <Stack.Screen name="index" />
    </Stack>
  );
};
