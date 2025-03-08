// PostCard.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { IWaveformRef } from '@simform_solutions/react-native-audio-waveform';
import { Skeleton } from 'moti/skeleton';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import UserSection from '../post/UserSection';
import PostMedia from '../post/PostMedia';
import EngagementSection from '../post/EngagementSection';
import { FeedItem } from '../../utils/types';

interface PostCardProps {
  item: FeedItem;
}

const PostCard: React.FC<PostCardProps> = ({ item }) => {
    const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  if(!item){
    setIsLoading(true)
  }
  }, [item]);
  return (
    <View className='h-auto gap-y-[16px] mx-[14px]'>
      <StatusBar style='light' />

      <UserSection user={item?.user} loading={!item} />

      <Skeleton
      transition={{
        type: "timing",
        duration: 20000
      }} show={isLoading}>
        <Pressable className='gap-y-[16px]'>
          <Text className='text-Green/01 font-PlusJakartaSansRegular'>{item?.content}</Text>
          <PostMedia media={item?.media} engagement={item?.engagement} />
        </Pressable>
      </Skeleton>

   <Skeleton show={isLoading}>
   <EngagementSection index={item?.id} engagement={item?.engagement} actions={item?.actions} />
   </Skeleton>

    </View>
  );
};

export default PostCard;
