import React from "react";
import { Slot, Stack } from "expo-router";
export default function ExploreCommunityLayout() {

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
      }}
    >
        <Stack.Screen name="index" />
        {/* <Stack.Screen name="favouriteSongs" /> */}
    </Stack>
  );
};
