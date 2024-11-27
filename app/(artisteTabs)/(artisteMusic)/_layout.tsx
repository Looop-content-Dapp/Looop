import React from "react";
import { Slot, Stack } from "expo-router";
import { Image, Text, View } from "react-native";
import { user } from "../../../utils/ArstsisArr";
import { Avatar } from "react-native-elements";

const defaultImage = 'https://i.pinimg.com/564x/61/eb/84/61eb846a2795466215c64c0e97aa13c3.jpg';
export default function HomeLayout() {
    // Function to get greeting based on time of day
function getGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Start your morning with music';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Great afternoon for music';
    } else {
      return 'Evening vibes huh?';
    }
  }
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
              headerShown:  false
        }} />
    </Stack>
  );
};
