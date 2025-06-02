import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { trackInfoSchema } from '@/schemas/uploadMusicSchema';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { CreatorInput } from '@/components/ui/creator-input';
import { Select } from '../ui/select';
import { ImageUpload } from '../ui/image-upload';

const TrackUploadForm = ({ onSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(trackInfoSchema),
    defaultValues: {
      trackName: '',
      songType: 'original',
      featuredArtists: [],
      primaryGenre: '',
      secondaryGenre: '',
      coverImage: ""
    }
  });

  const songTypeOptions = [
    { label: 'Original song', value: 'original' },
    { label: 'Cover', value: 'cover' }
  ];

  const genreOptions = [
    { label: 'Afrobeats', value: 'afrobeats' },
    { label: 'Hip Hop', value: 'hiphop' },
    { label: 'R&B', value: 'rnb' }
  ];

  // Add form submission handler
  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <View className="gap-y-[32px]">
      <Controller
        control={control}
        name="trackName"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Song name"
            description="Don't include features in the title"
            placeholder='Happy days'
            value={value}
            onChangeText={onChange}
            error={errors.trackName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="songType"
        render={({ field: { onChange, value } }) => (
          <RadioGroup
            label="Is this an original song or a cover?"
            options={songTypeOptions}
            value={value}
            onChange={onChange}
            error={errors.songType?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="featuredArtists"
        render={({ field: { onChange, value } }) => (
          <CreatorInput
            label="Add featured artiste?"
            description="Add using Looop creator profile links"
            placeholder="looop.creator/bigphee.com"
            value={value}
            onChange={(inputValue: string) => {
              // This handles the input field changes
              onChange(inputValue);
            }}
            selectedCreators={Array.isArray(value) ? value.filter((v): v is string => v !== undefined) : []}
            onAddCreator={(creator) => {
              const currentValue = Array.isArray(value) ? value : [];
              onChange([...currentValue, creator].filter((v): v is string => v !== undefined));
            }}
            onRemoveCreator={(creator) => {
              const currentValue = Array.isArray(value) ? value : [];
              onChange(currentValue.filter(c => c !== creator));
            }}
            error={errors.featuredArtists?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="primaryGenre"
        render={({ field: { onChange, value } }) => (
          <Select
            label="Primary Genre"
            description="Add main genre"
            options={genreOptions}
            value={value}
            onValueChange={onChange}
            error={errors.primaryGenre?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="secondaryGenre"
        render={({ field: { onChange, value } }) => (
          <Select
            label="Secondary Genre (Optional)"
            description="Add a secondary genre"
            options={genreOptions}
            value={value}
            onValueChange={onChange}
            error={errors.secondaryGenre?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="coverImage"
        render={({ field: { onChange, value } }) => (
          <ImageUpload
            label="Song/Album Cover"
            description="Upload your song/album art"
            value={value}
            onChange={onChange}
            maxSize="20MB"
            acceptedFormats="JPEG"
            error={errors.coverImage?.message}
          />
        )}
      />
    </View>
  );
};

export default TrackUploadForm;
