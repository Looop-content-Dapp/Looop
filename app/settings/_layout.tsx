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
      <Stack.Screen
        name="(account-info)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(accountSecurity)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(notification)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(languages&display)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(preference)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
