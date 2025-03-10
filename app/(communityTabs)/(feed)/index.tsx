// Feed.tsx

import { View, FlatList } from 'react-native';
import React from 'react';
import { feed } from '../../../utils';
import PostCard from '../../../components/cards/PostCard';
// Separator component for FlatList
const Separator = () => (
  <View className='border border-[#202227] flex-1 mb-[4px]'/>
);

// Post rendering component
const renderPost = ({ item }) => (
  <PostCard item={item} />
);

// Key extractor function
const keyExtractor = (_, index) => index.toString();

const Feed = () => {
  return (
    <View className="flex-1 min-h-full mt-8">
      <FlatList
        data={feed}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{
          rowGap: 20,
          marginHorizontal: 4,
          alignContent: "center",
          justifyContent: "center",
          paddingBottom: 32
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Feed;
