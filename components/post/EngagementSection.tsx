import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FavouriteIcon, Comment02Icon, Share05Icon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import Reanimated, { withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Engagement, Actions } from '../../utils/types';

interface EngagementSectionProps {
  engagement: Engagement;
  actions: Actions;
  index: string;
}

const EngagementSection: React.FC<EngagementSectionProps> = ({ engagement, actions, index }) => {
  const [liked, setLiked] = useState(actions?.like);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLike = () => {
    scale.value = withSpring(1.5, {}, () => {
      scale.value = withSpring(1);
    });
    setLiked(!liked);
  };

  const handleCommentPress = () => {
    router.push({
      pathname: '/comments',
      params: { postId: index }
    });
  };

  return (
    <View className="m-2 flex-row items-center justify-between">
        <View className='flex-row items-center gap-x-8'>
        <Reanimated.View style={animatedStyle}>
            <TouchableOpacity onPress={handleLike} className='border border-[#202227] py-[8px] pl-[10px] pr-[16px] flex-row items-center gap-x-[4px] rounded-[24px]'>
            <FavouriteIcon variant={liked ? "solid" : "stroke"} size={20} color={liked ? "red" : "#787A80"} />
            <Text className="text-[#787A80]">{engagement?.likes}</Text>
            </TouchableOpacity>
          </Reanimated.View>
          <TouchableOpacity
            onPress={handleCommentPress}
            className='border border-[#202227] py-[8px] pl-[10px] pr-[16px] flex-row items-center gap-x-[4px] rounded-[24px]'
          >
            <Comment02Icon variant="stroke" size={20} color="#787A80" />
            <Text className="text-[#787A80]">{engagement?.comments}</Text>
          </TouchableOpacity>
        </View>
        <Share05Icon variant="stroke" size={20} color="#787A80" />
    </View>
  );
};

export default EngagementSection;
