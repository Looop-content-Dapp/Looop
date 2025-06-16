import { Stack } from "expo-router";
import React from "react";

export default function HomeLayout() {
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
