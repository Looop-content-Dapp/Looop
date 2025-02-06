import React, { useState } from "react";
import { FormField } from "../../app-components/formField";
import { Text, View } from "react-native";
import { useAlbumUpload } from "@/context/AlbumUploadContext";
import useFileUpload, { FileType } from "@/hooks/useFileUpload";

interface AlbumBasicInfoProps {
  onTrackCountChange: (count: number) => void;
}

const AlbumBasicInfo: React.FC<AlbumBasicInfoProps> = ({ onTrackCountChange }) => {
  const { albumData, updateAlbumData } = useAlbumUpload();
  const { pickFile, isLoading } = useFileUpload();

  const handleCoverImageUpload = async () => {
    const result = await pickFile(FileType.IMAGE);
    if (result?.success && result.file) {
      updateAlbumData({ coverImage: result.file });
    }
  };

  const handleNumberOfSongsChange = (value: string) => {
    const count = parseInt(value);
    updateAlbumData({ 
      numberOfSongs: value,
      tracks: Array(count).fill({
        trackName: '',
        songType: '',
        audioFile: null,
        explicitLyrics: '',
        writers: [],
        producers: [],
        isrc: '',
        featuredArtists: []
      })
    });
    onTrackCountChange(count);
  };

  const [albumName, setAlbumName] = useState("");
  const [numberOfSongs, setNumberOfSongs] = useState("");
  const [primaryGenre, setPrimaryGenre] = useState("");
  const [secondaryGenre, setSecondaryGenre] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const genreOptions = [
    { label: "Afrobeats", value: "afrobeats" },
    { label: "Hip Hop", value: "hiphop" },
    { label: "R&B", value: "rnb" }
    // Add more genres as needed
  ];

  const songNumberOptions = Array.from({ length: 25 }, (_, i) => ({
    label: `${i + 2} songs`,
    value: `${i + 2}`
  }));

  // const handleNumberOfSongsChange = (value: string) => {
  //   setNumberOfSongs(value);
  //   onTrackCountChange(parseInt(value));
  // };

  return (
    <>
      <Text className="text-[24px] font-PlusJakartaSansBold leading-[30px] text-[#F4F4F4] mt-[32px]">
        Upload Album - Basic info
      </Text>
      <View className="py-[32px] px-[24px] bg-[#0A0B0F] gap-y-[32px] mt-[32px] rounded-[24px] mb-[32px]">
        <FormField.TextField
          label="Album name"
          description="What do you want to name you Album"
          value={albumName}
          onChangeText={setAlbumName}
          required
        />

        <FormField.PickerField
          label="No. of songs"
          description="You can have between 2 - 26 songs on your Album"
          value={numberOfSongs}
          onSelect={handleNumberOfSongsChange}
          options={songNumberOptions}
          placeholder="Select number of songs"
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

        <FormField.ImageUploadField
          label="Cover art"
          description="Upload your song/album art."
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

export default AlbumBasicInfo;
