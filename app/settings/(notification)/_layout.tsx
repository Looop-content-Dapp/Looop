import { View, Text } from 'react-native'
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
      <Stack.Screen name="(music)" />
      <Stack.Screen name="(security)" />
      <Stack.Screen name="(billing)" />
      <Stack.Screen name="(nft)" />
      <Stack.Screen name="(social)" />
    </Stack>
  )
}
