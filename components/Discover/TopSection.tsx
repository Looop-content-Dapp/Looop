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
      <View className="absolute bottom-9 left-[24px] right-[30px]">
        <Text className="text-[24px] font-TankerRegular text-[#f4f4f4] leading-[30px]">
          New Drops Mix
        </Text>
        <Text className="text-[#fff] font-TankerRegular text-[14px]">
          Listen to some of the hottest new music from Looop superstar creators.
        </Text>
      </View>
    </ImageBackground>
 </Pressable>

 <Pressable>
    <ImageBackground
      source={require("../../assets/images/discover.jpg")}
      style={{ width: wp("95%") }}
      className="h-[222px] mt-[32px] rounded-[10px] ml-[16px] overflow-hidden"
      resizeMode="cover"
    >
      <View className="absolute top-[20px] left-[24px] right-[30px]">
        <Text className="text-[24px] font-TankerRegular text-[#f4f4f4] leading-[30px]">
           THE DISCOVERY CHANNEL
        </Text>
        <Text className="text-[#fff] font-TankerRegular text-[14px]">
          Discover what all your friends are listening to right now!
        </Text>
      </View>
    </ImageBackground>
    </Pressable>

</ScrollView>
  );
};

export default TopSection;
