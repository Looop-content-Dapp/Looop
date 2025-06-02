import React from 'react';
import { View, Text } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import useFileUpload, { FileType } from "@/hooks/useFileUpload";
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';

interface AlbumBasicInfoProps {
  control: Control<any>;
}

const AlbumBasicInfo: React.FC<AlbumBasicInfoProps> = ({ control }) => {
  const { pickFile } = useFileUpload();

  const genreOptions = [
    { label: "Afrobeats", value: "afrobeats" },
    { label: "Hip Hop", value: "hiphop" },
    { label: "R&B", value: "rnb" }
  ];

  const songNumberOptions = Array.from({ length: 19 }, (_, i) => ({
    label: `${i + 2} songs`,
    value: `${i + 2}`
  }));

  return (
    <>
      <Text className="text-[20px] pl-[24px] font-PlusJakartaSansBold leading-[30px] text-[#F4F4F4] mt-[32px]">
        Upload Album - Basic info
      </Text>
      <View className="py-[32px] px-[24px] gap-y-[32px] mt-[32px] rounded-[24px]">
        <Controller
          control={control}
          name="albumName"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              label="Album name"
              description="What do you want to name your album"
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
              description="Select the number of songs in your album"
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
              description="Upload your song/EP art."
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

export default AlbumBasicInfo;
