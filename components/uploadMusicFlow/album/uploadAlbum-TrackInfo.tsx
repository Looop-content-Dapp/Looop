import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text } from "react-native";
import { FormField } from "../../app-components/formField copy";

interface Track {
  trackName: string;
  songType: string;
  creatorUrl: string;
  audioFile: File | null;
  explicitLyrics: string;
  writers: string[];
  producers: string[];
  isrc: string;
  releaseDate: Date | null;
}

interface TrackInfoProps {
  trackCount: number;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ trackCount }) => {
  const [tracks, setTracks] = useState(
    Array.from({ length: trackCount }, () => ({
      trackName: "",
      songType: "",
      creatorUrl: "",
      audioFile: null,
      explicitLyrics: "",
      writers: [],
      producers: [],
      isrc: "",
      releaseDate: null
    }))
  );

  const handleChange = (index: number, field: keyof Track, value: any) => {
    setTracks((prev) =>
      prev.map((track, i) =>
        i === index ? { ...track, [field]: value } : track
      )
    );
  };

  const handleAddCreator = (
    index: number,
    field: keyof Track,
    name: string
  ) => {
    setTracks((prev) =>
      prev.map((track, i) =>
        i === index &&
        name.trim() &&
        track[field] &&
        !(track[field] as string[]).includes(name)
          ? { ...track, [field]: [...track[field], name] }
          : track
      )
    );
  };

  const handleRemoveCreator = (
    index: number,
    field: keyof Track,
    name: string
  ) => {
    setTracks((prev) =>
      prev.map((track, i) =>
        i === index
          ? {
              ...track,
              [field]: (track[field] as string[]).filter(
                (item) => item !== name
              )
            }
          : track
      )
    );
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
      {tracks.map((track, index) => (
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
              //   acceptedFormats="MP3, M4A, WAV, FLAC, WMA, AIFF"
              selectedFile={track.audioFile}
              onFileSelect={(file: any) =>
                handleChange(index, "audioFile", file)
              }
              onFileRemove={() => handleChange(index, "audioFile", null)}
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
