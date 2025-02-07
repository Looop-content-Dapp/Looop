import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text } from "react-native";
import { FormField } from "../../app-components/formField";
import useFileUpload, { FileType } from "@/hooks/useFileUpload";
import { useEPUpload } from "@/context/EPUploadContext";

interface Track {
  trackName: string;
  songType: string;
  creatorUrl: string;
  audioFile: {
    uri: string;
    name: string;
    type: string;
    size: number;
  } | null;
  explicitLyrics: string;
  writers: string[];
  producers: string[];
  isrc: string;
}

interface TrackInfoProps {
  trackCount: number;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ trackCount }) => {
  const { epData, updateTrackData } = useEPUpload();
  const { pickFile, isLoading } = useFileUpload();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleAudioUpload = async (index: number) => {
    const result = await pickFile(FileType.AUDIO);
    if (result?.success && result.file) {
      updateTrackData(index, { audioFile: result.file });
    }
  };

  useEffect(() => {
    // Initialize tracks in context if not already set
    if (!epData.tracks || epData.tracks.length !== trackCount) {
      const initialTracks = Array.from({ length: trackCount }, () => ({
        trackName: "",
        songType: "",
        creatorUrl: "",
        audioFile: null,
        explicitLyrics: "",
        writers: [],
        producers: [],
        isrc: "",
        releaseDate: null
      }));
      updateTrackData(0, { tracks: initialTracks });
    }
  }, [trackCount]);

  const handleChange = (index: number, field: keyof Track, value: any) => {
    updateTrackData(index, { [field]: value });
  };

  const handleAddCreator = (index: number, field: keyof Track, name: string) => {
    if (!name.trim() || !epData.tracks[index][field]) return;
    
    const currentCreators = epData.tracks[index][field] as string[];
    if (!currentCreators.includes(name)) {
      updateTrackData(index, { 
        [field]: [...currentCreators, name]
      });
    }
  };

  const handleRemoveCreator = (index: number, field: keyof Track, name: string) => {
    const currentCreators = epData.tracks[index][field] as string[];
    updateTrackData(index, {
      [field]: currentCreators.filter(item => item !== name)
    });
  };

  const explicitOptions = [
    { label: "Yes, has explicit lyrics", value: "yes" },
    { label: "No explicit lyrics", value: "no" }
  ];

  const songTypeOptions = [
    { label: "Original song", value: "original" },
    { label: "Cover", value: "cover" }
  ];

  const genreOptions = [
    { label: "Afrobeats", value: "afrobeats" },
    { label: "Hip Hop", value: "hiphop" },
    { label: "R&B", value: "rnb" }
    // Add more genres as needed
  ];

  return (
    <ScrollView>
      {epData.tracks.map((track, index) => (
        <View key={index} className="mt-[32px]">
          <Text className="text-[24px] font-PlusJakartaSansBold leading-[30px] text-[#F4F4F4]">
            Track {index + 1}
          </Text>

          <View className="py-[32px] px-[24px] bg-[#0A0B0F] gap-y-[32px] mt-[24px] rounded-[24px] mb-[32px]">
            <Text className="text-[20px] font-PlusJakartaSansBold leading-[30px] text-[#787A80]">
              Track info
            </Text>
            <FormField.TextField
              label="Song name"
              description="Don't include features in the title, you can add it later below"
              value={track.trackName}
              onChangeText={(text) => handleChange(index, "trackName", text)}
              required
            />

            <FormField.RadioField
              label="Is this an original song or a cover?"
              options={songTypeOptions}
              value={track.songType}
              onChange={(value) => handleChange(index, "songType", value)}
              required
            />

            <FormField.CreatorField
              label="Add featured artiste?"
              description="If there are features on the song, add them using their Looop creator profile links"
              placeholder="looop.creator/bigphee.com"
              value={track.creatorUrl}
              onChangeText={(text) => handleChange(index, "creatorUrl", text)}
              selectedCreators={track.writers}
              onAddCreator={(name) => handleAddCreator(index, "writers", name)}
              onRemoveCreator={(name) =>
                handleRemoveCreator(index, "writers", name)
              }
            />
          </View>

          <View className="py-[32px] px-[24px] bg-[#0A0B0F] gap-y-[32px] mt-[24px] rounded-[24px] mb-[32px]">
            <Text className="text-[20px] font-PlusJakartaSansBold leading-[30px] text-[#787A80]">
              Attach file
            </Text>
            <FormField.AudioUploadField
              label="Upload audio file"
              description="MP3, M4A, WAV, FLAC, WMA, AIFF"
              selectedFileName={track.audioFile?.name}
              onFileSelect={() => handleAudioUpload(index)}
              onRemove={() => updateTrackData(index, { audioFile: null })} // Changed from onFileRemove to onRemove
            />

            <FormField.RadioField
              label="Does the song contain explicit lyrics?"
              options={explicitOptions}
              value={track.explicitLyrics}
              onChange={(value) => handleChange(index, "explicitLyrics", value)}
            />

            <FormField.CreatorField
              label="Add Songwriter credits"
              description="You can give credit to songwriters here"
              placeholder="Ex: Peter Clement Jackson"
              value=""
              onChangeText={(name) => handleAddCreator(index, "writers", name)}
              selectedCreators={track.writers}
              onAddCreator={() => {}}
              onRemoveCreator={(name) =>
                handleRemoveCreator(index, "writers", name)
              }
              buttonText="Add writers"
            />

            <FormField.CreatorField
              label="Add Producers"
              description="Include producers and composers"
              placeholder="Ex: producer name"
              value=""
              onChangeText={(name) =>
                handleAddCreator(index, "producers", name)
              }
              selectedCreators={track.producers}
              onAddCreator={() => {}}
              onRemoveCreator={(name) =>
                handleRemoveCreator(index, "producers", name)
              }
              buttonText="Add producers"
            />

            <FormField.TextField
              label="ISRC (Optional)"
              description="For royalties tracking."
              placeholder="Song name here"
              value={track.isrc}
              onChangeText={(text) => handleChange(index, "isrc", text)}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default TrackInfo;
