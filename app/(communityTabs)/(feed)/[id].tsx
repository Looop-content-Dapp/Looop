import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  ArrowDown01Icon,
  ArrowLeft02Icon,
  UserGroupIcon,
} from "@hugeicons/react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { router, useLocalSearchParams } from "expo-router";
import { feed } from "../../../utils";
import { FeedItem } from "../../../utils/types";
import PostCard from "../../../components/cards/PostCard";
import CommentBox from "../../../components/post/CommentBox";
import Comments from "../../../components/post/CommentScreen";

const Comment = () => {
  const { id } = useLocalSearchParams();
  const [postdetails, setPostDetails] = useState<FeedItem | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = feed.find((item) => item.id === id);
        setPostDetails(data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Content data to render
  const renderItem = () => {
    return (
      <>
        <PostCard item={postdetails} />
        <View
          style={{ width: wp("100%") }}
          className="bg-[#12141B] py-[11px] gap-3 my-4 px-3 flex-row items-center h-[40px]"
        >
          <Text className="text-[12px] text-[#fff]">Sort comments by</Text>
          <ArrowDown01Icon variant="solid" size={20} color="#787A80" />
        </View>
        <Comments />
      </>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, minHeight: "100%" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <View className="flex-row items-center gap-x-[8px] py-[17px] h-[74px]">
          <Pressable
            onPress={() => router.back()}
            className="h-[48px] w-[48px] p-[8px] items-center justify-center"
          >
            <ArrowLeft02Icon size={24} color="#fff" variant="solid" />
          </Pressable>
          <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">
            Post
          </Text>
        </View>
        <View
          style={{ width: wp("100%") }}
          className="bg-[#12141B] h-[56px] py-[16px] pl-[34.5px] flex-row items-center gap-x-[8px]"
        >
          <UserGroupIcon size={24} color="#787A80" variant="solid" />
          <Text className="text-[16px] text-[#787A80] font-PlusJakartaSansBold">
            {postdetails?.user.username}
          </Text>
        </View>
        <FlatList
          data={[postdetails]} // Only one post detail, so pass it as a single item list
          renderItem={renderItem}
          keyExtractor={(item) => item?.id || "post"}
          contentContainerStyle={{
            paddingBottom: 20,
            minHeight: "100%",
            marginTop: 16,
            paddingHorizontal: 2,
            paddingVertical: 6,
          }}
        />
      </KeyboardAvoidingView>
      <CommentBox />
    </SafeAreaView>
  );
};

export default Comment;
