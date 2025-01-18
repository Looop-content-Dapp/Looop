import React from 'react';
import { Tabs } from 'expo-router';
import { DiscoverCircleIcon, Home11Icon, Notification02Icon, UserGroupIcon } from '@hugeicons/react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../Header';
import ExploreHeader from '../ExploreHeader';

export default function CommunityTab() {
  return (
    <Tabs
    screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF7700",
        tabBarInactiveTintColor: "#787A80",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "#040405",
          borderTopColor: "#040405"
        },
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: "#040405",
          height: 109,
          borderBottomColor: "#1D2029"
        },
      }}
      initialRouteName="(feed)"
    >
      <Tabs.Screen
        name='(feed)'
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home11Icon size={24} color={color} variant={focused ? "solid" : "stroke"} />
          ),
          headerTitle: () => (
                <Header title='Feed' />
          ),
        }}
      />
      <Tabs.Screen
        name='(explore)'
        options={{
          tabBarIcon: ({ color, focused }) => (
            <DiscoverCircleIcon size={24} color={color} variant={focused ? "solid" : "stroke"} />
          ),
          headerTitle: () => (
            <ExploreHeader title='Discover' />
          ),
        }}
      />
      <Tabs.Screen
        name='(notification)'
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Notification02Icon size={24} color={color} variant={focused ? "solid" : "stroke"} />
          ),
          headerTitle: "Notification", // Set header title for Notification
        }}
      />
      <Tabs.Screen
        name='(community)'
        options={{
          tabBarIcon: ({ color, focused }) => (
            <UserGroupIcon size={24} color={color} variant={focused ? "solid" : "stroke"} />
          ),
          headerTitle: "Community", // Set header title for Community
        }}
      />
    </Tabs>
  );
}
