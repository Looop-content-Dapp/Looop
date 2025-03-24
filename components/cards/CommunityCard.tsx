import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import type { Community } from '@/hooks/useFollowedCommunities';
import { router } from 'expo-router';

type CommunityCardProps = {
  data: Community[];
  isLoading: boolean;
  title: string;
  userdata?: any;
};

const CommunityCard = ({ data, isLoading, title, userdata }: CommunityCardProps) => {
  const handleRoute = (community: Community) => {
    const isMember = community?.members?.some((member) => member._id === userdata?._id) || false;

    if (!isMember) {
      router.push({
        pathname: "/payment",
        params: {
          name: community.communityName,
          image: community.tribePass?.collectibleImage,
          communityId: community._id,
          collectionAddress: community.tribePass?.contractAddress,
          type: "xion",
          userAddress: userdata?.wallets?.xion?.address,
          currentRoute: "/(communityTabs)/(explore)/search",
        },
      });
    } else {
      router.navigate({
        pathname: '/communityDetails',
        params: {
          id: community._id,
          name: community.communityName,
          image: community.coverImage,
          description: community.description,
          noOfMembers: community.memberCount,
        }
      });
    }
  };

  return (
    <View className="space-y-4 mb-[16px]">
      <Text className="text-[#F4F4F4] text-[20px] leading-[22px] tracking-[-0.69px] font-PlusJakartaSansBold mb-4">{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-6"
      >
        {data.map((community) => (
          <TouchableOpacity
            key={community._id}
            className="items-center"
            onPress={() => handleRoute(community)}
          >
            <Image
              source={{ uri: community.coverImage }}
              className="w-[140px] h-[140px] rounded-full"
              resizeMode="cover"
            />
            <View className="mt-2 items-center">
              <Text className="text-[#fff] text-center font-bold font-PlusJakartaSansBold text-[14px]">
                {community.communityName}
              </Text>
              <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansMedium">
                {community.memberCount} members
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CommunityCard;
