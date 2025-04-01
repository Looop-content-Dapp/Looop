import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { Image02Icon, Gif02Icon, HappyIcon } from '@hugeicons/react-native';
import * as ImagePicker from 'expo-image-picker';
import PostCard from '@/components/cards/PostCard';
import { useGetPost } from '@/hooks/useCreateCommunity';

export default function CommentScreen() {
  const { postId } = useLocalSearchParams();
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

  const { data: postData, isLoading } = useGetPost(postId as string);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <View className="">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white font-PlusJakartaSansBold text-[14px]">Cancel</Text>
          </TouchableOpacity>
        </View>
      ),
      title: "",
      headerStyle: {
        backgroundColor: '#000000',
      },
    });
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result?.assets[0]?.uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-black"
    >
      <View className="flex-1">
        {/* Original Post Preview */}
        <View className="border-b border-[#202227]">
          {isLoading ? (
            <View className="p-4 flex items-center justify-center">
              <ActivityIndicator color="#787A80" />
            </View>
          ) : (
            postData?.data && <PostCard item={postData.data} />
          )}
        </View>

        {/* Comment Input Section */}
        <View className="flex-1 p-4">
          <TextInput
            className="text-white text-[16px] font-PlusJakartaSansMedium leading-[24px]"
            placeholder="Write your comment..."
            placeholderTextColor="#787A80"
            multiline
            value={comment}
            onChangeText={setComment}
            autoFocus
          />

          {selectedImage && (
            <View className="mt-4">
              <Image
                source={{ uri: selectedImage }}
                className="w-24 h-24 rounded-lg"
              />
            </View>
          )}
        </View>

        {/* Bottom Toolbar */}
        <View className="p-4 border-t border-[#202227] flex-row items-center justify-between">
          <View className="flex-row gap-x-4">
            <TouchableOpacity onPress={pickImage}>
              <Image02Icon size={24} color="#787A80" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Gif02Icon size={24} color="#787A80" />
            </TouchableOpacity>
            <TouchableOpacity>
              <HappyIcon size={24} color="#787A80" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-Orange/08 px-4 py-2 rounded-full"
            disabled={!comment.trim()}
          >
            <Text className="text-white font-semibold">Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
