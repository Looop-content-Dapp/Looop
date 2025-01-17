import React, { useState } from "react";
import { FormField } from "../../app-components/formField copy";
import { Text, View } from "react-native";

const EPBasicInfo = () => {
  const [ePName, setEPName] = useState("");
  const [primaryGenre, setPrimaryGenre] = useState("");
  const [secondaryGenre, setSecondaryGenre] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const genreOptions = [
    { label: "Afrobeats", value: "afrobeats" },
    { label: "Hip Hop", value: "hiphop" },
    { label: "R&B", value: "rnb" }
    // Add more genres as needed
  ];

  return (
    <>
      <Text className="text-[24px] font-PlusJakartaSansBold leading-[30px] text-[#F4F4F4] mt-[32px]">
        Upload EP - Basic info
      </Text>
      <View className="py-[32px] px-[24px] bg-[#0A0B0F] gap-y-[32px] mt-[32px] rounded-[24px] mb-[32px]">
        <FormField.TextField
          label="EP name"
          description="What do you want to name you EP"
          value={ePName}
          onChangeText={setEPName}
          required
        />

        <FormField.TextField
          label="No. of songs"
          description="You can have between 2 - 6 songs on your EP"
          value={ePName}
          onChangeText={setEPName}
          keyboardType="numeric"
          placeholder="Enter no. of songs"
          required
        />

        <FormField.PickerField
          label="Primary Genre"
          description="Add main genres"
          value={primaryGenre}
          onSelect={setPrimaryGenre}
          options={genreOptions}
          placeholder="Select genre"
          required
        />

        <FormField.PickerField
          label="Secondary Genre (Optional)"
          description="Add a secondary genre"
          value={secondaryGenre}
          onSelect={setSecondaryGenre}
          options={genreOptions}
          placeholder="Select genre"
        />

        {/* Add Quick Note Component */}
        {/* <QuickNote /> */}

        <FormField.ImageUploadField
          label="Cover art"
          description="Upload your song/EP art."
          value={coverImage || undefined}
          onUpload={() => {
            // Implement image upload logic
            setCoverImage("placeholder-url" as any);
          }}
          maxSize="20MB"
          acceptedFormats="JPEG"
          required
        />
      </View>
    </>
  );
};

export default EPBasicInfo;
