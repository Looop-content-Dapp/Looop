import React from "react";
import { Slot, Stack } from "expo-router";

export default function HomeLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#000000",
        },
        headerStyle: {
            backgroundColor: "#040405",
          },
      }}
    />
  );
};
