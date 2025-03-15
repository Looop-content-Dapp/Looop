import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { formatNumber } from '../utils/ArstsisArr';
import { CheckmarkBadge01Icon } from '@hugeicons/react-native';
import { useFollowArtist } from '@/hooks/useFollowArtist';
import { useAppSelector } from '@/redux/hooks';
import { showToast } from '@/config/ShowMessage';

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
  const { userdata } = useAppSelector((state) => state.auth);
  const { handleFollowArtist, isLoading } = useFollowArtist();

  const onFollowPress = async () => {
    if (!userdata?._id) {
      showToast("Please log in to follow artists", "error");
      return;
    }

    try {
      // Toggle the UI state immediately for better UX
      setFollowed(prev => !prev);

      // Call the follow artist function from the hook
      const result = await handleFollowArtist(userdata._id, index);

      // If the API call fails, revert the UI state
      if (result === null) {
        setFollowed(prev => !prev);
        showToast("Failed to follow artist", "error");
      } else {
        // Log success
        console.log(`Successfully ${result ? 'followed' : 'unfollowed'} artist: ${name}`);
      }
    } catch (error) {
      // Revert UI state on error
      setFollowed(prev => !prev);
      console.error('Error following artist:', error);
      showToast("Failed to follow artist", "error");
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
          onPress={onFollowPress}
          disabled={isLoading}
          className={`border px-6 py-2.5 rounded-full items-center ${
            followed
              ? 'border-2 border-[#12141B] bg-Gr'
              : 'border-[#787A80] bg-transparent'
          }`}
        >
          <Text className="text-white text-xs font-normal">
            {isLoading ? 'Loading...' : followed ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ArtistInfo;
