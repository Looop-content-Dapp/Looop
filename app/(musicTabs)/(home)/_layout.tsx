import React from "react";
import { useHeader } from "@/hooks/useHeader";
import { Stack } from "expo-router";
import { View } from "react-native";
import { Notification02Icon } from "@hugeicons/react-native";
import { Avatar } from "react-native-elements";
import { useAppSelector } from "@/redux/hooks";
import { router } from "expo-router";

export default function HomeLayout() {
  const headerConfig = useHeader({ title: "" });
  const { userdata } = useAppSelector((state) => state.auth);
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
      <Stack.Screen
        name="index"
        options={{
          ...headerConfig,
        }}
      />
      <Stack.Screen
        name="artist/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
