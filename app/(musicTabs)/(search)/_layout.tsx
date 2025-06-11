import React from "react";
import { Stack } from "expo-router";
import { useHeader } from "@/hooks/core/useHeader";

export default function HomeLayout() {
    const headerConfig = useHeader({title: "Discover"})
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
        headerTintColor: "#fff",
      }}
    >
        <Stack.Screen name="index" options={headerConfig} />
        <Stack.Screen name="musicSearch"         options={{
            headerShown: false
        }}
  />
    </Stack>
  );
};
