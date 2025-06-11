import React from 'react'
import { Stack } from 'expo-router'

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
      <Stack.Screen name="language" />
      <Stack.Screen name="display" />
    </Stack>
  )
}
