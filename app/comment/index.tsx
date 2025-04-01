import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { ArrowDown01Icon, ArrowLeft02Icon } from '@hugeicons/react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { router, useLocalSearchParams } from 'expo-router';
import PostCard from '@/components/cards/PostCard';
import CommentBox from '@/components/post/CommentBox';
import { useGetPost } from '@/hooks/useCreateCommunity';
import CommentsScreen from '@/components/post/CommentScreen';

const CommentScreen = () => {
  const { id } = useLocalSearchParams();
  const { data: postData, isLoading } = useGetPost(id as string);

  const renderPostAndComments = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-4">
          <ActivityIndicator color="#787A80" />
        </View>
      );
    }

    return (
      <>
        <PostCard item={postData?.data} />
        <View
          style={{ width: wp('100%') }}
          className="bg-[#12141B] py-[11px] px-3 my-4 flex-row items-center gap-3 h-[40px]"
        >
          <Text className="text-[12px] text-[#fff]">Sort comments by</Text>
          <ArrowDown01Icon variant="solid" size={20} color="#787A80" />
        </View>
        <CommentsScreen />
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center gap-x-2 py-[17px] px-4 h-[74px]">
            <Pressable
              onPress={() => router.back()}
              className="h-12 w-12 items-center justify-center"
            >
              <ArrowLeft02Icon size={24} color="#fff" variant="solid" />
            </Pressable>
            <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">
              Comments
            </Text>
          </View>

          {/* Post and Comments List */}
          <FlatList
            data={[1]} // Single item for post and comments
            renderItem={renderPostAndComments}
            keyExtractor={() => 'post'}
            contentContainerStyle={{
              paddingHorizontal: 16, // Consistent horizontal padding
              paddingBottom: 100,   // Space for CommentBox
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CommentScreen;
