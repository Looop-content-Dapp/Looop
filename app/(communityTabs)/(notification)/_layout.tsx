import React from "react";
import { Slot, Stack } from "expo-router";
import { Image, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import { useHeader } from "@/hooks/useHeader";

const defaultImage = 'https://i.pinimg.com/564x/61/eb/84/61eb846a2795466215c64c0e97aa13c3.jpg';
export default function ExploreCommunityLayout() {
 const headerConfig = useHeader({title: "Notification"})
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
        <Stack.Screen name="index"
         options={{
          ...headerConfig,
        }}  />
        {/* <Stack.Screen name="favouriteSongs" /> */}
    </Stack>
  );
};
