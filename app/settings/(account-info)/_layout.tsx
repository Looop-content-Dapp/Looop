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
      <Stack.Screen name="personalInfo" />
      <Stack.Screen name="phone-number" />
      <Stack.Screen name="email-address" />
    </Stack>
  )
}