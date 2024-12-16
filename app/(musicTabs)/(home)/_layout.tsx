import React from "react";
import { useHeader } from "@/hooks/useHeader";
import { Stack } from "expo-router";

export default function HomeLayout() {
  const headerConfig = useHeader({title: ""})
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
        options={headerConfig}
      />
      <Stack.Screen
        name="artist/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
