import React from "react";
import { AlbumUploadProvider } from "../../context/AlbumUploadContext";
import { Slot, Stack } from "expo-router";

export default () => {
  return (
    <AlbumUploadProvider>
    <Stack
    screenOptions={{
      headerShown: true,
      contentStyle: {
        backgroundColor: "#040405",
      },
      headerStyle: {
        backgroundColor: "#040405",
      },
      title: "",
    }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="uploadAlbum" />
    </Stack>
   </AlbumUploadProvider>
  );
};
