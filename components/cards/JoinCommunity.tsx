import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { ArrowRight01Icon } from '@hugeicons/react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import MemberCommunityCard from './MemberCommunityCard';

interface CommunityData {
  _id: string;
  communityName: string;
  description: string;
  createdBy: string;
  createdAt: string;
  price?: number;
  coverImage?: string;
  members: Array<{
    _id: string;
    userId: {
      _id: string;
      email: string;
      profileImage: string | null;
    };
    communityId: string;
    joinDate: string;
  }>;
}

interface JoinCommunityProps {
  isLoading: boolean;
  communityData: CommunityData | null;
  onJoinPress: () => void;
  userId: string | undefined;
}

const SkeletonLoader = () => {
  const { width, height } = useWindowDimensions();

  return (
    <MotiView
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, duration: 1000 }}
      className="bg-[#2a2a2a] rounded-3xl p-4 my-6 justify-center"
      style={{ height: height * 0.2 }}
    >
      <View className="h-3 bg-[#3a3a3a] mb-2 rounded-md" style={{ width: width * 0.6 }} />
      <View className="h-2.5 bg-[#3a3a3a] mb-4 rounded-md" style={{ width: width * 0.8 }} />
      <View className="h-7 bg-[#3a3a3a] rounded-2xl" style={{ width: width * 0.4 }} />
    </MotiView>
  );
};

const JoinCommunity = ({ isLoading, communityData, onJoinPress, userId }: JoinCommunityProps) => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const router = useRouter();

  const isMember = communityData?.members?.some(member => member.userId._id === userId) || false;

  const handleCommunityPress = () => {
    if (isMember && communityData) {
      router.push({
        pathname: '/communityDetails',
        params: {
          id: communityData._id,
          name: communityData.communityName,
          description: communityData.description,
          image: communityData.coverImage,
          noOfMembers: communityData.members.length
        }
      });
    } else {
      onJoinPress();
    }
  };

  return (
    <View className="px-4 gap-4">
      {isLoading ? (
        <SkeletonLoader />
      ) : communityData ? (
        isMember ? (
          <MemberCommunityCard
            communityName={communityData.communityName}
            description={communityData.description}
            coverImage={communityData.coverImage}
            onPress={handleCommunityPress}
          />
        ) : (
          <TouchableOpacity
            className="h-[171px] bg-[#1A1A1A] rounded-3xl overflow-hidden flex-row"
            onPress={handleCommunityPress}
            activeOpacity={0.7}
          >
            <View className="w-1/2 h-full">
              <Image
                source={{
                  uri: communityData.coverImage || "https://i.pinimg.com/736x/08/36/11/083611341ce01bf33a233cfa6d04331c.jpg"
                }}
                className="w-full h-full"
                style={{ resizeMode: 'cover' }}
              />
            </View>
            <View className="flex-1 p-4 justify-between bg-[#1A1A1A]">
              <View className="flex-1 justify-center gap-2">
                <Text className="text-[16px] font-bold text-white font-PlusJakartaSansBold leading-[16px] -tracking-[0.24px]" numberOfLines={1}>
                  {communityData.communityName}
                </Text>
                <Text className="text-[12px] text-[#D2D3D5] font-plusJakartaSansRegular leading-[16px] -tracking-[0.24px]" numberOfLines={2}>
                  {communityData.description}
                </Text>
                <Text className="text-[12px] text-white font-plusJakartaSansSemiBold bg-black self-start py-[4px] px-[8px] rounded-xl mt-2">
                  22.7M Members
                </Text>
              </View>
              <View className="flex-row items-center justify-center border border-[#FF6D1B] py-[10px] px-[16px] rounded-3xl mt-4">
                <Text className="text-base font-semibold text-[#FF7A1B] font-plusJakartaSansSemiBold mr-2">
                  Join Community
                </Text>
                <ArrowRight01Icon
                  size={16}
                  color="#FF7A1B"
                  variant="stroke"
                  className="ml-1"
                />
              </View>
            </View>
          </TouchableOpacity>
        )
      ) : (
        <>

        </>
      )}
    </View>
  );
};

export default JoinCommunity;
