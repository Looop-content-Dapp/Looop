import React from "react";
import { Stack } from "expo-router";

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
      <Stack.Screen name="payWithCard" />
      <Stack.Screen name="cardAuthentication" />
      <Stack.Screen 
        name="success" 
        options={{
          headerShown: false,
          gestureEnabled: false
        }}
      />
    </Stack>
  );
};
