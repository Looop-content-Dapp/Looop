import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import React from 'react';
import PostCard from '../cards/PostCard';
import { useGetCommunityPosts } from '@/hooks/useCreateCommunity';

type PostsProps = {
  communityId: string;
};

const Posts = ({ communityId }: PostsProps) => {
  const { data, isLoading } = useGetCommunityPosts(communityId);
  console.log(data);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ff6b00" />
      </View>
    );
  }

  if (!data?.data.posts || data.data.posts.length === 0) {
    return (
      <View className="flex-1 justify-cente items-center mt-[50%]">
        <Text className="text-[#787A80] text-[16px] font-PlusJakartaSansMedium">
          No posts from creator yet
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={data.data.posts}
        renderItem={({ item }) => <PostCard item={item} />}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => (
          <View className="h-1 bg-Grey/07 flex-1" />
        )}
        contentContainerStyle={{
          rowGap: 20,
          marginHorizontal: 4,
          alignContent: 'center',
          justifyContent: 'center',
          marginBottom: 120,
        }}
      />
    </View>
  );
};

export default Posts;
