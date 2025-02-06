import React, { useState } from "react";
import { FormField } from "../../app-components/formField";
import { Text, View } from "react-native";
import { useEPUpload } from "@/context/EPUploadContext";
import useFileUpload, { FileType } from "@/hooks/useFileUpload";

const EPBasicInfo: React.FC<{ onTrackCountChange: (count: number) => void }> = ({ onTrackCountChange }) => {
  const { epData, updateEPData } = useEPUpload();
  const { pickFile, isLoading } = useFileUpload();

  const handleNumberOfSongsChange = (value: string) => {
    const count = parseInt(value);
    if (count >= 2 && count <= 6) {
      onTrackCountChange(count); // Update parent component
      updateEPData({ 
        numberOfSongs: value,
        tracks: Array(count).fill({
          trackName: '',
          songType: '',
          audioFile: null,
          explicitLyrics: '',
          writers: [],
          producers: [],
          isrc: '',
          creatorUrl: ''
        })
      });
    }
  };

  const handleCoverImageUpload = async () => {
    const result = await pickFile(FileType.IMAGE);
    if (result?.success && result.file) {
      updateEPData({ coverImage: result.file });
    }
  };

  // Remove unused state variables since we're using context
  const genreOptions = [
    { label: "Afrobeats", value: "afrobeats" },
    { label: "Hip Hop", value: "hiphop" },
    { label: "R&B", value: "rnb" }
  ];

  const songNumberOptions = Array.from({ length: 5 }, (_, i) => ({
    label: `${i + 2} songs`,
    value: `${i + 2}`
  }));

  return (
    <>
      <Text className="text-[24px] font-PlusJakartaSansBold leading-[30px] text-[#F4F4F4] mt-[32px]">
        Upload EP - Basic info
      </Text>
      <View className="py-[32px] px-[24px] bg-[#0A0B0F] gap-y-[32px] mt-[32px] rounded-[24px] mb-[32px]">
        <FormField.TextField
          label="EP name"
          description="What do you want to name your EP"
          value={epData.epName}
          onChangeText={(value) => updateEPData({ epName: value })}
          required
        />

        <FormField.PickerField
          label="No. of songs"
          description="You can have between 2 - 6 songs on your EP"
          value={epData.numberOfSongs}
          onSelect={handleNumberOfSongsChange}
          options={songNumberOptions}
          placeholder="Select number of songs"
          required
        />

        <FormField.PickerField
          label="Primary Genre"
          description="Add main genres"
          value={epData.primaryGenre}
          onSelect={(value) => updateEPData({ primaryGenre: value })}
          options={genreOptions}
          placeholder="Select genre"
          required
        />

        <FormField.PickerField
          label="Secondary Genre (Optional)"
          description="Add a secondary genre"
          value={epData.secondaryGenre}
          onSelect={(value) => updateEPData({ secondaryGenre: value })}
          options={genreOptions}
          placeholder="Select genre"
        />

        <FormField.ImageUploadField
          label="Cover art"
          description="Upload your song/EP art."
          value={epData.coverImage?.uri}
          onUpload={handleCoverImageUpload}
          maxSize="20MB"
          acceptedFormats="JPEG"
          required
        />
      </View>
    </>
  );
};

export default EPBasicInfo;
