import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "react-native";
import { Control, Controller, useFieldArray } from "react-hook-form";
import useFileUpload, { FileType } from "@/hooks/useFileUpload";
import { Input } from '@/components/ui/input';
import { AudioUpload } from '@/components/ui/audio-upload';
import { RadioGroup } from '@/components/ui/radio-group';
import { CreatorInput } from '@/components/ui/creator-input';

interface TrackInfoProps {
  control: Control<any>;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ control }) => {
  const { pickFile } = useFileUpload();

  const { fields } = useFieldArray({
    control,
    name: "tracks"
  });

  const songTypeOptions = [
    { label: "Original song", value: "original" },
    { label: "Cover", value: "cover" }
  ];

  const explicitOptions = [
    { label: "Yes, has explicit lyrics", value: "yes" },
    { label: "No explicit lyrics", value: "no" }
  ];

  return (
    <ScrollView className="flex-1">
      {fields.map((field, index) => (
        <View key={field.id} className="mt-[32px]">
          <Text className="text-[24px] font-PlusJakartaSansBold leading-[30px] text-[#F4F4F4]">
            Track {index + 1}
          </Text>

          <View className="py-[32px] px-[24px] bg-[#111318] mx-auto gap-y-[32px] mt-[24px] rounded-[24px]">
            <Text className="text-[20px] font-PlusJakartaSansBold leading-[30px] text-[#787A80]">
              Track info
            </Text>

            <Controller
              control={control}
              name={`tracks.${index}.trackName`}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  label="Song name"
                  description="Don't include features in the title, you can add it later below"
                  value={value}
                  onChangeText={onChange}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name={`tracks.${index}.songType`}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <RadioGroup
                  label="Is this an original song or a cover?"
                  options={songTypeOptions}
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name={`tracks.${index}.featuredArtists`}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CreatorInput
                  label="Add featured artiste?"
                  description="If there are features on the song, add them using their Looop creator profile links"
                  placeholder="looop.creator/bigphee.com"
                  value={value || []}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />
          </View>

          <View className="py-[32px] px-[24px] bg-[#111318] mx-auto gap-y-[32px] mt-[24px] rounded-[24px]">
            <Text className="text-[20px] font-PlusJakartaSansBold leading-[30px] text-[#787A80]">
              Attach file
            </Text>

            <Controller
              control={control}
              name={`tracks.${index}.audioFile`}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <AudioUpload
                  label="Upload audio file"
                  description="MP3, M4A, WAV, FLAC, WMA, AIFF"
                  acceptedFormats="MP3, M4A, WAV, FLAC, WMA, AIFF"
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name={`tracks.${index}.explicitLyrics`}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <RadioGroup
                  label="Does the song contain explicit lyrics?"
                  options={explicitOptions}
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name={`tracks.${index}.writers`}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CreatorInput
                  label="Add Songwriter credits"
                  description="You can give credit to songwriters here"
                  placeholder="Ex: Peter Clement Jackson"
                  value={value || []}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name={`tracks.${index}.producers`}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <CreatorInput
                  label="Add Producers"
                  description="Include producers and composers"
                  placeholder="Ex: producer name"
                  value={value || []}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name={`tracks.${index}.isrc`}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  label="ISRC (Optional)"
                  description="For royalties tracking."
                  placeholder="Enter ISRC"
                  value={value}
                  onChangeText={onChange}
                  error={error?.message}
                />
              )}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default TrackInfo;
