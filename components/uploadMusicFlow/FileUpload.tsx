import React from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { fileMetadataSchema } from '@/schemas/uploadMusicSchema';
import { AudioUpload } from '@/components/ui/audio-upload';
import { RadioGroup } from '@/components/ui/radio-group';
import { CreatorInput } from '@/components/ui/creator-input';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';

const FileUpload = ({ onSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(fileMetadataSchema),
    defaultValues: {
      audioFile: null,
      explicitLyrics: '',
      writers: [],
      producers: [],
      isrc: '',
      releaseDate: null
    }
  });

  const explicitOptions = [
    { label: 'Yes, has explicit lyrics', value: 'yes' },
    { label: 'No explicit lyrics', value: 'no' }
  ];

  return (
    <View className="space-y-6">
      <Controller
        control={control}
        name="audioFile"
        render={({ field: { onChange, value } }) => (
          <AudioUpload
            label="Attach file"
            description="Upload audio file"
            acceptedFormats="MP3, M4A, WAV, FLAC, WMA, AIFF"
            value={value}
            onChange={onChange}
            error={errors.audioFile?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="explicitLyrics"
        render={({ field: { onChange, value } }) => (
          <RadioGroup
            label="Does the song contain explicit lyrics?"
            options={explicitOptions}
            value={value}
            onChange={onChange}
            error={errors.explicitLyrics?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="writers"
        render={({ field: { onChange, value } }) => (
          <CreatorInput
            label="Add Songwriter credits"
            description="You can give credit to songwriters here"
            placeholder="Ex: Peter Clement Jackson"
            value={value}
            onChange={onChange}
            error={errors.writers?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="producers"
        render={({ field: { onChange, value } }) => (
          <CreatorInput
            label="Add Producers"
            description="Include producers and composers"
            placeholder="looop.creator/creator.com"
            value={value}
            onChange={onChange}
            error={errors.producers?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="isrc"
        render={({ field: { onChange, value } }) => (
          <Input
            label="ISRC (Optional)"
            description="For royalties tracking"
            placeholder="Enter ISRC code"
            value={value}
            onChangeText={onChange}
            error={errors.isrc?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="releaseDate"
        render={({ field: { onChange, value } }) => (
          <DatePicker
            label="Schedule release"
            description="Plan your release schedule"
            value={value}
            onChange={onChange}
            error={errors.releaseDate?.message}
            quickNote="All scheduled releases will be available at midnight in listeners' local timezone"
          />
        )}
      />
    </View>
  );
};

export default FileUpload;
