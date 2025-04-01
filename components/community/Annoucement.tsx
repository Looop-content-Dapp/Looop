import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { feed } from '../../utils';
import PostCard from '../cards/PostCard';
import { useGetCommunityPosts } from '@/hooks/useCreateCommunity';

type AnnoucementProps = {
    communityId: string;
  };

const Annnoucement = ({ communityId }:  AnnoucementProps) => {
    const { data, isLoading } = useGetCommunityPosts(communityId);

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
            No Annoucements from creator yet
          </Text>
        </View>
      );
    }

  return (
    <View className="flex-1">
      <FlatList
         data={data.data.posts}
        renderItem={({ item }) => <PostCard item={item} />}
        keyExtractor={(item, index) => index.toString()}
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

export default Annnoucement;
