import React from "react";
import { router, Slot, Stack } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Header } from 'react-native-elements';
import { Notification02Icon } from "@hugeicons/react-native";

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
             headerTitle: () => (
                <View className="flex-1" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, height: 74, paddingRight: 24}}>
                  <Text style={{ fontSize: 20, color: '#f4f4f4', fontFamily: 'PlusJakartaSansBold' }}>
                  {getGreeting()}
                  </Text>
                  <View className="flex-row items-center gap-x-[20px]">
                    <TouchableOpacity onPress={() => router.navigate("/notification")}>
                    <Notification02Icon size={24} color="#787A80" variant="stroke" />
                    </TouchableOpacity>

                  <Avatar
                    source={{ uri: "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg" }}
                    size={40}
                    rounded
                    onPress={() => router.push("/(profile)")}
                  />
                  </View>

                </View>
              ),
        }} />
        <Stack.Screen name="artist/[id]" options={{
              headerShown: false
        }} />
    </Stack>
  );
};
