import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _UserWalletlayout() {
  return (
    <Stack  screenOptions={{
        headerShown: true,
        contentStyle: {
          backgroundColor: "#040405",
        },
        headerStyle: {
          backgroundColor: "#040405",
        },
        title: "",
      }}
      />
  )
}