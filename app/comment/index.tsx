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
import Comments from "@/components/post/Comments";
import PostCard from "@/components/cards/PostCard";
import CommentBox from "@/components/post/CommentBox";
import { FeedItem } from "@/utils/types";
import { feed } from "@/utils";

  const index = () => {
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
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View className="flex-1">
            <View className="flex-row items-center gap-x-[8px] py-[17px] h-[74px] px-4">
              <Pressable
                onPress={() => router.back()}
                className="h-[48px] w-[48px] items-center justify-center"
              >
                <ArrowLeft02Icon size={24} color="#fff" variant="solid" />
              </Pressable>
              <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">
                Comments
              </Text>
            </View>

            <FlatList
              data={[postdetails]}
              renderItem={renderItem}
              keyExtractor={(item) => item?.id || "post"}
              contentContainerStyle={{
                paddingBottom: 100,
                paddingHorizontal: 16
              }}
            />

            <CommentBox />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

  export default index;
