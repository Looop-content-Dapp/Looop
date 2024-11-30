import React from "react";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#000000",
        },
        headerStyle: {
          backgroundColor: "#040405",
        },
        title: "",
      }}
    >
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen
        name="profileFollowing"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
