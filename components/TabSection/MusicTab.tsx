import React from "react";
import { Tabs } from "expo-router";
import {
  DiscoverCircleIcon,
  Home11Icon,
  LibrariesIcon,
} from "@hugeicons/react-native";
import { Image, Platform, Text, View } from "react-native";
import { user } from "../../utils/ArstsisArr"; // Ensure this is correctly importing the user object

export default function MusicTab() {
  // Fallback for image in case `user?.image` is null or undefined
  const defaultImage =
    '"https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg"'; // Placeholder image URL

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF7700",
        tabBarInactiveTintColor: "#787A80",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#040405",
          height: Platform.OS === "android" ? 70 : 80,
          borderTopWidth: 0,
        },
        tabBarIconStyle: { marginTop: Platform.OS === "android" ? 10 : 8 },
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: "#040405",
          height: 109,
          borderBottomColor: "#1D2029",
        },
        tabBarPosition: "bottom",
      }}
      initialRouteName="(home)"
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home11Icon
              size={24}
              color={color}
              variant={focused ? "solid" : "stroke"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <DiscoverCircleIcon
              size={24}
              color={color}
              variant={focused ? "solid" : "stroke"}
            />
          ),
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "#f4f4f4",
                  fontFamily: "PlusJakartaSansBold",
                }}
              >
                Discover
              </Text>
              <Image
                source={{ uri: user?.image || defaultImage }} // Fallback to default image
                style={{ width: 40, height: 40, borderRadius: 20 }}
                className="bg-white"
                onError={(e) =>
                  console.log("Image failed to load:", e.nativeEvent.error)
                }
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(library)"
        options={{
          title: "Library",
          tabBarIcon: ({ color, focused }) => (
            <LibrariesIcon
              size={24}
              color={color}
              variant={focused ? "solid" : "stroke"}
            />
          ),
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "#f4f4f4",
                  fontFamily: "PlusJakartaSansBold",
                }}
              >
                Library
              </Text>
              <Image
                source={{ uri: user?.image || defaultImage }} // Fallback to default image
                style={{ width: 40, height: 40, borderRadius: 20 }}
                className="bg-white"
                onError={(e) =>
                  console.log("Image failed to load:", e.nativeEvent.error)
                }
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
