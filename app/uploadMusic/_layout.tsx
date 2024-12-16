import React from "react";
import { Slot, Stack } from "expo-router";

export default () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#040405",
        },
      }}
    >
    </Stack>
  );
};
