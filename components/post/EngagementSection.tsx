import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FavouriteIcon, Comment02Icon, Share05Icon, EyeIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import Reanimated, { withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { usePostInteractions } from '@/hooks/usePostInteractions';
import { useAppSelector } from '@/redux/hooks';

interface Engagement {
  likes: number;
  comments: number;
  shares: number;
  plays?: number;
}

interface Actions {
  like: boolean;
}

interface EngagementSectionProps {
  engagement: Engagement;
  actions: Actions;
  index: string;
  onLikeUpdate?: (newCount: number) => void;
}

const EngagementSection: React.FC<EngagementSectionProps> = ({
  engagement,
  actions,
  index,
  onLikeUpdate
}) => {
  const scale = useSharedValue(1);
  const { userdata } = useAppSelector((state) => state.auth);
  const { likePost, isLiking } = usePostInteractions();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLike = async () => {
    if (isLiking) return;

    const newLikeCount = actions.like ? engagement.likes - 1 : engagement.likes + 1;

    // Animate heart
    scale.value = withSpring(1.5, {
      damping: 10,
      stiffness: 100,
    }, () => {
      scale.value = withSpring(1);
    });

    // Update UI immediately
    onLikeUpdate?.(newLikeCount);

    try {
      await likePost({
        userId: userdata?._id || "",
        postId: index
      });
    } catch (error) {
      // Revert on failure
      onLikeUpdate?.(engagement.likes);
      console.error('Like failed:', error);
    }
  };

  const handleCommentPress = () => {
    router.push({
      pathname: '/comments',
      params: {
        postId: index,
        type: 'post'
      }
    });
  };

  return (
    <View className="mt-4">
      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-row items-center gap-x-8">
          <Reanimated.View style={animatedStyle}>
            <TouchableOpacity
              onPress={handleLike}
              disabled={isLiking}
              className={`border border-[#202227] py-[8px] pl-[10px] pr-[16px] flex-row items-center gap-x-[4px] rounded-[24px] ${actions.like ? 'bg-[#FF000015]' : ''}`}
              activeOpacity={0.7}
            >
              <FavouriteIcon
                variant={actions.like ? 'solid' : 'stroke'}
                size={20}
                color={actions.like ? '#FF0000' : '#787A80'}
              />
              <Text className={`${actions.like ? 'text-[#FF0000]' : 'text-[#787A80]'}`}>
                {engagement.likes}
              </Text>
            </TouchableOpacity>
          </Reanimated.View>
          <TouchableOpacity
            onPress={handleCommentPress}
            className="border border-[#202227] py-[8px] pl-[10px] pr-[16px] flex-row items-center gap-x-[4px] rounded-[24px]"
            activeOpacity={0.7}
          >
            <Comment02Icon variant="stroke" size={20} color="#787A80" />
            <Text className="text-[#787A80]">{engagement.comments}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <EyeIcon variant="stroke" size={20} color="#787A80" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EngagementSection;
