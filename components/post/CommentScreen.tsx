import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import Comment from './Comment';
import { usePostComments } from '@/hooks/usePostComments';

type Props = {
  postId: string;
}

const CommentsScreen: React.FC<Props> = ({ postId }) => {
  const { data, isLoading, error } = usePostComments(postId);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#787A80" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Failed to load comments</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <FlatList
        data={data?.data.comments || []}
        renderItem={({ item }) => (
          <Comment
            comment={item}
            postId={postId}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CommentsScreen;
