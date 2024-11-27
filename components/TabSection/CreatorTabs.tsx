import React from 'react';
import { Tabs } from 'expo-router';
import { DashboardCircleIcon, DiscoverCircleIcon, HeadphonesIcon, Home11Icon, LibrariesIcon, UserCircleIcon, UserGroupIcon } from '@hugeicons/react-native';

export default function CreatorTab() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#A187B5",
        tabBarInactiveTintColor: "#787A80",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#0A0B0F",
          borderTopColor: "#040405"
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
          tabBarIcon: ({ color, focused }) => (
            <DashboardCircleIcon size={24} color={color} variant={focused ? "solid" : "stroke"} />
          ),
        }}
      />
      <Tabs.Screen
        name='(artisteMusic)'
        options={{
          title: "Music",
          tabBarIcon: ({ color, focused }) => (
            <HeadphonesIcon size={24} color={color} variant={focused ? "solid" : "stroke"} />
          ),
        }}
      />
       <Tabs.Screen
        name='(tribe)'
        options={{
          title: "Tribe",
          tabBarIcon: ({ color, focused }) => (
            <UserGroupIcon size={24} color={color} variant={focused ? "solid" : "stroke"} />
          ),
        }}
      />
    <Tabs.Screen
        name='(Artistprofile)'
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <UserCircleIcon size={24} color={color} variant={focused ? "solid" : "stroke"} />
          ),
        }}
      />
    </Tabs>
  );
}
