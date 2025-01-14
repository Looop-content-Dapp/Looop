import { View, Text } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { AppButton } from "@/components/app-components/button";
import FileUpload from "@/components/uploadMusicFlow/FileUpload";
import AlbumBasicInfo from "@/components/uploadMusicFlow/album/uploadAlbum-BasicInfo";
import TrackInfo from "@/components/uploadMusicFlow/album/uploadAlbum-TrackInfo";
import AlbumPreview from "@/components/uploadMusicFlow/album/uploadAlbum-PreviewUpload";

// TODO: Replace this with the number of tracks set in the album details component.
// TODO: Using a demo for now!
const TRACK_COUNT: number = 7;

const UploadAlbum = () => {
  const [flow, setFlow] = useState<
    "BasicInfo" | "AlbumDetails" | "PreviewUpload"
  >("BasicInfo");
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions?.({
      headerShown: true,
      headerStyle: {
        backgroundColor: "#000"
      },
      headerLeft: () => (
        <AppBackButton name="Upload music" onBackPress={() => handleBack()} />
      ),
      headerTitle: ""
    });
  }, [navigation, flow]);

  const handleNextPage = () => {
    if (flow === "BasicInfo") {
      setFlow("AlbumDetails");
    } else if (flow === "AlbumDetails") {
      setFlow("PreviewUpload");
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
        return <AlbumBasicInfo />;
      case "AlbumDetails":
        return <TrackInfo trackCount={TRACK_COUNT} />;
      case "PreviewUpload":
        return <AlbumPreview />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        paddingBottom: 120
      }}
      className="flex-1 min-h-screen px-[24px]">
      <View>{handleFlow()}</View>

      <AppButton.Primary
        text="Continue"
        color="#57E09A"
        loading={false}
        onPress={handleNextPage}
      />
    </KeyboardAwareScrollView>
  );
};

export default UploadAlbum;
