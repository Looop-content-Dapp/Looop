import { useHeader } from "@/hooks/core/useHeader";
import { Stack } from "expo-router";
import React from "react";

export default function HomeLayout() {
  const headerConfig = useHeader({ title: "" });

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        contentStyle: {
          backgroundColor: "#000000",
        },
        headerStyle: {
          backgroundColor: "#040405",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          ...headerConfig,
        }}
      />
      <Stack.Screen
        name="_screens"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
