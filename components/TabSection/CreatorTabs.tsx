import React, { useRef, useCallback } from "react";
import { Tabs, useRouter } from "expo-router";
import {
  DashboardCircleIcon,
  HeadphonesIcon,
  PlusSignIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@hugeicons/react-native";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import UploadBottomSheet from "../UploadBottomSheet";

export default function CreatorTab() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleUploadPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#4CD964",
          tabBarInactiveTintColor: "#787A80",
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: "#0F1014",
            height: 64,
            borderRadius: 32,
            position: "relative",
            bottom: 30,
            alignSelf: "center",
            width: "100%",
            maxWidth: "85%",
            paddingHorizontal: 20,
            borderTopWidth: 0,
            elevation: 0,
            shadowColor: "transparent",
            alignItems: "center",
            left: 0,
            right: 0,
          },
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: "#040405",
            height: 109,
            borderBottomColor: "#1D2029",
          },
          tabBarIconStyle: { marginTop: 10 },
        }}
      >
        <Tabs.Screen
          name="(dashboard)"
          options={{
            title: "Overview",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabItem}>
                <DashboardCircleIcon
                  size={22}
                  color={color}
                  variant={focused ? "solid" : "stroke"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="(artisteMusic)"
          options={{
            title: "Music",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabItem}>
                <HeadphonesIcon
                  size={22}
                  color={color}
                  variant={focused ? "solid" : "stroke"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="(upload)"
          options={{
            title: "Upload",
            tabBarButton: () => (
              <View style={{ marginLeft: 15 }}>
                <UploadBottomSheet />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="(tribe)"
          options={{
            title: "Tribe",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabItem}>
                <UserGroupIcon
                  size={22}
                  color={color}
                  variant={focused ? "solid" : "stroke"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="(Artistprofile)"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabItem}>
                <UserCircleIcon
                  size={22}
                  color={color}
                  variant={focused ? "solid" : "stroke"}
                />
              </View>
            ),
          }}
        />
      </Tabs>

    </>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  uploadButton: {
    backgroundColor: "#4CD964",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    position: "absolute",
    bottom: -20,
  },
});
