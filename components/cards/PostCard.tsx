import { Post } from "@/hooks/user/useUserFeed"; // Updated import
import { useAppSelector } from "@/redux/hooks";
import { Portal } from "@gorhom/portal";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Skeleton } from "moti/skeleton";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import SharePost from "../bottomSheet/SharePost";
import EngagementSection from "../post/EngagementSection";
import PostMedia from "../post/PostMedia";
import UserSection from "../post/UserSection";

interface PostCardProps {
  item: Post;
}

const PostCard: React.FC<PostCardProps> = ({ item }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(item?.likeCount || 0);
  const [localHasLiked, setLocalHasLiked] = useState(item?.hasLiked || false);
  const { userdata } = useAppSelector((state) => state.auth);
  const [isShareSheetVisible, setIsShareSheetVisible] = useState(false);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  console.log("item", item.communityId); // Add this lin

  useEffect(() => {
    if (!item) setIsLoading(true);
    setLocalLikeCount(item?.likeCount || 0);
    setLocalHasLiked(item?.hasLiked || false);
  }, [item]);

  const handleLikeUpdate = (success: boolean) => {
    if (success) {
      setLocalHasLiked(!localHasLiked);
      setLocalLikeCount((prevCount) =>
        localHasLiked ? prevCount - 1 : prevCount + 1
      );
    } else {
      // Revert on failure
      setLocalLikeCount(item?.likeCount || 0);
      setLocalHasLiked(item?.hasLiked || false);
    }
  };

  const renderContent = (content: string) => {
    if (!content) return null;

    const words = content.split(/(\s+)/);
    return words.map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <Text
            key={index}
            className="text-[#1DA1F2] text-[16px] font-PlusJakartaSansMedium"
          >
            {word}
          </Text>
        );
      }
      return <Text key={index}>{word}</Text>;
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      className="mb-4 overflow-hidden"
    >
      <BlurView intensity={20} tint="dark" className="rounded-2xl">
        <View className="p-4 gap-y-4">
          <StatusBar style="light" />
          <UserSection
            item={item}
            loading={isLoading}
            onMorePress={() => setIsShareSheetVisible(true)}
          />

          <Skeleton
            transition={{ type: "timing", duration: 1000 }}
            show={isLoading}
          >
            <View className="gap-y-4">
              <Pressable
                onPress={() =>
                  router.navigate({
                    pathname: "/(communityTabs)/(feed)/_Feedscreens",
                    params: { id: item?._id },
                  })
                }
                className="active:opacity-80"
              >
                <Text className="text-white text-[16px] leading-[24px] font-PlusJakartaSansMedium">
                  {renderContent(item?.content)}
                </Text>
              </Pressable>
              <PostMedia media={item?.media} />
            </View>
          </Skeleton>

          <Skeleton show={isLoading}>
            <EngagementSection
              index={item?._id}
              engagement={{
                likes: localLikeCount,
                comments: item?.commentCount,
                shares: item?.shareCount,
              }}
              actions={{ like: localHasLiked }}
              onLikeUpdate={handleLikeUpdate}
              onCommentPress={() => setIsCommentsVisible(true)}
            />
          </Skeleton>
          <Portal>
            <SharePost
              isVisible={isShareSheetVisible}
              onClose={() => setIsShareSheetVisible(false)}
              album={{
                title: item?.content || "",
                artist: item?.artistId?.name || "",
                image: item?.artistId?.profileImage || "",
                communityName: item?.communityId?.communityName || "",
              }}
            />
          </Portal>
        </View>
      </BlurView>
    </Animated.View>
  );
};

export default PostCard;
