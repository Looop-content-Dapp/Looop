import React from "react";
import { router, Stack } from "expo-router";
import { Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import { Notification02Icon } from "@hugeicons/react-native";
import { useAppSelector } from "@/redux/hooks";

export default function HomeLayout() {
  const { userdata } = useAppSelector((state) => state.auth);

  function getGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Start your morning with music";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Great afternoon for music";
    } else {
      return "Evening vibes huh?";
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
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => (
            <Text className="text-xl text-[#f4f4f4] font-PlusJakartaSansBold">
              {getGreeting()}
            </Text>
          ),
          title: "",
          headerRight: () => (
            <View className="flex flex-row items-center gap-x-[10px]">
              <Notification02Icon
                size={24}
                color="#787A80"
                variant="stroke"
                onPress={() => router.navigate("/notification")}
              />

              <Avatar
                source={{
                  uri:
                    userdata?.profileImage.length === 0
                      ? "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg"
                      : userdata?.profileImage,
                }}
                size={40}
                rounded
                onPress={() => router.push("/(profile)")}
                avatarStyle={{
                  borderWidth: 2,
                  borderColor: "#FF7700",
                }}
              />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="artist/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
