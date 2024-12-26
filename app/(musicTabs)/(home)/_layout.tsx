import React from "react";
import { useHeader } from "@/hooks/useHeader";
import { Stack } from "expo-router";
import { View } from "react-native";
import { Notification02Icon } from "@hugeicons/react-native";
import { Avatar } from "react-native-elements";
import { useAppSelector } from "@/redux/hooks";
import { router } from "expo-router";

export default function HomeLayout() {
  const headerConfig = useHeader({ title: "" });
  const { userdata } = useAppSelector((state) => state.auth);
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
          ...headerConfig,
          headerRight: () => (
            <View className="flex-row  items-center gap-x-[10px]">
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
