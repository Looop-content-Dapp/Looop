import { View, Text, ImageBackground } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import React from "react";

const TopSection = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/NewDrop.png")}
      style={{ width: wp("95%") }}
      className="h-[222px] mt-[32px] rounded-[24px] ml-[16px] overflow-hidden"
      resizeMode="cover"
    >
      <View className="absolute bottom-9 left-[24px] right-[30px]">
        <Text className="text-[24px] font-PlusJakartaSansBold text-[#0A0B0F] leading-[30px]">
          New Drops Mix
        </Text>
        <Text className="text-[#12141B] font-PlusJakartaSansRegular text-[14px]">
          Discover new sounds from some of the hottest rising talents in the
          globe.
        </Text>
      </View>
    </ImageBackground>
  );
};

export default TopSection;
