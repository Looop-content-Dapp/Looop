import { View, ScrollView, Text, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { Skeleton } from "moti/skeleton";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/redux/hooks";
import { prefetchArtistData } from '@/utils/prefetch';

const ExploreDiscographies = ({
  title,
  data,
  isLoading,
}: {
  title: string;
  data: any[];
  isLoading: boolean;
}) => {
  const placeholderData = Array(5).fill({}); // Create 5 placeholder items
  return (
    <View className="h-[254px] gap-y-4">
      <Text className="text-[#F4F4F4] text-[16px] font-normal font-PlusJakartaSansBold">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-x-4"
      >
        {(isLoading ? placeholderData : data).map(
          (item: any, index: React.Key) => (
            <ProfileCard key={index} loading={isLoading} item={item} />
          )
        )}
      </ScrollView>
    </View>
  );
};

export default ExploreDiscographies;

const ProfileCard = ({ item, loading }: { item: any; loading: boolean }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const router = useRouter();

  const handlePress = async () => {
    try {
      // Prefetch data before navigation
      await prefetchArtistData(item?._id);
      
      router.push({
        pathname: `/artist/${item?._id}`,
        params: {
          artistId: item?._id,
        },
      });
    } catch (error) {
      console.error('Error prefetching artist data:', error);
      // Navigate anyway if prefetch fails
      router.push({
        pathname: `/artist/${item?._id}`,
      });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => prefetchArtistData(item?._id)} // Prefetch on hover
      className="items-center gap-y-[4px]"
    >
      <Skeleton
        radius="round"
        height={140}
        width={140}
        show={loading || isImageLoading}
      >
        {item?.profileImage && (
          <Image
            source={{ uri: item?.profileImage }}
            className="w-[140px] h-[140px] m-[8px] rounded-full"
            onLoadStart={() => setIsImageLoading(true)}
            onLoadEnd={() => setIsImageLoading(false)}
          />
        )}
      </Skeleton>
      <Skeleton show={loading}>
        <Text className="text-[#fff] text-center items-center font-bold font-PlusJakartaSansBold text-[14px]">
          {item?.name}
        </Text>
      </Skeleton>
    </Pressable>
  );
};
