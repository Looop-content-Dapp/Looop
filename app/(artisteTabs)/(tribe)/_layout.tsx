import React from "react";
import { Slot, Stack } from "expo-router";
import { Image, Text, View } from "react-native";
import { user } from "../../../utils/ArstsisArr";
import { Avatar } from "react-native-elements";

export default function HomeLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        contentStyle: {
          backgroundColor: "#000000",
        },
        headerStyle: {
            backgroundColor: "#040405",
          },
      }}
    >
        <Stack.Screen name="index" options={{
              headerShown: false
        }} />
    </Stack>
  );
};
