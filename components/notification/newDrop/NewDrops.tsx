import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Music from './Music'
import Collectible from './Collectible'

const NewDrops = () => {
    const [selectedTab, setSelectedTab]= useState("Music")
  return (
    <View>
      {/* Tab Navigation */}
      <View className="flex-row gap-x-[24px] px-[24px] items-center">
                {["Music", "Collectible"].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setSelectedTab(tab)}
                        className={`text-[16px] font-PlusJakartaSansBold ${
                            selectedTab === tab
                                ? "bg-Orange/08 px-[16px] py-[10px] items-center justify-center rounded-[10px]"
                                : "bg-[#12141B] px-[16px] py-[10px] items-center justify-center rounded-[10px]"
                        }`}
                    >
                        <Text
                            className={`text-[16px] font-PlusJakartaSansBold ${
                                selectedTab === tab
                                    ? "text-[#f4f4f4]"
                                    : "text-[#787A80]"
                            }`}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView className="flex-1 mt-[24px]">
                {selectedTab === "Music" && <Music />}
                {selectedTab === "Collectible" && <Collectible />}
            </ScrollView>
    </View>
  )
}

export default NewDrops
