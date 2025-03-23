import React from "react";
import { View } from "react-native";
import { Media } from "../../utils/types";
import ImageGrid from "../ImageGrid";
import VideoScreen from "../VideoScreen";
import AudioMedia from "./AudioMedia";

interface PostMediaProps {
  media: Media | null;
}

const PostMedia: React.FC<PostMediaProps> = ({ media }) => {
  if (!media) return null;

  switch (media.type) {
    case "image":
      return <ImageGrid thumbnails={media.url} />;
    case "video":
      return <VideoScreen videoUrl={media.url[0]} />;
    case "audio":
      return <AudioMedia uri={media.url[0]} />;
    default:
      return null;
  }
};

export default PostMedia;
