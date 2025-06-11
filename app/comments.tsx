import PostCard from "@/components/cards/PostCard";
import { useGetPost } from "@/hooks/community/useCreateCommunity";
import { useGetComment } from "@/hooks/community/useGetComment";
import { usePostInteractions } from "@/hooks/community/usePostInteractions";
import useFileUpload, { FileType } from "@/hooks/core/useFileUpload";   
import { formatDistanceToNow } from "date-fns";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-elements";

import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";

// Update the Comment interface to match the API response
interface Comment {
  _id: string; // Changed from id to _id to match API
  content: string;
  userId: {
    _id: string;
    username: string;
    profileImage: string;
    // ... other user fields
  };
  createdAt: string;
  replies?: Comment[];
  parentId?: string;
  media?: string;
}

const CommentItem = ({
  comment,
  onReply,
  onPress,
}: {
  comment: Comment;
  onReply: (comment: Comment) => void;
  onPress: (comment: Comment) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(comment)}
      className="p-4 border-b border-[#202227]"
    >
      <View className="flex-row">
        <View>
          <Avatar
            source={{
              uri:
                comment.userId?.profileImage ||
                "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
            }}
            size={40}
            rounded
            containerStyle={{ borderWidth: 1, borderColor: "#202227" }}
          />
        </View>
        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="text-[16px] text-[#f4f4f4] font-PlusJakartaSansMedium">
              {comment.userId?.username}
            </Text>
            <Text className="text-gray-400 ml-2">
              ·{" "}
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </Text>
          </View>

          <Text className="text-[#f4f4f4] mt-1 text-[16px] font-PlusJakartaSansRegular">
            {comment.content}
          </Text>

          {comment.media && (
            <Image
              source={{ uri: comment.media }}
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
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { userdata } = useAppSelector((auth) => auth.auth);
  const { commentOnPost, replyToComment, isCommenting, isReplying } =
    usePostInteractions();
  const navigation = useNavigation();
  const {
    files,
    isLoading: isUploading,
    error: uploadError,
    pickFile,
    removeFile,
  } = useFileUpload();

  const { data: postData, isLoading } = useGetPost(postId as string);

  const { data: commentsData, refetch: refetchComments } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await api.get(`/api/post/comments/${postId}`);
      return response.data;
    },
    enabled: !!postId,
    staleTime: 1000, // Reduce stale time for more frequent updates
    refetchInterval: 5000, // Poll every 5 seconds for new comments
    onError: (error: any) => {
      console.error("Error fetching comments:", error);
    },
  });

  // Update the useEffect for comments data
  useEffect(() => {
    if (commentsData?.data?.comments) {
      setComments(commentsData?.data?.comments as Comment[]);
    }
  }, [commentsData]);

  useLayoutEffect(() => {
    const title =
      type === "reply" ? "Reply" : type === "thread" ? "Thread" : "Comments";

    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white font-PlusJakartaSansBold text-[14px]">
            Back
          </Text>
        </TouchableOpacity>
      ),
      title,
      headerStyle: {
        backgroundColor: "#000000",
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
      pathname: "/comments",
      params: {
        postId,
        commentId: comment._id,
        type: "thread",
      },
    });
  };

  const handleReply = (comment: Comment) => {
    router.push({
      pathname: "/comments",
      params: {
        postId,
        parentId: comment._id,
        type: "reply",
      },
    });
  };

  const handleSubmit = async () => {
    if (!comment.trim() && files.length === 0) return;

    try {
      if (type === "reply") {
        const replyPayload = {
          userId: userdata?._id || "",
          postId: postId as string,
          parentCommentId: Array.isArray(parentId) ? parentId[0] : parentId,
          content: comment,
        };
        await replyToComment(replyPayload);
      } else {
        const commentPayload = {
          userId: userdata?._id || "",
          postId: postId as string,
          parentCommentId: "",
          content: comment,
        };
        await commentOnPost(commentPayload);
      }

      // Clear the form and dismiss keyboard
      setComment("");
      if (files.length > 0) {
        removeFile(files[0]);
      }
      Keyboard.dismiss();

      // Immediately route back regardless of comment type
      router.back();
    } catch (error) {
      console.error("Error submitting comment:", error);
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
    type !== "post" ? ((commentId || parentId) as string) : null
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
    <View className="flex-1 bg-black">
      {/* Content Section */}
      <View className="flex-1">
        {/* Show original post or parent comment based on type */}
        {type === "post" ? (
          <View className="border-b border-[#202227]">
            {isLoading ? (
              <View className="p-4 flex items-center justify-center">
                <ActivityIndicator color="#787A80" />
              </View>
            ) : (
              postData?.data && (
                <View className="p-4">
                  <PostCard
                    item={postData.data as any}
                  />
                </View>
              )
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
                  comment={parentComment.data as Comment}
                  onReply={handleReply}
                  onPress={handleCommentPress}
                />
              )
            )}
          </View>
        )}

        {/* Comments/Replies List
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item._id}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: 100 }}
          onScroll={() => Keyboard.dismiss()} // Dismiss keyboard on scroll
        /> */}
      </View>

      {/* Input Section - Now positioned absolutely */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
        className="absolute bottom-0 left-0 right-0 bg-black border-t border-[#202227]"
      >
        <View className="p-4">
          <View className="flex-row items-center">
            <TextInput
              ref={textInputRef}
              className="flex-1 text-white text-[16px] font-PlusJakartaSansMedium"
              placeholder={`${
                type === "reply" ? "Write a reply..." : "Write a comment..."
              }`}
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

          {/* Bottom Toolbar */}
          <View className="flex-row items-center justify-end mt-4">
            <TouchableOpacity
              className="bg-Orange/08 px-4 py-2 rounded-full"
              disabled={
                (!comment.trim() && files.length === 0) ||
                isUploading ||
                isCommenting ||
                isReplying
              }
              onPress={handleSubmit}
            >
              {isUploading || isCommenting || isReplying ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold">
                  {type === "reply" ? "Reply" : "Comment"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
