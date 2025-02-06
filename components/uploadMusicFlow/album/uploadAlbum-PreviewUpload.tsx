import { useAlbumUpload } from "@/context/AlbumUploadContext";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
} from "react-native";

const AlbumPreview = () => {
  const { albumData } = useAlbumUpload();
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingTop: 48,
          alignItems: 'center'
        }}
        showsVerticalScrollIndicator={false}>
        {/* Album Cover */}
        {albumData.coverImage && (
          <Image
            source={{ uri: albumData.coverImage.uri }}
            className="w-60 h-60 rounded-3xl mt-8"
            resizeMode="cover"
          />
        )}

        {/* Album Details */}
        <Text className="text-xl text-[#f4f4f4] font-['PlusJakartaSans-Medium'] mt-4 text-center">
          {albumData.albumName}
        </Text>
        <Text className="text-sm text-[#787A80] font-['PlusJakartaSans-Medium'] mt-1 text-center mb-12">
          Album • {albumData.numberOfSongs} songs
        </Text>
        <Text className="text-[#787A80] font-['PlusJakartaSans-Medium']">
          {albumData.primaryGenre}
          {albumData.secondaryGenre && ` • ${albumData.secondaryGenre}`}
        </Text>

        {/* Track List */}
        {albumData.tracks.map((track, index) => (
          <View className="flex-row items-center justify-between py-3" key={index}>
            <View>
              <Text className="w-4 text-base text-[#F4F4F4] font-['PlusJakartaSans-Medium']">
                {index + 1}.
              </Text>
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-[#F4F4F4] text-base font-semibold font-['PlusJakartaSans-Medium']">
                {track.trackName}
              </Text>
              {track.featuredArtists.length > 0 && (
                <Text className="text-[#787A80] text-sm font-['PlusJakartaSans-Medium'] mt-1">
                  feat. {track.featuredArtists.join(', ')}
                </Text>
              )}
              {track.audioFile && (
                <Text className="text-[#787A80] text-sm font-['PlusJakartaSans-Medium']">
                  {(track.audioFile.size / (1024 * 1024)).toFixed(2)} MB
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AlbumPreview;
