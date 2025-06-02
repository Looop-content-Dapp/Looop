import React from 'react';
import { View, Text, Image } from 'react-native';
import { format } from 'date-fns';

const PreviewSection = ({ title, children }) => (
  <View className="mb-6">
    <Text className="text-[#787A80] text-base mb-2">{title}</Text>
    {children}
  </View>
);

const PreviewUpload = ({ trackInfo, fileMetadata }) => {
  return (
    <View className="space-y-6">
      <View className="flex-row items-center space-x-4">
        <Image
          source={{ uri: trackInfo.coverImage }}
          className="w-24 h-24 rounded-lg"
        />
        <View>
          <Text className="text-white text-xl font-bold">{trackInfo.trackName}</Text>
          <Text className="text-[#787A80]">Single • {fileMetadata.audioFile?.duration || '00:00'}</Text>
        </View>
      </View>

      <PreviewSection title="Written by">
        <Text className="text-white">
          {fileMetadata.writers.length > 0
            ? fileMetadata.writers.join(', ')
            : 'No writers added'}
        </Text>
      </PreviewSection>

      <PreviewSection title="Produced by">
        <Text className="text-white">
          {fileMetadata.producers.length > 0
            ? fileMetadata.producers.join(', ')
            : 'No producers added'}
        </Text>
      </PreviewSection>

      <PreviewSection title="Featured Artists">
        <Text className="text-white">
          {trackInfo.featuredArtists.length > 0
            ? trackInfo.featuredArtists.join(', ')
            : 'No featured artists'}
        </Text>
      </PreviewSection>

      <PreviewSection title="Genre">
        <Text className="text-white">
          {trackInfo.primaryGenre}
          {trackInfo.secondaryGenre && `, ${trackInfo.secondaryGenre}`}
        </Text>
      </PreviewSection>

      <PreviewSection title="Release Date">
        <Text className="text-white">
          {fileMetadata.releaseDate
            ? format(new Date(fileMetadata.releaseDate), 'dd MMMM yyyy')
            : 'Immediate release'}
        </Text>
      </PreviewSection>

      {fileMetadata.isrc && (
        <PreviewSection title="ISRC">
          <Text className="text-white">{fileMetadata.isrc}</Text>
        </PreviewSection>
      )}

      {fileMetadata.explicitLyrics === 'yes' && (
        <View className="bg-[#2C2F36] px-3 py-2 rounded-md self-start">
          <Text className="text-white">Explicit</Text>
        </View>
      )}
    </View>
  );
};

export default PreviewUpload;
