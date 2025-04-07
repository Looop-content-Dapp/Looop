import { View, Text, Alert } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppBackButton } from "@/components/app-components/back-btn";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { AppButton } from "@/components/app-components/button";
import EPBasicInfo from "@/components/uploadMusicFlow/ep/uploadEP-BasicInfo";
import TrackInfo from "@/components/uploadMusicFlow/ep/uploadEP-TrackInfo";
import EPPreview from "@/components/uploadMusicFlow/ep/uploadEP-PreviewUpload";
import { EPUploadProvider } from "@/context/EPUploadContext";
import { epSchema } from "@/schemas/uploadMusicSchema";

const UploadEPContent = () => {
  const [flow, setFlow] = useState<"BasicInfo" | "EPDetails" | "PreviewUpload">("BasicInfo");
  const navigation = useNavigation();

  const form = useForm({
    resolver: yupResolver(epSchema),
    defaultValues: {
      epName: "",
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
    if (flow === "BasicInfo") {
      const isValid = await form.trigger(["epName", "numberOfSongs", "primaryGenre", "coverImage"]);
      if (isValid) setFlow("EPDetails");
    } else if (flow === "EPDetails") {
      const isValid = await form.trigger("tracks");
      if (isValid) setFlow("PreviewUpload");
    }
  };

  const handleBack = () => {
    if (flow === "BasicInfo") {
      navigation.goBack();
    } else if (flow === "EPDetails") {
      setFlow("BasicInfo");
    } else if (flow === "PreviewUpload") {
      setFlow("EPDetails");
    }
  };

  const handleFlow = () => {
    switch (flow) {
      case "BasicInfo":
        return <EPBasicInfo control={form.control} />;
      case "EPDetails":
        return <TrackInfo control={form.control} />;
      case "PreviewUpload":
        return <EPPreview data={form.getValues()} />;
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

const UploadEP = () => {
  return (
    <EPUploadProvider>
      <UploadEPContent />
    </EPUploadProvider>
  );
};

export default UploadEP;
