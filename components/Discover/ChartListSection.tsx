import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native";
import { ArrowRight01Icon } from "@hugeicons/react-native";

type ChartItemProps = {
  position: number;
  title: string;
  artist: string;
  imageUrl: string;
  duration: string;
  onPress?: () => void;
};

type ChartListSectionProps = {
  title: string;
  data: ChartItemProps[];
};

const ChartItem = ({ position, title, artist, imageUrl, duration, onPress }: ChartItemProps) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center justify-between py-3 px-4"
  >
    <View className="flex-row items-center flex-1">
      <Text className="text-[#787A80] w-8">{position}</Text>
      <Image
        source={{ uri: imageUrl }}
        className="w-12 h-12 rounded-lg mx-3"
      />
      <View className="flex-1">
        <Text className="text-white font-medium" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-[#787A80]" numberOfLines={1}>
          {artist}
        </Text>
      </View>
    </View>
    <Text className="text-[#787A80]">{duration}</Text>
  </Pressable>
);

const ChartListSection = ({ title, data }: ChartListSectionProps) => {
  return (
    <View className="mt-6" style={{ width: wp("100%") }}>
     <View className="flex-row items-start justify-between">
     <Text className="text-[#F4F4F4] text-[24px] font-PlusJakartaSansMedium px-6 mb-4">
        {title}
      </Text>
      <TouchableOpacity className="flex-row items-center gap-x-[8px]">
        <Text className="text-[16px] font-PlusJakartaSansMedium text-[#9A9B9F]">See all</Text>
        <ArrowRight01Icon size={24} color="#9A9B9F" variant="stroke" />
      </TouchableOpacity>
     </View>
      <View className="border-t border-[#12141B]">
        {data.map((item, index) => (
          <ChartItem key={index} {...item} />
        ))}
      </View>
    </View>
  );
};

export default ChartListSection;
