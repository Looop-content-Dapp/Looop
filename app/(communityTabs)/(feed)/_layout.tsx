import React from "react";
import { Stack } from "expo-router";
import { PortalProvider } from '@gorhom/portal';

export default function FeedLayout() {
  return (
   <PortalProvider>
     <Stack
    screenOptions={{
        headerShown: true,
        contentStyle: {
            backgroundColor: "#040405",
        },
        headerStyle: {
            backgroundColor: "#040405",
          },
      }}
    >
        <Stack.Screen name="index" />
        <Stack.Screen name="_Feedscreens"   options={{
          headerShown: false,
        }} />
    </Stack>
   </PortalProvider>
  );
};
