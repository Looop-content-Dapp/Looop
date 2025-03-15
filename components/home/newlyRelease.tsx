import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import React from "react";
import MusicCard from "../cards/MusicCard";

interface MusicCategoryProps {
  title: string;
  musicData: any[];
  isLoading: boolean;
}

const MusicCategory = ({ title, musicData, isLoading }: MusicCategoryProps) => {
  const placeholderData = Array(5).fill({});

  return (
    <View className="mb-8">
      <Text className="text-[#F4F4F4] text-[22px] font-bold font-PlusJakartaSansBold px-4 mb-4">
        {title}
      </Text>

      {isLoading ? (
        <View className="h-[180px] justify-center items-center">
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      ) : musicData.length === 0 ? (
        <View className="h-[100px] justify-center items-center">
          <Text className="text-[#999] text-[14px]">No items to display</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
        >
          {musicData.map((item: any, index: number) => (
            <MusicCard
              key={index}
              loading={false}
              item={{
                id: item._id,
                title: item?.title,
                artist: item?.artist?.name || item?.artist,
                image: item?.cover_image || item?.artwork?.high || item?.cover,
                type: item?.type,
                duration: item?.metadata?.duration,
                totalTracks: item?.metadata?.totalTracks,
                releaseDate: item?.releaseDate,
              }}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default MusicCategory;
