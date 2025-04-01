import React from 'react';
import { View, Text } from 'react-native';
import ImageGrid from '../ImageGrid';
import VideoScreen from '../VideoScreen';
import AudioMedia from './AudioMedia';
import { Media } from '@/hooks/useCreateCommunity';

interface PostMediaProps {
  media: Media[];
}

const PostMedia: React.FC<PostMediaProps> = ({ media }) => {
  if (!media || media.length === 0) return null;

  const imageMedia = media.filter((m) => m.type === 'image');
  const audioMedia = media.find((m) => m.type === 'audio');
  const videoMedia = media.find((m) => m.type === 'video');

  if (imageMedia.length > 0) {
    return (
      <View>
        <ImageGrid thumbnails={imageMedia.map((img) => img.url)} />
      </View>
    );
  } else if (videoMedia) {
    return <VideoScreen videoUrl={videoMedia.url} />;
  } else if (audioMedia) {
    return <AudioMedia uri={audioMedia.url} />;
  }

  return null;
};

export default PostMedia;
