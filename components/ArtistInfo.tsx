import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { formatNumber } from '../utils/ArstsisArr';
import { CheckmarkBadge01Icon } from '@hugeicons/react-native';
import { useFollowArtist } from '@/hooks/useFollowArtist';
import { useAppSelector } from '@/redux/hooks';
import { showToast } from '@/components/ShowMessage';

// Update the interface
interface ArtistInfoProps {
  image?: string;
  name: string;  // We'll keep this in props but won't use it
  follow: string;
  desc: string;
  follower: string;
  isVerfied: string;
  index: string;
  isFollow: boolean;  // Change to boolean
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({
  follow,
  name,
  follower,
  isVerfied,
  index,
  isFollow,
  desc
}) => {
  const [followed, setFollowed] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);  // Add this state

  useEffect(() => {
    setFollowed(isFollow); // Update when prop changes
  }, [isFollow]);
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
      const result = await handleFollowArtist(userdata?._id, index);

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
        <CheckmarkBadge01Icon size={24} variant="solid" color="#2DD881" />
      </Pressable>
    )
  );

  const renderFollowerInfo = () => (
    <View className="flex-row gap-x-2">
      <Text className="text-[14px] font-PlusJakartaSansMedium text-[#9A9B9F]">
        {formatNumber(follow)} Followers
      </Text>
      <Text className="text-[14px] font-PlusJakartaSansMedium text-[#9A9B9F]">
        {formatNumber(follower)} TribeStar
      </Text>
    </View>
  );

  return (
    <View className="gap-y-[14px]">
      <View className="flex-row items-center justify-around ml-[14px]">
        <View className=" flex-1">
          {renderFollowerInfo()}
        </View>

        {userdata?.artist !== index && (
          <TouchableOpacity
            onPress={onFollowPress}
            disabled={isLoading}
            className={`border px-6 py-2.5 border-[#63656B] rounded-full items-center ${
              followed
                ? 'border-2 border-[#12141B] bg-Gr'
                : 'border-[#787A80] bg-transparent'
            }`}
          >
            <Text className="text-white text-[14px] font-normal">
              {followed ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/* <View className='bg-[#12141B] p-[16px] gap-y-[8px] rounded-[15px] mx-auto mb-6'>
        <Text numberOfLines={1} className='text-[14px] font-PlusJakartaSansBold text-[#9A9B9F]'>About {name}</Text>
        <Text
          numberOfLines={showFullDesc ? undefined : 1}
          className='text-[14px] font-PlusJakartaSansRegular text-[#9A9B9F]'
        >
          {desc}
        </Text>
        <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
          <Text className='text-[14px] text-[#D2D3D5] font-PlusJakartaSansBold'>
            {showFullDesc ? 'See less' : 'See more'}
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default ArtistInfo;
