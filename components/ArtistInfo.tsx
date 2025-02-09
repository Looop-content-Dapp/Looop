import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { formatNumber } from '../utils/ArstsisArr';
import { CheckmarkBadge01Icon } from '@hugeicons/react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useQuery } from '../hooks/useQuery';
import axios from 'axios';
import { useAppSelector } from '@/redux/hooks';

type Props = {
  image: any;
  name: string;
  follow: string;
  desc: string;
  follower: string;
  isVerfied: string;
  index: string; // Assuming index is a string representing artist ID
  isFollowing: boolean
};

const ArtistInfo = ({ follow, name, desc, follower, isVerfied, index, isFollowing }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [followed, setFollowed] = useState(false);
  const {
    followArtist,
    isFollowingArtist,
  } = useQuery();
  const { userdata } = useAppSelector((state) => state.auth);
  console.log("isFollowing", isFollowing)

  const handleFollowArtist = async () => {
    try {
      const res = await followArtist(userdata?._id as string, index);
      console.log(`Successfully followed artist with ID: ${index}`, res);
      setFollowed(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Axios error while following artist with ID ${index}:`, error.response?.data);
      } else {
        console.error(`Unexpected error following artist with ID ${index}:`, error);
      }
    }
  };

  const toggleDescription = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <View className="max-h-[256px] m-4 gap-4">
      <View className="flex-row items-center justify-between">
        <View className="gap-1 flex-1">
          <View className="flex-row items-center flex-wrap gap-2">
            <Text className="text-xl font-bold text-white">{name}</Text>
            {isVerfied && (
              <Pressable className="flex-row items-center">
                <CheckmarkBadge01Icon size={20} variant="solid" color="#2DD881" />
              </Pressable>
            )}
            <Text className="text-[#787A80] text-sm">#4 in Nigeria</Text>
          </View>
          <View className="flex-row gap-3 mt-1">
            <Text className="text-sm font-medium text-[#787A80]">{formatNumber(follow)} Followers</Text>
            <Text className="text-sm font-medium text-[#787A80]">{formatNumber(follower)} Monthly Listeners</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleFollowArtist}
          className={`border px-6 py-2.5 rounded-full items-center ${
            isFollowing 
              ? 'border-2 border-[#12141B] bg-Gr' 
              : 'border-[#787A80] bg-transparent'
          }`}
        >
          <Text className="text-white text-xs font-normal">
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ArtistInfo;
