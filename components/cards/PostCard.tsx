import React, { useEffect, useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import { StatusBar } from 'expo-status-bar';
import UserSection from '../post/UserSection';
import PostMedia from '../post/PostMedia';
import EngagementSection from '../post/EngagementSection';
import { router } from 'expo-router';
import { Post } from '@/hooks/useUserFeed'; // Updated import
import { useAppSelector } from '@/redux/hooks';
import SharePost from '../bottomSheet/SharePost';
import { formatTimeAgo } from '@/utils/dateUtils';

interface PostCardProps {
  item: Post;
}

const PostCard: React.FC<PostCardProps> = ({ item }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { userdata } = useAppSelector((state) => state.auth);
  const [likeCount, setLikeCount] = useState(item?.likeCount || 0);
  const [isShareSheetVisible, setIsShareSheetVisible] = useState(false);

  useEffect(() => {
    if (!item) setIsLoading(true);
    setLikeCount(item?.likeCount || 0);
  }, [item]);

  const handleLikeUpdate = (newCount: number) => {
    setLikeCount(newCount);
  };

  const renderContent = (content: string) => {
    if (!content) return null;

    const words = content.split(/(\s+)/);
    return words.map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <Text
            key={index}
            className="text-[#1DA1F2] text-[16px] font-PlusJakartaSansMedium"
          >
            {word}
          </Text>
        );
      }
      return <Text key={index}>{word}</Text>;
    });
  };

  return (
    <View className="h-auto gap-y-[16px] mx-[14px] border-b border-Grey/07 py-[10px]">
      <StatusBar style="light" />
      <UserSection
        item={item}
        loading={isLoading}
        onMorePress={() => setIsShareSheetVisible(true)}
      />

      <Skeleton
        transition={{ type: 'timing', duration: 1000 }}
        show={isLoading}
      >
        <Pressable
          onPress={() =>
            router.navigate({
              pathname: '/postDetails',
              params: { id: item?.id },
            })
          }
          className="gap-y-[16px]"
        >
          <Text className="text-white text-[16px] font-PlusJakartaSansRegular">
            {renderContent(item?.content)}
          </Text>
          <PostMedia media={item?.media} />
        </Pressable>
      </Skeleton>

      <Skeleton show={isLoading}>
        <EngagementSection
          index={item?._id}  // Change from item?.id to item?._id
          engagement={{
            likes: likeCount,
            comments: item?.commentCount,
            shares: item?.shareCount,
          }}
          actions={{ like: item?.hasLiked || false }}
          onLikeUpdate={handleLikeUpdate}
        />
      </Skeleton>
      <SharePost
  isVisible={isShareSheetVisible}
  onClose={() => setIsShareSheetVisible(false)}
  album={{
    id: item.id,
    title: item.content,
    artist: item.artistId?.name,
    image: item.media?.[0]?.url,
    duration: formatTimeAgo(item.createdAt)
  }}
/>
    </View>
  );
};

export default PostCard;
