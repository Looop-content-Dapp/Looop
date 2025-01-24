import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FormField } from "../app-components/formField";
import useFileUpload from "@/hooks/useFileUpload";

const TrackUploadForm = () => {
  const { files, isLoading, error, progress, pickFile, removeFile } =
    useFileUpload();

  const [trackName, setTrackName] = useState("");
  const [songType, setSongType] = useState("original");
  const [creatorUrl, setCreatorUrl] = useState("");
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [primaryGenre, setPrimaryGenre] = useState("");
  const [secondaryGenre, setSecondaryGenre] = useState("");
  const [coverImage, setCoverImage] = useState(null);

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

  const handleAddCreator = (url: string) => {
    if (url && !selectedCreators.includes(url)) {
      setSelectedCreators([...selectedCreators, url]);
      setCreatorUrl("");
    }
  };

  const handleRemoveCreator = (creator: string) => {
    setSelectedCreators(selectedCreators.filter((c) => c !== creator));
  };

  return (
    <>
      <FormField.TextField
        label="Song name"
        description="Don't include features in the title, you can add it later below"
        value={trackName}
        onChangeText={setTrackName}
        required
      />

      <FormField.RadioField
        label="Is this an original song or a cover?"
        options={songTypeOptions}
        value={songType}
        onChange={setSongType}
        required
      />

      <FormField.CreatorField
        label="Add featured artiste?"
        description="If there are features on the song, add them using their Looop creator profile links"
        placeholder="looop.creator/bigphee.com"
        value={creatorUrl}
        onChangeText={setCreatorUrl}
        selectedCreators={selectedCreators}
        onAddCreator={handleAddCreator}
        onRemoveCreator={handleRemoveCreator}
      />

      <FormField.PickerField
        label="Primary Genre"
        description="Add main genres"
        value={primaryGenre}
        onSelect={setPrimaryGenre}
        options={genreOptions}
        required
      />

      <FormField.PickerField
        label="Secondary Genre (Optional)"
        description="Add a secondary genre"
        value={secondaryGenre}
        onSelect={setSecondaryGenre}
        options={genreOptions}
      />

      {/* Add Quick Note Component */}
      {/* <QuickNote /> */}

      <FormField.ImageUploadField
        label="Song/Album Cover"
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
    </>
  );
};

export default TrackUploadForm;
