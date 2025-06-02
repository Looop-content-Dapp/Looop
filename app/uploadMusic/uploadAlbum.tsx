import { View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppBackButton } from "@/components/app-components/back-btn";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { AppButton } from "@/components/app-components/button";
import AlbumBasicInfo from "@/components/uploadMusicFlow/album/uploadAlbum-BasicInfo";
import TrackInfo from "@/components/uploadMusicFlow/album/uploadAlbum-TrackInfo";
import AlbumPreview from "@/components/uploadMusicFlow/album/uploadAlbum-PreviewUpload";
import { albumSchema } from "@/schemas/uploadMusicSchema";
import { Alert } from "react-native";

const UploadAlbum = () => {
  const [flow, setFlow] = useState<"BasicInfo" | "AlbumDetails" | "PreviewUpload">("BasicInfo");
  const navigation = useNavigation();

  const form = useForm({
    resolver: yupResolver(albumSchema),
    defaultValues: {
      albumName: "",
      numberOfSongs: 2,
      primaryGenre: "",
      secondaryGenre: "",
      coverImage: "",
      tracks: Array(2).fill({
        trackName: "",
        songType: "",
        audioFile: null,
        explicitLyrics: "",
        writers: [],
        producers: [],
        isrc: "",
        releaseDate: null,
        creatorUrl: ""
      })
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: "#000" },
      headerLeft: () => (
        <AppBackButton name="Upload music" onBackPress={handleBack} />
      ),
      headerTitle: ""
    });
  }, [navigation, flow]);

  const handleNextPage = async () => {
    try {
      if (flow === "BasicInfo") {
        await form.trigger(["albumName", "numberOfSongs", "primaryGenre", "coverImage"]);
        setFlow("AlbumDetails");
      } else if (flow === "AlbumDetails") {
        await form.trigger("tracks");
        setFlow("PreviewUpload");
      }
    } catch (error) {
      Alert.alert("Validation Error", "Please fill in all required fields");
    }
  };

  const handleBack = () => {
    if (flow === "BasicInfo") {
      navigation.goBack();
    } else if (flow === "AlbumDetails") {
      setFlow("BasicInfo");
    } else if (flow === "PreviewUpload") {
      setFlow("AlbumDetails");
    }
  };

  const handleFlow = () => {
    switch (flow) {
      case "BasicInfo":
        return <AlbumBasicInfo control={form.control} />;
      case "AlbumDetails":
        return <TrackInfo control={form.control} />;
      case "PreviewUpload":
        return <AlbumPreview data={form.getValues()} />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ paddingBottom: 120 }}
      className="flex-1 min-h-screen"
    >
      <View>{handleFlow()}</View>

      <AppButton.Primary
        text="Continue"
        color="#57E09A"
        loading={form.formState.isSubmitting}
        onPress={handleNextPage}
      />
    </KeyboardAwareScrollView>
  );
};

export default UploadAlbum;
