import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { DashboardCircleIcon, HeadphonesIcon, PlusSignIcon, UserCircleIcon, UserGroupIcon } from '@hugeicons/react-native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

export default function CreatorTab() {
    const { push }= useRouter()
  return (
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
          position: 'absolute',
          bottom: 32,
          left: 20,
          right: 20,
          paddingHorizontal: 20,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: 'transparent',
        },
        tabBarItemStyle: {
          height: 64,
          padding: 0,
        },
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: "#040405",
          height: 109,
          borderBottomColor: "#1D2029"
        },
      }}
      sceneContainerStyle={{
        backgroundColor: "#040405",
      }}
    >
      <Tabs.Screen
        name='(dashboard)'
        options={{
          title: "Overview",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <DashboardCircleIcon size={22} color={color} variant={focused ? "solid" : "stroke"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='(artisteMusic)'
        options={{
          title: "Music",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <HeadphonesIcon size={22} color={color} variant={focused ? "solid" : "stroke"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='(upload)'
        options={{
          title: "Upload",
          tabBarIcon: ({ focused }) => (
            <TouchableOpacity onPress={() => push("/uploadMusic")} style={styles.uploadButton}>
           <PlusSignIcon  size={24} color="#000000" variant="solid" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name='(tribe)'
        options={{
          title: "Tribe",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <UserGroupIcon size={22} color={color} variant={focused ? "solid" : "stroke"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='(Artistprofile)'
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <UserCircleIcon size={22} color={color} variant={focused ? "solid" : "stroke"} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  uploadButton: {
    backgroundColor: '#4CD964',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'absolute',
    bottom: -0,
  },
});
