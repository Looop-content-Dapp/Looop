import React from 'react'
import { Slot, Stack } from 'expo-router'

export default function _CreatorOnboardingLayout() {
  return (
    <Slot screenOptions={{
        headerShown: false,
        contentStyle: {
            backgroundColor: "#040405"
        }
    }} >
    </Slot>
  )
}
