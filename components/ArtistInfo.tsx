import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { formatNumber } from '../utils/ArstsisArr';
import { CheckmarkBadge01Icon } from '@hugeicons/react-native';
import { useQuery } from '../hooks/useQuery';
import axios from 'axios';
import { useAppSelector } from '@/redux/hooks';

interface ArtistInfoProps {
  image?: string;
  name: string;
  follow: string;
  desc: string;
  follower: string;
  isVerfied: string;
  index: string;
  isFollowing: boolean;
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({
  follow,
  name,
  follower,
  isVerfied,
  index,
  isFollowing,
}) => {
  const [followed, setFollowed] = useState(isFollowing);
  const { followArtist } = useQuery();
  const { userdata } = useAppSelector((state) => state.auth);

  const handleFollowArtist = async () => {
    if (!userdata?._id) {
      console.error('User ID is required to follow an artist');
      return;
    }

    try {
      const res = await followArtist(userdata._id, index);
      setFollowed(true);
      console.log(`Successfully followed artist: ${name}`, res);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to follow artist:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const renderVerificationBadge = () => (
    isVerfied && (
      <Pressable className="flex-row items-center">
        <CheckmarkBadge01Icon size={20} variant="solid" color="#2DD881" />
      </Pressable>
    )
  );

  const renderFollowerInfo = () => (
    <View className="flex-row gap-3 mt-1">
      <Text className="text-sm font-medium text-[#787A80]">
        {formatNumber(follow)} Following
      </Text>
      <Text className="text-sm font-medium text-[#787A80]">
        {formatNumber(follower)} Followers
      </Text>
    </View>
  );

  return (
    <View className="max-h-[256px] m-4 gap-4">
      <View className="flex-row items-center justify-between">
        <View className="gap-1 flex-1">
          <View className="flex-row items-center flex-wrap gap-2">
            <Text className="text-xl font-bold text-white">{name}</Text>
            {renderVerificationBadge()}
            <Text className="text-[#787A80] text-sm">#4 in Nigeria</Text>
          </View>
          {renderFollowerInfo()}
        </View>

        <TouchableOpacity
          onPress={handleFollowArtist}
          className={`border px-6 py-2.5 rounded-full items-center ${
            followed
              ? 'border-2 border-[#12141B] bg-Gr'
              : 'border-[#787A80] bg-transparent'
          }`}
        >
          <Text className="text-white text-xs font-normal">
            {followed ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ArtistInfo;
