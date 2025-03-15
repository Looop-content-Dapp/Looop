import { View, Text, ImageBackground, TouchableOpacity, Pressable } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import React from "react";
import { ScrollView } from "react-native";

const TopSection = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Pressable>
        <ImageBackground
          source={require("../../assets/images/new.jpg")}
          style={{ width: wp("85%") }}
          className="h-[222px] mt-[32px] rounded-[10px] ml-[16px] overflow-hidden"
          resizeMode="cover"
        >
          {/* Added semi-transparent overlay for better text readability */}
          <View className="absolute inset-0 bg-black/30" />
          <View className="absolute bottom-8 left-[24px] right-[30px] items-start">
            <Text className="text-[36px] font-TankerRegular tracking-[-0.36px] text-white leading-[38px] mb-1 drop-shadow-lg">
              New Drops Mix
            </Text>
            <Text className="text-white font-PlusJakartaSansMedium text-[14px] drop-shadow-md">
              Listen to some of the hottest new music from Looop superstar creators.
            </Text>
          </View>
        </ImageBackground>
      </Pressable>

      <Pressable>
        <ImageBackground
          source={require("../../assets/images/discover.jpg")}
          style={{ width: wp("85%") }}
          className="h-[222px] mt-[32px] rounded-[10px] ml-[16px] overflow-hidden"
          resizeMode="cover"
        >
          {/* Added semi-transparent overlay for better text readability */}
          <View className="absolute inset-0 bg-black/30" />
          <View className="absolute top-8 left-[24px] right-[30px] items-start">
            <Text className="text-[36px] font-TankerRegular text-white leading-[38px] mb-1 drop-shadow-lg">
              THE DISCOVERY CHANNEL
            </Text>
            <Text className="text-white font-PlusJakartaSansMedium text-[14px] drop-shadow-md">
              Discover what all your friends are listening to right now!
            </Text>
          </View>
        </ImageBackground>
      </Pressable>
    </ScrollView>
  );
};

export default TopSection;
