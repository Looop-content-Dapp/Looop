import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import useFileUpload from "@/hooks/core/useFileUpload";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { Text, View } from "react-native";

interface EPBasicInfoProps {
  control: Control<any>;
}

const EPBasicInfo: React.FC<EPBasicInfoProps> = ({ control }) => {
  const { pickFile } = useFileUpload();

  const genreOptions = [
    { label: "Afrobeats", value: "afrobeats" },
    { label: "Hip Hop", value: "hiphop" },
    { label: "R&B", value: "rnb" },
  ];

  const songNumberOptions = Array.from({ length: 5 }, (_, i) => ({
    label: `${i + 2} songs`,
    value: `${i + 2}`,
  }));

  return (
    <>
      <Text className="text-[20px] pl-[24px] font-PlusJakartaSansBold leading-[30px] text-[#F4F4F4] mt-[32px]">
        Upload EP - Basic info
      </Text>
      <View className="py-[32px] px-[24px] gap-y-[32px] mt-[32px] rounded-[24px]">
        <Controller
          control={control}
          name="epName"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              label="EP name"
              description="What do you want to name your EP"
              value={value}
              onChangeText={onChange}
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="numberOfSongs"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Select
              label="No. of songs"
              description="You can have between 2 - 6 songs on your EP"
              value={String(value)}
              onValueChange={onChange}
              options={songNumberOptions}
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="primaryGenre"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Select
              label="Primary Genre"
              description="Add main genres"
              value={value}
              onValueChange={onChange}
              options={genreOptions}
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="secondaryGenre"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Select
              label="Secondary Genre (Optional)"
              description="Add a secondary genre"
              value={value}
              onValueChange={onChange}
              options={genreOptions}
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="coverImage"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ImageUpload
              label="Cover art"
              description="Upload your EP art."
              value={value}
              onChange={onChange}
              maxSize="20MB"
              acceptedFormats="JPEG"
              error={error?.message}
            />
          )}
        />
      </View>
    </>
  );
};

export default EPBasicInfo;
