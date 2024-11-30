import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { Slot, Stack, Tabs } from "expo-router";

export default () => {
  return (
    <Slot
      screenOptions={{
        headerShown: true,
        contentStyle: {
          backgroundColor: "#040405",
        },
      }}
    ></Slot>
  );
};
