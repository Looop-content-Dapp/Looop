// PostCard.tsx
import React, { useEffect, useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import { StatusBar } from 'expo-status-bar';
import UserSection from '../post/UserSection';
import PostMedia from '../post/PostMedia';
import EngagementSection from '../post/EngagementSection';
import { FeedItem } from '../../utils/types';
import { router } from 'expo-router';

interface PostCardProps {
  item: FeedItem;
}

const PostCard: React.FC<PostCardProps> = ({ item }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!item) {
      setIsLoading(true);
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
        }}
        show={isLoading}
      >
        <Pressable onPress={() => router.navigate({
          pathname: `/comment`,
          params: {
            id: item?.id
          }
        })} className='gap-y-[16px]'>
          <Text className='text-Green/01 text-[16px] font-PlusJakartaSansRegular'>
            {item?.content}
          </Text>
          <PostMedia media={item?.media} />
        </Pressable>
      </Skeleton>

      <Skeleton show={isLoading}>
        <EngagementSection
          index={item?.id}
          engagement={item?.engagement}
          actions={item?.actions}
        />
      </Skeleton>
    </View>
  );
};

export default PostCard;
