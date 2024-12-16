import React from "react";
import { Slot, Stack } from "expo-router";
import { Image, Text, View } from "react-native";
import { user } from "../../../utils/ArstsisArr";
import { Avatar } from "react-native-elements";
import { useHeader } from "@/hooks/useHeader";

const defaultImage = 'https://i.pinimg.com/564x/61/eb/84/61eb846a2795466215c64c0e97aa13c3.jpg';
export default () => {
    const headerConfig = useHeader({title: "Library"})
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
        headerBackTitle: ""
      }}
    >
        <Stack.Screen name="index" options={headerConfig} />
        <Stack.Screen name="favouriteSongs"
         options={{
            headerShown: false
        }} />
        <Stack.Screen name="savedAlbums"
         options={{
            headerShown: false
        }} />
        <Stack.Screen name="myPlaylist"
        options={{
            headerShown: false
        }}  />
            <Stack.Screen name="musicSearch"
        options={{
            headerShown: false,
            presentation: "modal"
        }}  />
    </Stack>
  );
};
