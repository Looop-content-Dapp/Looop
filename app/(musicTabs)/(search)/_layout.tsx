import React from "react";
import { Slot, Stack } from "expo-router";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { user } from "../../../utils/ArstsisArr";
import { Avatar } from "react-native-elements";
import { Ionicons } from '@expo/vector-icons';

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
        headerTintColor: "#fff",
      }}
    >
        <Stack.Screen name="index" options={{
             headerTitle: () => (
                <View className="flex-1" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, height: 74, paddingRight: 24}}>
                <Text style={{ fontSize: 20, color: '#f4f4f4', fontFamily: 'PlusJakartaSansBold' }}>
                Discover
                </Text>
                <Avatar
                  source={{ uri: "https://i.pinimg.com/564x/0d/f4/f3/0df4f34ee0111aa6e8c82d498abd1a28.jpg" }}
                  size={40}
                  rounded
                />
              </View>
              ),
        }} />
        <Stack.Screen name="musicSearch"         options={{
            headerShown: false
        }}
  />
    </Stack>
  );
};
