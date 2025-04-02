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
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { Image02Icon, Gif02Icon, HappyIcon } from '@hugeicons/react-native';
import PostCard from '@/components/cards/PostCard';
import { useGetPost } from '@/hooks/useCreateCommunity';
import useFileUpload, { FileType } from '@/hooks/useFileUpload';
import { useGetComment } from '@/hooks/useGetComment';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from 'react-native-elements';
import { usePostInteractions } from '@/hooks/usePostInteractions';
import { useAuth } from '@/context/AuthContext';
import { useAppSelector } from '@/redux/hooks';

interface Comment {
  id: string;
  content: string;
  userId: any;
  createdAt: string;
  replies?: Comment[];
  parentId?: string;
  media?: string;
}

const CommentItem = ({
  comment,
  onReply,
  onPress
}: {
  comment: Comment,
  onReply: (comment: Comment) => void,
  onPress: (comment: Comment) => void
}) => {
    console.log('CommentItem rendered with comment:', comment);
  return (
    <TouchableOpacity
      onPress={() => onPress(comment)}
      className="p-4 border-b border-[#202227]"
    >
      <View className="flex-row">
        <View>
          <Avatar
            source={{
              uri: comment?.userId?.profileImage ||
                "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg"
            }}
           size={40}
           rounded
           containerStyle={{ borderWidth: 1, borderColor: '#202227' }}
          />
        </View>
        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="text-[16px] text-[#f4f4f4] font-PlusJakartaSansMedium">
              {comment?.userId?.username}
            </Text>
            {comment?.user?.isVerified && (
              <View className="w-4 h-4 ml-1 bg-blue-500 rounded-full items-center justify-center">
                <Text className="text-white text-[10px]">✓</Text>
              </View>
            )}
            <Text className="text-gray-400 ml-2">· {formatDistanceToNow(new Date(comment?.createdAt), { addSuffix: true })}</Text>
          </View>

          <Text className="text-[#f4f4f4] mt-1 text-[16px] font-PlusJakartaSansRegular">
            {comment?.content}
          </Text>

          {comment.media && (
            <Image
              source={{ uri: comment?.media }}
              className="w-full h-48 mt-2 rounded-lg"
            />
          )}

          <View className="flex-row mt-2 space-x-4">
            <TouchableOpacity
              onPress={() => onReply(comment)}
              className="flex-row items-center"
            >
              <Text className="text-[#787A80]">Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function CommentScreen() {
  const { postId, type, parentId, commentId } = useLocalSearchParams();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const { userdata } = useAppSelector((auth) => auth.auth);
  const { commentOnPost, replyToComment, isCommenting, isReplying } = usePostInteractions();
  const navigation = useNavigation();
  const {
    files,
    isLoading: isUploading,
    error: uploadError,
    pickFile,
    removeFile
  } = useFileUpload();

  const { data: postData, isLoading } = useGetPost(postId as string);

  useLayoutEffect(() => {
    const title = type === 'reply' ? 'Reply' : type === 'thread' ? 'Thread' : 'Comments';

    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white font-PlusJakartaSansBold text-[14px]">Back</Text>
        </TouchableOpacity>
      ),
      title,
      headerStyle: {
        backgroundColor: '#000000',
      },
    });
  }, [type]);

  const renderComment = ({ item }: { item: Comment }) => (
    <CommentItem
      comment={item}
      onReply={handleReply}
      onPress={handleCommentPress}
    />
  );

  const handleCommentPress = (comment: Comment) => {
    router.push({
      pathname: '/comments',
      params: {
        postId,
        commentId: comment.id,
        type: 'thread'
      }
    });
  };

  const handleReply = (comment: Comment) => {
    router.push({
      pathname: '/comments',
      params: {
        postId,
        parentId: comment.id,
        type: 'reply'
      }
    });
  };

  const handleSubmit = async () => {
    if (!comment.trim() && files.length === 0) return;

    try {
      const mediaUrls = files.map(file => file.uri);
      const parentCommentId = Array.isArray(parentId) ? parentId[0] : parentId;

      const payload = {
        userId: userdata?._id || "",
        postId: postId as string,
        content: comment,
        media: mediaUrls.length > 0 ? mediaUrls[0] : undefined,
        parentCommentId: type === 'reply' ? parentCommentId : ""
      };

      if (type === 'reply') {
        await replyToComment(payload);
      } else {
        await commentOnPost(payload);
      }

      setComment('');
      removeFile(files[0]);

      const newComment = {
        id: Date.now().toString(),
        content: comment,
        userId: userdata,
        createdAt: new Date().toISOString(),
        media: mediaUrls[0],
        parentId: type === 'reply' ? parentCommentId : undefined
      };

      setComments(prev => [newComment, ...prev]);

    } catch (error) {
      console.error('Error submitting comment:', error);
    }
};

  const handleImagePick = async () => {
    const result = await pickFile(FileType.IMAGE);
    if (result?.error) {
      // Handle error
      console.error(result.error);
    }
  };

  const handleGifPick = async () => {
    const result = await pickFile(FileType.GIF);
    if (result?.error) {
      // Handle error
      console.error(result.error);
    }
  };

  // Add this hook to fetch the parent comment when in reply/thread mode
  const { data: parentComment, isLoading: isParentLoading } = useGetComment(
    type !== 'post' ? (commentId || parentId) as string : null
  );

  const textInputRef = React.useRef<TextInput>(null);

  // Auto-focus input when screen loads
  useEffect(() => {
    const timer = setTimeout(() => {
      textInputRef.current?.focus();
    }, 100); // Small delay to ensure component is mounted

    return () => clearTimeout(timer);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
      className="flex-1 bg-black"
    >
      <View className="flex-1">
        {/* Show original post or parent comment based on type */}
        {type === 'post' ? (
          <View className="border-b border-[#202227]">
            {isLoading ? (
              <View className="p-4 flex items-center justify-center">
                <ActivityIndicator color="#787A80" />
              </View>
            ) : (
              postData?.data && <PostCard item={postData.data} />
            )}
          </View>
        ) : (
          <View className="border-b border-[#202227]">
            {isParentLoading ? (
              <View className="p-4 flex items-center justify-center">
                <ActivityIndicator color="#787A80" />
              </View>
            ) : (
              parentComment?.data && (
                <CommentItem
                  comment={parentComment.data}
                  postId={postId as string}
                  onPress={handleCommentPress}
                />
              )
            )}
          </View>
        )}

        {/* Comments/Replies List */}
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />

        {/* Comment Input Section */}
        <View className="p-4 border-t border-[#202227]">
          <View className="flex-row items-center">
            <TextInput
              ref={textInputRef}
              className="flex-1 text-white text-[16px] font-PlusJakartaSansMedium"
              placeholder={`${type === 'reply' ? 'Write a reply...' : 'Write a comment...'}`}
              placeholderTextColor="#787A80"
              multiline
              value={comment}
              onChangeText={setComment}
              onSubmitEditing={handleSubmit}
              blurOnSubmit={false}
              returnKeyType="send"
              enablesReturnKeyAutomatically
              autoCorrect
              autoCapitalize="sentences"
            />
          </View>

          {/* Display uploaded files */}
          {files.length > 0 && (
            <View className="mt-4 flex-row flex-wrap gap-2">
              {files.map((file, index) => (
                <View key={index} className="relative">
                  <Image
                    source={{ uri: file.uri }}
                    className="w-24 h-24 rounded-lg"
                  />
                  <TouchableOpacity
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                    onPress={() => removeFile(file)}
                  >
                    <Text className="text-white">×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Bottom Toolbar */}
          <View className="flex-row items-center justify-between mt-4">
            <View className="flex-row gap-x-4">
              <TouchableOpacity onPress={handleImagePick}>
                <Image02Icon size={24} color="#787A80" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGifPick}>
                <Gif02Icon size={24} color="#787A80" />
              </TouchableOpacity>
              <TouchableOpacity>
                <HappyIcon size={24} color="#787A80" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-Orange/08 px-4 py-2 rounded-full"
              disabled={(!comment.trim() && files.length === 0) || isUploading || isCommenting || isReplying}
              onPress={handleSubmit}
            >
              {(isUploading || isCommenting || isReplying) ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold">
                  {type === 'reply' ? 'Reply' : 'Comment'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
