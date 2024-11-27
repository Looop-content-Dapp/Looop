import { View, ScrollView, Text, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { Skeleton } from "moti/skeleton";
import { useRouter } from "expo-router";

const ExploreDiscographies = ({ title, data, isLoading }) => {
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
        {(isLoading ? placeholderData : data).map((item, index) => (
          <ProfileCard key={index} loading={isLoading} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default ExploreDiscographies;

const ProfileCard = ({ item, loading }) => {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const router = useRouter();
    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: `/artist/${item?._id}`,
            params: {
              index: item?._id,
              image: item?.images[0]?.url,
              name: item?.name,
              bio: `${item?.biography}`,
              isVerfied: item?.verified,
            },
          })
        }
        className="items-start gap-y-[4px]"
      >
        <Skeleton radius="round" height={140} width={140} show={loading || isImageLoading}>
          {item?.images && (
            <Image
              source={{ uri: item?.images[2].url }}
              className="w-[140px] h-[140px] m-[8px] rounded-full"
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
            />
          )}
        </Skeleton>

        <Skeleton show={loading}>
          <Text className="text-[#fff] items-center font-bold font-PlusJakartaSansBold text-[14px]">
            {item?.name}
          </Text>
        </Skeleton>
      </Pressable>
    );
  };
