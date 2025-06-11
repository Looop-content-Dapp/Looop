import { Media } from "@/hooks/community/useCreateCommunity";
import { BlurView } from "expo-blur";
import React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import ImageGrid from "../ImageGrid";
import VideoScreen from "../VideoScreen";
import AudioMedia from "./AudioMedia";

interface PostMediaProps {
  media: Media[];
}

const PostMedia: React.FC<PostMediaProps> = ({ media }) => {
  if (!media || media.length === 0) return null;

  const imageMedia = media.filter((m) => m.type === "image");
  const audioMedia = media.find((m) => m.type === "audio");
  const videoMedia = media.find((m) => m.type === "video");

  if (imageMedia.length > 0) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        className="overflow-hidden rounded-2xl"
      >
        <Pressable onStartShouldSetResponder={() => true}>
          <ImageGrid thumbnails={imageMedia.map((img) => img.url)} />
        </Pressable>
      </Animated.View>
    );
  } else if (videoMedia) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        className="w-full overflow-hidden rounded-2xl my-2"
      >
        <View className="aspect-video w-full">
          <VideoScreen videoUrl={videoMedia.url} />
        </View>
      </Animated.View>
    );
  } else if (audioMedia) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        className="my-2 rounded-2xl overflow-hidden"
      >
        <BlurView intensity={30} tint="dark" className="rounded-2xl">
          <AudioMedia uri={audioMedia.url} />
        </BlurView>
      </Animated.View>
    );
  }

  return null;
};

export default PostMedia;
