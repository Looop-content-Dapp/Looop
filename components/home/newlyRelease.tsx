// MusicCategory.js
import { View, ScrollView, Text } from "react-native";
import React from "react";
import MusicCard from "../cards/MusicCard";

interface MusicCategoryProps {
  title: string;
  musicData: any[];
  isLoading: boolean;
}

const MusicCategory = ({ title, musicData, isLoading }: MusicCategoryProps) => {
    console.log("MusicCategory", musicData)
  const placeholderData = Array(5).fill({});
  return (
    <View className="h-[254px] gap-y-[16px]">
      <Text className="text-[#F4F4F4] text-[16px] font-normal font-PlusJakartaSansBold">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingRight: 16 }}
      >
        {(isLoading ? placeholderData : musicData).map(
          (item: any, index: number) => (
            <MusicCard
              key={index}
              loading={isLoading}
              item={{
                id: item._id,
                title: item?.title,
                artist: item?.artist?.name,
                image: item?.cover_image,
                type: item?.type,
                duration: item?.metadata?.duration,
                totalTracks: item?.metadata?.totalTracks,
              }}
            />
          )
        )}
      </ScrollView>
    </View>
  );
};

export default MusicCategory;
