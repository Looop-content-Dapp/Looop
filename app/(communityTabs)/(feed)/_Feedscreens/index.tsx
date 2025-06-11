import { AppBackButton } from "@/components/app-components/back-btn";
import CommentsBottomSheet from "@/components/bottomSheet/CommentsBottomSheet";
import PostCard from "@/components/cards/PostCard";
import CommentsScreen from "@/components/post/CommentScreen";
import { useGetPost } from "@/hooks/community/useCreateCommunity";
import { useAppSelector } from "@/redux/hooks";
import { ArrowDown01Icon } from "@hugeicons/react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const CommentScreen = () => {
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { data: postData, isLoading } = useGetPost(id as string);
  const { userdata } = useAppSelector((auth) => auth.auth);
  const [comment, setComment] = useState("");
  const textInputRef = useRef<TextInput>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Add keyboard listeners
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", () => {
      setIsKeyboardVisible(true);
    });
    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AppBackButton name="Post" onBackPress={() => router.back()} />
      ),
    });
  });

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
        <>
          <PostCard item={postData?.data as any} />
          <CommentsBottomSheet
            isVisible={isCommentsVisible}
            onClose={() => setIsCommentsVisible(false)}
            postId={id as string}
            commentsCount={postData?.data?.commentCount || 0}
          />
        </>
        <View
          style={{ width: wp("100%") }}
          className="bg-[#12141B] py-[11px] px-3 my-4 flex-row items-center gap-3 h-[40px]"
        >
          <Text className="text-[12px] text-[#fff]">Sort comments by</Text>
          <ArrowDown01Icon variant="solid" size={20} color="#787A80" />
        </View>
        {!isCommentsVisible && <CommentsScreen postId={id as string} />}
      </>
    );
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1">
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className="flex-1">
          <View className="pl-[24px] py-[14px]">
            <AppBackButton name="Post" onBackPress={() => router.back()} />
          </View>
          <View className="flex-1">
            <FlatList
              data={[1]}
              renderItem={renderPostAndComments}
              keyExtractor={() => "post"}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 120,
              }}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
        className="absolute bottom-0 left-0 right-0 bg-black border-t border-[#202227]"
      >
        <View className="px-4 py-3">
          <View className="flex-row items-center gap-x-2">
            <Avatar
              source={{
                uri: userdata?.profileImage || "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
              }}
              size={35}
              rounded
              onPress={() => router.push("/(profile)")}
              avatarStyle={{
                borderWidth: 2,
                borderColor: "#f4f4f4",
              }}
            />
            <View className="flex-1 flex-row items-center gap-x-2">
              <TextInput
                ref={textInputRef}
                className="flex-1 text-white text-[16px] font-PlusJakartaSansMedium bg-[#202227] rounded-full px-4 py-2 min-h-[40px]"
                placeholder="Write a comment..."
                placeholderTextColor="#787A80"
                multiline={false}
                value={comment}
                onChangeText={setComment}
                blurOnSubmit={true}
                returnKeyType="send"
                enablesReturnKeyAutomatically
                autoCorrect
                autoCapitalize="sentences"
                onSubmitEditing={dismissKeyboard}
              />
              {isKeyboardVisible && (
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                  <View className="bg-[#202227] px-4 py-2 rounded-full">
                    <Text className="text-white font-PlusJakartaSansMedium">Reply</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default CommentScreen;
