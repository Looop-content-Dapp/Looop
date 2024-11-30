import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { ArrowLeft02Icon } from "@hugeicons/react-native";
import NewDrops from "../../components/notification/newDrop/NewDrops";
import Friends from "../../components/notification/friends/Friends";
import { router } from "expo-router";

const index = () => {
  const [selectedTab, setSelectedTab] = useState("New drops");
  return (
    <SafeAreaView style={{ flex: 1, minHeight: "100%" }}>
      <View className="flex-row items-center pl-[24px] py-[24px] gap-x-[12px]">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft02Icon size={23} color="#fff" />
        </TouchableOpacity>
        <Text className="text-[20px] font-PlusJakartaSansBold text-[#fff]">
          What's new
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row gap-x-[24px] px-[24px] items-center">
        {["New drops", "Friends"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            className="p-[12px] h-[56px]"
          >
            <Text
              className={`text-[16px] font-PlusJakartaSansBold ${
                selectedTab === tab ? "text-[#f4f4f4]" : "text-[#787A80]"
              }`}
            >
              {tab}
            </Text>
            {selectedTab === tab && (
              <View
                style={{
                  height: 2,
                  backgroundColor: "#FF6D1B",
                  marginTop: 9,
                }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 mt-[24px]">
        {selectedTab === "New drops" && <NewDrops />}
        {selectedTab === "Friends" && <Friends />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
