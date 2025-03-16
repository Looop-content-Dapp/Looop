import { View, ScrollView, Text } from "react-native";
import React from "react";
import MusicCard from "../cards/MusicCard";
import { MotiView } from "moti";

interface MusicCategoryProps {
  title: string;
  musicData: any[];
  isLoading: boolean;
}

const SkeletonLoader = () => (
  <MotiView
    from={{
      opacity: 0.6,
    }}
    animate={{
      opacity: 0.3,
    }}
    transition={{
      type: 'timing',
      duration: 1000,
      loop: true,
    }}
    className="w-[160px] h-[160px] rounded-lg bg-gray-700"
  />
);

const MusicCategory = ({ title, musicData, isLoading }: MusicCategoryProps) => {
  const placeholderData = Array(5).fill({});

  return (
    <View className="mb-8">
      <Text className="text-[#F4F4F4] text-[22px] font-bold font-PlusJakartaSansBold px-4 mb-4">
        {title}
      </Text>

      {isLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
        >
          {placeholderData.map((_, index) => (
            <View key={index} className="w-[160px]">
              <SkeletonLoader />
              <MotiView
                from={{ opacity: 0.6 }}
                animate={{ opacity: 0.3 }}
                transition={{
                  type: 'timing',
                  duration: 1000,
                  loop: true,
                }}
                className="h-5 bg-gray-700 rounded mt-2 w-3/4"
              />
              <MotiView
                from={{ opacity: 0.6 }}
                animate={{ opacity: 0.3 }}
                transition={{
                  type: 'timing',
                  duration: 1000,
                  loop: true,
                }}
                className="h-4 bg-gray-700 rounded mt-2 w-1/2"
              />
            </View>
          ))}
        </ScrollView>
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
