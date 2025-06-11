import { useGetCommunities } from "@/hooks/community/useGetCommunities";
import React from "react";
import { FlatList, Text, View } from "react-native";
import CommunityBigCard from "./cards/CommunityBigCard";
import { BigCardSkeleton } from "./skeletons/CommunityCardSkeleton";

const CommunityNearYou = () => {
  const { data: communities, isLoading } = useGetCommunities();

  if (isLoading) {
    return (
      <View className="gap-y-[16px]">
        <Text className="text-[20px] text-[#fff] font-PlusJakartaSansMedium">
          Based on music you listen to
        </Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={[1, 2, 3]}
          renderItem={() => <BigCardSkeleton />}
          horizontal
          contentContainerStyle={{
            gap: 16,
          }}
        />
      </View>
    );
  }

  // Take only first 5 communities
  const displayedCommunities = communities?.slice(0, 5) || [];

  return (
    <View className="gap-y-[16px]">
      <Text className="text-[20px] text-[#fff] font-PlusJakartaSansMedium">
        Based on music you listen to
      </Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={displayedCommunities}
        renderItem={({ item }) => <CommunityBigCard item={item} />}
        horizontal
        contentContainerStyle={{
          gap: 16,
        }}
      />
    </View>
  );
};

export default CommunityNearYou;
