import React from "react";
import { Stack } from "expo-router";
import { useHeader } from "@/hooks/core/useHeader";

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
        <Stack.Screen name="index"
        options={{
          ...headerConfig,
        }} />
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
          <Stack.Screen name="_Libscreens"
       options={{
          headerShown: false,
        }} />
    </Stack>
  );
};
